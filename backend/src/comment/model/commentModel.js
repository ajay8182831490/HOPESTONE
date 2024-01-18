
const { logError } = require('../../../util/logger');
const mongoose = require('mongoose')

const path = require('path');
const userSchema = require('../../../model/user');
const postSchema = require('../../../model/post');
const getPool = require("../../../util/db");

const { Types } = require('mongoose');



const commentSchema = require('../../../model/comment');
const { Console } = require('console');


class Comment {

    constructor(content, post, user) {
        this.content = content,
            this.post = Types.ObjectId(post)

    }


    async save(userId, postId) {
        let conn = await getPool();
        let user = await userSchema.findById(Types.ObjectId(userId));
        let post = await postSchema.findById(Types.ObjectId(postId));


        let UserId = Types.ObjectId(userId);
        let userInfo = {
            UserId

        }

        let result
        if (user) {
            result = await commentSchema.create({ content: this.content, post: this.post, user: userInfo });
        }
        else {

            return false;
        }

        user.commentIds.push((Types.ObjectId(result._id)));
        post.commentIds.push((Types.ObjectId(result._id)));

        await user.save();
        await post.save();

        return result;

    }
    static async findComment(postId) {
        try {

            let conn = await getPool();
            let x = await commentSchema.find({ post: postId })
                .populate({
                    path: 'user.UserId',
                    select: { 'name': 1, _id: 0, "image": 1, "_id": 1 }
                })  // Populate user information
                // Populate post information
                .sort({ createdAt: -1 })
                .exec()

            return x;
        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }
    }

    static async deleteComment(commentId, userId) {
        // firstly user verify the comment id verify
        let conn = await getPool();



        try {
            let comment = await commentSchema.findById(commentId);



            if (comment) {
                if (comment.user.UserId.toString() !== userId.toString()) {
                    return false;
                }
                else {

                    const user = await userSchema.findById(userId);

                    if (!user) {
                        return false;
                    }
                    else {
                        user.commentIds.pull(commentId);
                        // post.commentIds.pull(commentId);
                        const updatedPost = await postSchema.findOneAndUpdate(
                            { 'commentIds': commentId },
                            { $pull: { 'commentIds': commentId } },
                            { new: true }
                        );


                        await user.save();


                        return await commentSchema.findByIdAndDelete(commentId);
                    }



                }
            }
            else {
                return false;
            }




        } catch (ex) {

            logError(ex, path.basename(__filename));
            throw new Error(ex.message);
        }






    }

}
module.exports = Comment;