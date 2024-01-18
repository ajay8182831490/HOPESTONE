
const { logError } = require('../../../util/logger');
const { getPaginatedData } = require("../../../util/db");
const path = require('path');
const userSchema = require('../../../model/user');
const getPool = require("../../../util/db");
const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');

const { encryptPassword, getPasswordInfo, verifyPassword } = require("../../../util/password");
const { getToken } = require('../../../util/util');
const postSchema = require('../../../model/post');


const { sendEmail } = require('../../../util/util');


class Post {

    constructor(title, categories, description, images, createdBy) {
        this.title = title,
            this.categories = categories,
            this.description = description,
            this.createdBy = createdBy
        this.images = images ? images : ""


    }

    async save() {

        try {


            const conn = await getPool();


            let result = await postSchema.create({
                title: this.title, categories: this.categories, description:
                    this.description, createdBy: Types.ObjectId(this.createdBy), images: this.images
            });


            let user = await userSchema.findById(Types.ObjectId(this.createdBy));

            user.postIds.push((Types.ObjectId(result._id)));
            await user.save();







            return result;
        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);
        }
    }
    static async findById(id) {
        try {
            const conn = await getPool();
            return await postSchema.findById(id);
        }
        catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }
    }
    static async updatePost(id, data, image) {
        try {
            const { title, description, categories } = data;

            const conn = await getPool();

            if (!image) {

                return await postSchema.findByIdAndUpdate(id, { $set: { description: description, title: title, categories: categories } }, { new: true });
            }
            else {
                return await postSchema.findByIdAndUpdate(id, { $set: { description: description, title: title, categories: categories, images: image } }, { new: true });

            }
        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);
        }
    }
    static async deletePost(id) {
        try {
            const conn = await getPool();
            return await postSchema.findByIdAndDelete(id);

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }
    }
    static async findPost(id) {
        try {
            const conn = await getPool();
            return await postSchema.findById(id).populate({
                path: 'createdBy',
                select: { "name": 1 }
            });

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message)

        }

    }
    static async findAllPost(pageNumber = 1, pageSize = 3) {
        try {
            const conn = await getPool();

            const posts = await postSchema
                .find()
                .populate({
                    path: 'createdBy',
                    select: { "name": 1 }
                })
                .sort({ createdAt: -1 }) // Sorting in descending order based on createdDate
                .skip((pageNumber - 1) * pageSize) // Skip documents based on the page number
                .limit(pageSize); // Limit the number of documents per page

            return posts;

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);
        }
    }
    static async viewUpdate(postId, totalViews) {
        try {
            let conn = await getPool();

            let result = await postSchema.findByIdAndUpdate(postId, { $set: { totalViews: totalViews } }, { new: true }).select("totalViews");
            return result;

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);
        }
    }



}




module.exports = Post;