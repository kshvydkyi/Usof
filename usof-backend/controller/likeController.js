const jwt = require('jsonwebtoken');
const config = require('../config');
const response = require('./../response');
const Post = require("../models/post");
const User = require('./../models/user');
const Comment = require('../models/comment');
const Like = require('../models/like')


exports.createPostLike = async (req, res) =>{
    const token = req.params.token;
    const postId = req.params.id;
    const userData = jwt.verify(token, config.jwt);
    const post = await Post.getPostById(postId)
    if(!post) {
        return response.status(404, {message: `Post with id - ${postId} not found`}, res);
    }
    const isPostLikeExist = await Like.isPostLikeExist(postId, userData.userId);
    if(isPostLikeExist){
        return response.status(400, {message: `Like on post with id - ${postId} already exist`}, res);
    }
    try{
       await Like.createLikePost(userData.userId, postId);
       await User.ratingPlus(userData.userId);
       response.status(200, {message: "Like Added"}, res);
    }
    catch (e) {
        response.status(500, {message: {e}}, res);
    }


}

exports.createCommentLike = async (req, res) => {
    const token = req.params.token;
    const commentId = req.params.id;
    const userData = jwt.verify(token, config.jwt);
    const comment = await Comment.getCommentById(commentId);
    if(!comment) {
        return response.status(404, {message: `Comment with id - ${commentId} not found`}, res);
    }
    const isCommentLikeExist = await Like.isCommentLikeExist(commentId, userData.userId);
    if(isCommentLikeExist){
        return response.status(400, {message: `Like on comment with id - ${commentId} already exist`}, res);
    }
    try{
        await Like.createLikeComment(userData.userId, commentId);
        await User.ratingPlus(userData.userId);
        response.status(200, {message: "Like Added"}, res);
    }
    catch (e) {
        response.status(500, {message: {e}}, res);
    }
}

exports.getAllLikesPost = async (req, res) => {
    const postId = req.params.id;
    const post = await Post.getPostById(postId)
    if(!post) {
        return response.status(404, {message: `Post with id - ${postId} not found`}, res);
    }
    try{
        const likes = await Like.getLikesPost(postId);
        response.status(200, {likes: likes, postId: postId}, res);
    }
    catch (e){
        response.status(500, {message: {e}}, res);
    }

}
exports.getAllLikesComment = async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.getCommentById(commentId)
    if(!comment) {
        return response.status(404, {message: `Post with id - ${commentId} not found`}, res);
    }
    try{
        const likes = await Like.getLikesComment(commentId);
        response.status(200, {message: `Post with id - ${commentId} have ${likes} likes`}, res);
    }
    catch (e){
        response.status(500, {message: {e}}, res);
    }
}

exports.deleteLikePost = async (req, res) =>{
    const id = req.params.id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const like = await Like.isPostLikeExist(id, userData.userId);
    const likeData = await Like.getLikePostById(id, userData.userId);
    if(!likeData){
        return response.status(404, {message: `Like on post with id = ${id} does not exist`}, res);
    }
    if(+likeData[0].author_id !== userData.userId){
        return response.status(403, {message:"Access denied"}, res)
    }
    if(!like){
        return response.status(404, {message: `Like on post with id = ${id} does not exist`}, res);
    }
    await Like.deleteLikePost(id, userData.userId);
    await User.minusRating(userData.userId);
    response.status(200, {message: `Like on post with id = ${id} deleted`}, res);
}

exports.deleteLikeComment = async (req, res) =>{
    const id = req.params.id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const comment = await Like.isCommentLikeExist(id, userData.userId);
    const commentData = await Like.getLikeCommentById(id, userData.userId);
    if(!commentData){
        return response.status(404, {message: `Like on post with id = ${id} does not exist`}, res);
    }
    if(+commentData[0].author_id !== userData.userId){
        return response.status(403, {message:"Access denied"}, res)
    }
    if(!comment){
        return response.status(404, {message: `Like on post with id = ${id} does not exist`}, res);
    }
    await Like.deleteLikeComment(id, userData.userId);
    await User.minusRating(userData.userId);
    response.status(200, {message: `Like on post with id = ${id} deleted`}, res);
}




