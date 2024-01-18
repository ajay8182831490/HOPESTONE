const path = require('path');
const { logError, logInfo } = require('../../../util/logger');
const mongoose = require('mongoose')
const postSchema = require("../../../model/post");
const getPool = require('../../../util/db')
const { Types } = require('mongoose');

// createpost,deletepost,updatePost

const postService = require("../services/postServices");



const createPost = async (req, res, next) => {
    logInfo("going to create a new post", path.basename(__filename), createPost.name);


    try {

        const { title, categories, description } = req.body;


        const createdBy = req.user.userId;;

        if (!mongoose.Types.ObjectId.isValid(createdBy)) {
            return res.status(400).json({ message: 'Bad Request - Invalid createdBy value' });
        }



        let result = await postService.createPost(title, categories, description, req.file.filename, createdBy);
        res.status(200).json({ msg: "succefully posted", success: true });

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json({ msg: "internal server error", success: false });

    }
}
const updatePost = async (req, res, next) => {
    logInfo("going to update post", path.basename(__filename), updatePost.name);





    try {


        const { postId } = req.params;


        try {
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json({ message: 'Bad Request - Invalid createdBy value' });
            }
            const conn = await getPool();
            const userSame = await postSchema.find({ $and: [{ _id: postId }, { createdBy: Types.ObjectId(req.user.userId) }] });

            if (userSame) {
                let result;
                if (req.file) {

                    result = await postService.updatePost(postId, req.body, req.file.filename);

                }
                else {

                    result = await postService.updatePost(postId, req.body);

                }


                if (!result) {
                    res.status(401).json({ msg: "somehing error occured", success: false });
                }
                else {

                    res.status(200).json({ msg: "record updated", success: true });
                }
            }
            else {
                res.status(401).json({ msg: "you cannot edit the post", success: false });
            }


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }


    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }

}

const deletePost = async (req, res, next) => {
    logInfo("going to delete post", path.basename(__filename), deletePost.name);

    try {


        const { postId } = req.params;




        try {
            if (!mongoose.Types.ObjectId.isValid(postId)) {

                return res.status(400).json({ message: 'Bad Request - Invalid postId value' });
            }
            const conn = await getPool();
            //const userSame = await postSchema.findOne({ $and: [{ _id: `'${postId}'` }, { createdBy: Types.ObjectId(req.user.userId) }] });
            const userSame = await postSchema.findOne({ "_id": postId, createdBy: Types.ObjectId(req.user.userId) });


            if (userSame) {


                let result = await postService.deletePost(postId);


                if (!result) {
                    res.status(401).json("somehing error occured");
                }
                else {

                    res.status(200).json({ msg: "record deleted from system" });
                }
            }
            else {
                res.status(401).json({ msg: "you cannot edit the post" });
            }


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }


    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }

}
const findPost = async (req, res, next) => {
    logInfo("going to read post", path.basename(__filename), findPost.name);

    try {


        const { postId } = req.params;


        try {





            let result = await postService.findPost(postId);

            if (!result) {
                res.status(401).json("post not found");
            }
            else {

                res.status(200).json({ success: true, result });

            }



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }


    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }

}
const findAllPost = async (req, res, next) => {
    logInfo("going to read post", path.basename(__filename), findAllPost.name);

    try {





        try {



            const { page, limit } = req.body

            let result = await postService.findAllPost(page, limit);

            if (!result) {
                res.status(401).json("post not found");
            }
            else {

                res.status(200).json({ success: true, result });

            }



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }


    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }

}
const viewUpdate = async (req, res, next) => {
    logInfo("going to update the view value", path.basename(__filename), viewUpdate.name);
    const { totalViews } = req.body
    const { postId } = req.params
    try {

        let result = await postService.viewUpdate(postId, totalViews);
        res.status(200).json({ result });

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }
}

module.exports = { createPost, updatePost, deletePost, findPost, findAllPost, viewUpdate };