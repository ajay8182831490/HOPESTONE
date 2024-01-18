const express = require('express');
const router = express.Router();

const paginate = require('../../middleware/paginationMiddleware')
const sort = require('../../middleware/sortingMiddleware');
const search = require('../../middleware/searchingMiddleware')
const upload = require('../../middleware/imageUpload');



const userAuth = require("../../../middleware/userAuth");


// create, update ,delete, uthentication first

const postController = require("../controller/postController");


router.get("/v1/post/:postId", postController.findPost);
router.get("/v1/post/", postController.findAllPost);


router.post("/v1/user/post/newPost", userAuth, upload.single('images'), postController.createPost);
router.patch("/v1/user/post/updatePost/:postId", userAuth, upload.single('images'), postController.updatePost);

router.delete("/v1/user/post/deletePost/:postId/", userAuth, postController.deletePost);

router.patch("/v1/post/view/:postId", postController.viewUpdate);


// we have need userid as well as all information of post






module.exports = router;