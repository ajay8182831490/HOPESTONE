

const commentModel = require('../model/commentModel');


//findComment, createComment, deleteComment 
const findComment = async (postId) => {
    try {
        let result = await commentModel.findComment(postId);

        return result;
    } catch (ex) {
        throw new Error(ex.message);
    }

}

const createComment = async (content, postId, userId) => {
    try {
        if (!content) {
            throw new Error("missing field required");
        }

        let newComment = new commentModel(content, postId, userId);
        return await newComment.save(userId, postId);


    } catch (ex) {
        throw new Error(ex.message);

    }



}

const deleteComment = async (commentId, userId) => {

    try {
        return await commentModel.deleteComment(commentId, userId);

    } catch (ex) {
        throw new Error(ex.message);
    }

}



module.exports = { findComment, createComment, deleteComment };