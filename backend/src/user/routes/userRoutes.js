const express = require('express');
const router = express.Router();

const paginate = require('../../middleware/paginationMiddleware')
const sort = require('../../middleware/sortingMiddleware');
const search = require('../../middleware/searchingMiddleware');
const upload = require('../../middleware/imageUpload');


const userAuth = require("../../../middleware/userAuth");


const userController = require("../controller/userController");

router.post("/v1/signup", upload.single('images'), userController.addUser);
router.post("/v1/verify", userController.verifyOtp);
router.post("/v1/resendOTP", userController.resendOTP);

router.post("/v1/login/", userController.userLogin);

router.get("/v1/userProfile/", userAuth, userController.findUserProfile)

router.patch("/v1/user/update/", userAuth, upload.single('images'), userController.userUpdate);
router.patch("/v1/user/updatePassword/", userAuth, userController.userUpdatePassword);
router.get("/v1/user/post", userAuth, userController.findAllPost);

router.patch("/v1/user/resetUserPassword", userController.userResetPassword);
router.delete("/v1/user/accountDelete", userAuth, userController.deleteAcoount)

router.patch("/v1/user/resetPassword/", userController.resetPassword);





module.exports = router;
