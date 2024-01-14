const mongoose = require('mongoose');
const { getDate } = require("../util/util")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    categories: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    commentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    totalViews: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: String,
        default: getDate(),
    },
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
