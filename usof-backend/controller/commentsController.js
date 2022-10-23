const jwt = require('jsonwebtoken');
const config = require('../config');
const response = require('./../response');
const Post = require("../models/post");
const User = require('./../models/user');
const Comment = require('../models/comment');

exports.createComment = async (req, res) => {
    const post_id = req.params.id;
    const post = await Post.getPostById(post_id);
    if(!post){
        return response.status(404, {message:`Post with id - ${post_id} not found`}, res);
    }
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const {content} = req.body;
    if(!content){
        return response.status(400, {message: `Fill in all fields`}, res);
    }
    try{
        await Comment.createComment(content, userData.userId, post_id);
        response.status(200, {message:'Comment added'}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }


}

exports.getCommentByIdUser = async (req, res) => {
    let id = req.params.id;
    const comment = await Comment.getCommentById(id);
    if(!comment){
        return response.status(404, {message: `Comment with id = ${id} not found`}, res);
    }
    const date = new Date(comment[0].publish_date);
    comment[0].publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const [{login}] = await User.getLogin(comment[0].author_id);
    delete comment[0].author_id;
    comment[0].author = login;

    if(comment[0].status === 'inactive'){
        return response.status(404, {message: `Comment with id = ${id} is inactive`}, res);
    }
    response.status(200, {comment}, res);
}

exports.getCommentByIdAdmin = async (req, res) => {
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    if(userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res);
    }
    let id = req.params.id;
    const comment = await Comment.getCommentById(id);
    const date = new Date(comment[0].publish_date);
    const [{login}] = await User.getLogin(comment[0].author_id);
    delete comment[0].author_id;
    comment[0].author = login;
    comment[0].publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    if(!comment){
        return response.status(404, {message: `Comment with id = ${id} not found`}, res);
    }
    response.status(200, {comment}, res);
}

exports.getAllCommentsInPostUser = async (req, res) => {
    const id = req.params.id;
    const post = await Post.getPostById(id);
    if(!post){
        return response.status(404, {message: `Post with id = ${id} not found`}, res);
    }
    try{
        const commentsId = await Comment.getCommentsInPost(id);
        const reversedComents = commentsId.reverse();
        const comments = reversedComents.map((item) => Comment.getCommentById(item.id));
        const promiseComments = await Promise.all(comments);
        const data = promiseComments.map(async( item

            )=> {
                const date = new Date(item[0].publish_date);
                const publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                const [{login}] = await User.getLogin(item[0].author_id);
                const [{photo}] = await User.getUserPhoto(item[0].author_id);
                return {
                    id: item[0].id,
                    author: login,
                    content: item[0].content,
                    post_id: item[0].post_id,
                    status: item[0].status,
                    publish_date: date,
                    authorId: item[0].author_id,
                    authorImage: photo
                }
            }
        )
        const promiseData = await Promise.all(data);
        const returnData = await Promise.all(promiseData);

        response.status(200, {coments: returnData, postId: id}, res);
    }
    catch (e)
    {
        response.status(500, {message: `${e}`}, res);
    }
}

exports.getAllCommentsInPostAdmin = async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const isAdmin = await User.isAdmin(userData.userId);
    if(!isAdmin){
        return response.status(403, {message:"Access denied"}, res);
    }
    const post = await Post.getPostById(id);
    if(!post){
        return response.status(404, {message: `Post with id = ${id} not found`}, res);
    }
    try{
        const commentsId = await Comment.getCommentsInPostAdmin(id);
        const comments = commentsId.map((item) => Comment.getCommentById(item.id));
        const promiseComments = await Promise.all(comments);
        const data = promiseComments.map(async( item

            )=> {
                const date = new Date(item[0].publish_date);
                const publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                const [{login}] = await User.getLogin(item[0].author_id);
                return {
                    author: login,
                    content: item[0].content,
                    post_id: item[0].post_id,
                    status: item[0].status,
                    publish_date
                }
            }
        )
        const promiseData = await Promise.all(data);

        response.status(200, await Promise.all(promiseData), res);
    }
    catch (e)
    {
        response.status(500, {message: `${e}`}, res);
    }
}

exports.updateComment = async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const comment = await Comment.getCommentById(id);
    if(+comment[0].author_id !== userData.userId){
        return response.status(403, {message:"Access denied"}, res)
    }
    if(!comment){
        return response.status(409, {message:`Comment with id - ${id} not found`}, res);
    }
    const {content} = req.body;
    if(!content){
        return response.status(400, {message: 'Fill all fields'}, res);
    }
    try{
        await Comment.updateComment(id, content);
        response.status(200, {message: "Comment changed"}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }
}

exports.setStatusComment = async (req, res) =>{
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    if(userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res);
    }
    const comment_id = req.params.id;
    const comment = await Comment.getCommentById(comment_id);
    if(!comment){
        return response.status(409, {message:`Comment with id - ${comment_id} not found`}, res);
    }
    const {status} = req.body;
    if(status === 'active' || status === 'inactive'){
        try{
            await Comment.setStatusComment(comment_id, status,);
            response.status(200, {message: "Status Changed"}, res);
        }
        catch (e){
            response.status(500, {message: `${e}`}, res);
        }

    }
    else {
        return response.status(400, {message: 'Invalid status for comment'}, res);
    }
}
exports.deleteComment = async (req,res) => {
    const id = req.params.id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const comment = await Comment.getCommentById(id);
    if(!comment){
        return response.status(404, {message: `Comment with id = ${id} not found`}, res);
    }
    if(comment[0].author_id !== userData.userId && userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res);
    }
    await Comment.deteleComment(id);
    response.status(200, {message: `Comment with id = ${id} deleted`}, res);
}


