const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        required: true
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    skills: [skillSchema],
    address: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function(v) {
                    return v.length === 2 &&
                           v[0] >= -180 && v[0] <= 180 &&
                           v[1] >= -90 && v[1] <= 90;
                },
                message: 'Invalid coordinates'
            }
        }
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    stats: {
        totalRequests: {
            type: Number,
            default: 0
        },
        completedExchanges: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });

// Create text index for search functionality
userSchema.index({
    'username': 'text',
    'skills.name': 'text',
    'address': 'text'
});

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// Static method to search users by skills and location
userSchema.statics.searchUsers = async function(query, skillLevel, maxDistance) {
    const searchCriteria = {};
    
    if (query) {
        searchCriteria.$text = { $search: query };
    }
    
    if (skillLevel) {
        searchCriteria['skills.level'] = skillLevel;
    }
    
    let aggregation = [
        { $match: searchCriteria }
    ];

    if (maxDistance) {
        aggregation.unshift({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                distanceField: 'distance',
                maxDistance: parseInt(maxDistance) * 1000, // Convert km to meters
                spherical: true
            }
        });
    }

    return this.aggregate(aggregation);
};

const User = mongoose.model('User', userSchema);

module.exports = User;