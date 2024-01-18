const path = require('path');
const bcrypt = require('bcrypt')

const usermodel = require("../model/userModel");
//const userModel = require('../../../model/userModel');
const { verifyPassword, encryptPassword } = require('../../../util/password');
const getPool = require('../../../util/db');
const { generateOTP, sendEmailforOtp } = require('../../../util/util');
const { refeshToken } = require('../controller/userController');
const addUser = async (name, email, password, image) => {

    try {
        if (!name || !email || !password) {
            throw new Error("mising field required");
        }


        let result = await usermodel.existFind({ email: email });



        if (result != null) {
            return false;
        }
        else {


            return await usermodel.addUser(name, email, password, image);



        }


    } catch (ex) {
        throw new Error(ex.message);

    }
}
const verifyOtp = async (otp, email) => {
    try {
        return await usermodel.verifyOtp(otp, email);
    } catch (ex) {
        throw new Error(ex.message);
    }
}
const userLogin = async (email, password) => {
    try {
        if (!email || !password) {
            throw new Error("mising field required");
        }
        let result = await usermodel.existFind({ email: email });




        if (result) {
            let hash = result.password;

            const passwordCmp = await verifyPassword(password, hash);



            if (!passwordCmp) {
                return passwordCmp;
            }
            else {

                return await usermodel.userLogin(email);
            }



        }
        else {
            return "no";;
        }




    } catch (ex) {
        throw new Error(ex.message);
    }
}
const userUpdate = async (id, data, image) => {
    try {

        return await usermodel.userUpdate(id, data, image);

    } catch (ex) {
        throw new Error(ex.message);

    }

}
const resendOTP = async (email) => {
    try {

        return await usermodel.resendOTP(email);

    } catch (ex) {
        throw new Error(ex.message);

    }

}
const userUpdatePassword = async (id, data) => {



    try {


        let result = await usermodel.findById(id);




        if (!result) {
            return false;
        }


        let newPass = data.newPassword;



        const passwordCmp = await verifyPassword(data.password, result.password);




        if (!passwordCmp) {
            return passwordCmp;
        }
        else {


            let hashPassword = await encryptPassword(data.newPassword, 15);


            return await usermodel.userUpdate(id, { "password": hashPassword });
        }


    } catch (ex) {
        throw new Error(ex.message);

    }

}

const userResetPassword = async (email) => {


    try {


        let user = await usermodel.existFind({ email: email });

        if (!user) {
            return false;
        }
        else {

            return await usermodel.userResetPassword(email);
        }



    } catch (error) {
        throw new Error(ex.message);
    }
}

const resetPassword = async (token, password) => {

    try {

        let user = await usermodel.existFind({ tokens: token });
        if (!user) {
            return false;
        }
        else {
            return await usermodel.resetPassword(token, password);
        }
    } catch (ex) {

        throw new Error(ex.message);

    }

}
const findUserProfile = async (id) => {

    try {
        let result = await usermodel.findById(id);

        if (!result) {
            return false;
        }
        else {
            return result;
        }

    } catch (ex) {
        throw new Error(ex.message);
    }

}
const findAllPost = async (id) => {
    try {
        return await usermodel.findAllPost(id);
    } catch (ex) {
        throw new Error(ex.message);

    }
}
const deleteAcoount = async (id, password) => {
    try {
        let result = await usermodel.findById(id);


        if (!result) {
            return false;
        }






        const passwordCmp = await verifyPassword(password, result.password);




        if (!passwordCmp) {
            return passwordCmp;
        }
        else {




            return await usermodel.deleteAcoount(id);
        }


    } catch (error) {

        throw new Error(error.message);
    }

}
const refreshToken = async (refeshToken) => {
    try {


        return await usermodel.refreshToken(refeshToken);

    } catch (ex) {
        throw new Error(ex.message);

    }
}





module.exports = { addUser, userLogin, userUpdate, userUpdatePassword, userResetPassword, resetPassword, findUserProfile, findAllPost, verifyOtp, resendOTP, deleteAcoount, refreshToken }; 
