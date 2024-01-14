const mongoose = require('mongoose');

const likePageSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        type: {
            type: String,
            enum: ['like', 'dislike'],
            required: true,
        },
    }],
    totalLikes: {
        type: Number,
        default: 0,
    },
    totalDislikes: {
        type: Number,
        default: 0,
    },
});

const LikePage = mongoose.model('LikePage', likePageSchema);

module.exports = LikePage;
