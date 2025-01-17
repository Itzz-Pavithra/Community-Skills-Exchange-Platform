const User = require('../models/User');

const searchController = {
    // Search users by skills and location
    searchUsers: async (req, res) => {
        try {
            const { query, skillLevel, distance, latitude, longitude } = req.query;

            let searchCriteria = {};
            
            // Text search if query provided
            if (query) {
                searchCriteria.$text = { $search: query };
            }

            // Skill level filter
            if (skillLevel) {
                searchCriteria['skills.level'] = skillLevel;
            }

            let users;

            // If location parameters provided, use geospatial search
            if (distance && latitude && longitude) {
                users = await User.find({
                    ...searchCriteria,
                    location: {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [parseFloat(longitude), parseFloat(latitude)]
                            },
                            $maxDistance: parseInt(distance) * 1000 // Convert km to meters
                        }
                    }
                })
                .select('-email') // Exclude sensitive information
                .limit(20);
            } else {
                // Regular search without location
                users = await User.find(searchCriteria)
                    .select('-email')
                    .limit(20);
            }

            // Format response
            const formattedUsers = users.map(user => ({
                id: user._id,
                username: user.username,
                skills: user.skills,
                address: user.address,
                distance: user.distance ? Math.round(user.distance / 1000) : null // Convert to km if available
            }));

            res.json(formattedUsers);

        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ error: 'Error performing search' });
        }
    },

    // Get nearby users
    getNearbyUsers: async (req, res) => {
        try {
            const { latitude, longitude, maxDistance = 10 } = req.query; // Default 10km

            if (!latitude || !longitude) {
                return res.status(400).json({ error: 'Location coordinates required' });
            }

            const nearbyUsers = await User.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        },
                        $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
                    }
                }
            })
            .select('username skills address')
            .limit(10);

            res.json(nearbyUsers);

        } catch (error) {
            console.error('Error fetching nearby users:', error);
            res.status(500).json({ error: 'Error fetching nearby users' });
        }
    }
};

module.exports = searchController;