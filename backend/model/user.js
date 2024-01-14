const mongoose = require('mongoose');

const { getDate } = require("../util/util")

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String, required: true, unique: true
    }
    ,


    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    image: {
        type: String,
        default: ""

    },
    tokens: {
        type: String,
        default: ""
    }, // Array of authentication tokens (as strings)
    commentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    }],
    postIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }],


    likedPostIds: {
        type: Array, default: []
    },
    added_on: {
        type: String,
        default: getDate()
    }, otp: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },


})

module.exports = mongoose.model('user', userSchema);