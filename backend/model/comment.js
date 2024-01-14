const mongoose = require('mongoose');
const { getDate } = require("../util/util")





const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },
    user: {
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },

    },
    createdAt: {
        type: String,
        default: getDate(),
    },
    /* replies: [
         {
             content: {
                 type: String,
                 required: true,
             },
             user: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'user',
                 required: true,
             },
             createdAt: {
                 type: Date,
                 default: getDate(),
             },
         },
     ],*/
    // Add other fields as needed
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;


module.exports = Comment;

