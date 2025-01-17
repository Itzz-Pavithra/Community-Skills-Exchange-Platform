const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transport configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const userController = {
    // Create new user
    createUser: async (req, res) => {
        try {
            const { username, email, skills, address, location } = req.body;

            // Validate required fields
            if (!username || !email || !skills || !address || !location) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });

            if (existingUser) {
                return res.status(400).json({ 
                    error: 'User with this email or username already exists' 
                });
            }

            // Create new user
            const user = new User({
                username,
                email,
                skills,
                address,
                location
            });

            await user.save();

            // Send welcome email
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Welcome to SkillShare Community',
                html: `
                    <h1>Welcome to SkillShare Community!</h1>
                    <p>Hi ${username},</p>
                    <p>Your account has been successfully created. You can now start connecting with other members and sharing skills!</p>
                `
            });

            res.status(201).json({ 
                message: 'User created successfully',
                userId: user._id 
            });

        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    },

    // Get current user profile
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update last login
            await user.updateLastLogin();

            res.json({
                username: user.username,
                email: user.email,
                skills: user.skills,
                address: user.address,
                stats: user.stats,
                lastLogin: user.lastLogin
            });

        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Error fetching user data' });
        }
    },

    // Get user statistics
    getUserStats: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const stats = {
                totalRequests: user.stats.totalRequests,
                completedExchanges: user.stats.completedExchanges,
                skillsOffered: user.skills.length,
                // Add more statistics as needed
            };

            res.json(stats);

        } catch (error) {
            console.error('Error fetching user stats:', error);
            res.status(500).json({ error: 'Error fetching user statistics' });
        }
    },

    // Get skills analytics
    getSkillsAnalytics: async (req, res) => {
        try {
            const skillsDistribution = await User.aggregate([
                { $unwind: '$skills' },
                {
                    $group: {
                        _id: '$skills.name',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);

            res.json(skillsDistribution);

        } catch (error) {
            console.error('Error fetching skills analytics:', error);
            res.status(500).json({ error: 'Error fetching skills analytics' });
        }
    },

    // Initiate contact
    initiateContact: async (req, res) => {
        try {
            const { to, subject, body } = req.body;

            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject,
                text: body
            });

            // Update request count
            await User.findByIdAndUpdate(req.userId, {
                $inc: { 'stats.totalRequests': 1 }
            });

            res.json({ message: 'Contact request sent successfully' });

        } catch (error) {
            console.error('Error sending contact request:', error);
            res.status(500).json({ error: 'Error sending contact request' });
        }
    },

    // Complete exchange
    completeExchange: async (req, res) => {
        try {
            const { exchangeId } = req.body;

            await User.findByIdAndUpdate(req.userId, {
                $inc: { 'stats.completedExchanges': 1 }
            });

            res.json({ message: 'Exchange marked as complete' });

        } catch (error) {
            console.error('Error completing exchange:', error);
            res.status(500).json({ error: 'Error completing exchange' });
        }
    },

    // Update profile
    updateProfile: async (req, res) => {
        try {
            const { skills, address, location } = req.body;

            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update fields if provided
            if (skills) user.skills = skills;
            if (address) user.address = address;
            if (location) user.location = location;

            await user.save();

            res.json({ message: 'Profile updated successfully' });

        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Error updating profile' });
        }
    }
};

module.exports = userController;