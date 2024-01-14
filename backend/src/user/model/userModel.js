
const { logError } = require('../../../util/logger');

require('dotenv').config();
const { getPaginatedData } = require("../../../util/db");
const path = require('path');
const userSchema = require('../../../model/user');
const postSchema = require("../../../model/post");
const commentSchema = require("../../../model/comment");
const getPool = require("../../../util/db");
const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');

const { encryptPassword, getPasswordInfo, verifyPassword } = require("../../../util/password");
const { getToken } = require('../../../util/util');


const { sendEmail, generateOTP, sendEmailforOtp } = require('../../../util/util');





class User {


    static async addUser(name, email, password, image) {
        let conn = await getPool();
        // console.log(conn);



        try {

            let hashPassword = await encryptPassword(password, 15);

            let otp = generateOTP();
            let otpemail = await sendEmailforOtp(email, otp);


            const database = (await userSchema.create({ name: name, email: email, password: hashPassword, image: image, otp: otp }));;

            return database;
        }
        catch (error) {

            logError(error, path.basename(__filename));

        }

    }
    static async verifyOtp(otp, email) {
        try {
            let conn = await getPool();
            let user = await userSchema.findOne({ email }, { "otp": 1, _id: 0 });

            if (user.otp == otp) {
                await userSchema.findOneAndUpdate({ email }, {
                    $set: {
                        isVerified: true,
                        otp: ""
                    }
                })


                return true;
            }
            else {
                return false;
            }

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }
    }
    static async existFind(data) {
        try {
            let conn = await getPool();


            let result = await userSchema.findOne(data)

            return result;


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }

    }
    static async userLogin(email) {
        try {
            let conn = await getPool();
            let result = await userSchema.findOne({ email: email });




            const data = {
                user: {
                    id: result._id
                }
            }





            let token = await jwt.sign(data, process.env.JWT_SECRET_KEY);

            return { token, result };;



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }

    }
    static async userUpdate(id, data, image) {
        try {



            let result;
            if (image && data.name == '') {


                result = await userSchema.findByIdAndUpdate(id, { $set: { image: image } }, { new: true });

            }
            else if (!image && data) {


                result = await userSchema.findByIdAndUpdate(id, { $set: data }, { new: true });

            }
            else {

                result = await userSchema.findByIdAndUpdate(id, { $set: { data, image: image } }, { new: true });

            }





            return result;

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }




    static async findById(id) {
        try {
            let conn = await getPool();
            return await userSchema.findById(id);

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }


    static async userResetPassword(email) {

        try {
            let conn = await getPool();

            let token = getToken();


            let result = await userSchema.findOneAndUpdate({ email: email }, { $set: { tokens: token } }, { new: true }).select("-password");


            let resetEmail = await sendEmail(email, token)


            return true;



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;
        }

    }
    static async resetPassword(tokens, password) {
        try {


            let conn = await getPool();



            let hashPassword = await encryptPassword(password, 15);

            let result = await userSchema.findOneAndUpdate({ tokens: tokens }, { $set: { password: hashPassword, tokens: "" } }, { new: true }).select("-password");

            return result;






        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }
    static async findAllPost(id) {
        try {
            let conn = await getPool();

            return await userSchema.findById(Types.ObjectId(id), { "password": 0, "email": 0, "tokens": 0, "role": 0, "commentIds": 0, "likedPostIds": 0 })
                .populate({
                    path: 'postIds',
                    select: { "likes": 0, "commentIds": 0, "totalViews": 0 }
                })


                .sort({ createdAt: -1 })
                .exec();


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }
    }
    static async resendOTP(email) {
        try {
            let conn = await getPool();


            let result = await userSchema.findOne({ email: email })

            if (result) {
                let otp = generateOTP();
                let otpemail = await sendEmailforOtp(email, otp);
                let otpresult = await userSchema.findByIdAndUpdate(result._id, { $set: { otp: otp } }, { new: true });
                return true;
            }
            else {
                return false;
            }




        }
        catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);


        }

    }
    static async deleteAcoount(id) {
        try {
            let conn = await getPool();
            let result = await userSchema.findById(id);

            let post = await postSchema.deleteMany({ createdBy: result._id });


            const posts = await commentSchema.deleteMany({ "user.UserId": result._id });


            let result1 = await userSchema.findByIdAndDelete(result._id);
            return result1;


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }

    }
}

module.exports = User;