const express = require('express');
const router = express.Router();




const userAuth = require("../../../middleware/userAuth");
// view comment-postid,(create comment,delete userAuth mandator) 
const commentController = require("../controller/commentController");

router.get("/v1/post/comment/:postId", commentController.findComment);
router.post("/v1/post/createComment/:postId", userAuth, commentController.createComment);
router.delete("/v1/post/deleteComment/:commentId", userAuth, commentController.deleteComment);


module.exports = router;


