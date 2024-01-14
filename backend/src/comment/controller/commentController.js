const path = require('path');
const { logError, logInfo } = require('../../../util/logger');
const mongoose = require('mongoose')






const commentService = require("../services/commentServices");


const findComment = async (req, res, next) => {
    logInfo("going to fetch all comment of any specific post", path.basename(__filename), findComment.name);

    try {
        const { postId } = req.params;




        let result = await commentService.findComment(postId);
        res.status(200).json(result);

    } catch (ex) {
        logError(ex, path.basename(__filename));
        throw new Error(ex.message);

    }

}

const createComment = async (req, res, next) => {
    logInfo("going to create a comment on post", path.basename(__filename), createComment.name);
    try {

        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;



        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Bad Request - Invalid createdBy value' });
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Bad Request - Invalid postId value' });
        }

        let result = await commentService.createComment(content, postId, userId);
        res.status(200).json({ msg: 'comment added successfully' });

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json({ msg: 'internal server error' });

    }


}

const deleteComment = async (req, res, next) => {

    const commentId = req.params.commentId;
    const userId = req.user.userId;

    logInfo("going to delete the comment", path.basename(__filename), commentId.name);
    try {


        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: 'Bad Request - Invalid commentId value' });
        }

        let result = await commentService.deleteComment(commentId, userId);

        if (!result) {
            res.status(401).json({ msg: "you are not authorise for delete the comment or comment not found", success: false });
        }
        else {
            res.status(200).json({ msg: 'comment deleted from the record', success: true });
        }
    } catch (ex) {
        log(ex, path.basename(__filename));
        res.status(500).json('internal server error');


    }



}





module.exports = { findComment, createComment, deleteComment }
