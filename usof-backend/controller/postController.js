const jwt = require('jsonwebtoken');
const config = require('../config');
const response = require('./../response');
const User = require('./../models/user');
const multer = require('multer');
const Post = require("../models/post");
const Category = require("../models/category");
const _ = require('lodash');
const {request} = require("express");

exports.getActivePosts = async (req, res) =>{
    try{
        const { page } = req.query;
        const parsedPage = page ? Number(page) : 1;
        const perPage = 10;
        const allPages = await Post.getActivePosts();
        const reversedPosts = allPages.reverse();
        const data = reversedPosts.map(async( item

        )=> {
             const date = new Date(item.publish_date);
            //  const publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

             const [{login}] = await User.getLogin(item.author_id);
             const [{photo}] = await User.getUserPhoto(item.author_id);
             return {
                 title: item.title,
                 content: item.content,
                 image: item.image,
                 status: item.status,
                 publish_date: date,
                 id: item.id,
                 authorId: item.author_id,
                 author: login,
                 authorPhoto: photo,
                
             }
            }
        )
        const promiseData = await Promise.all(data);
        const totalPages = Math.ceil(  promiseData.length / perPage);
        const usersFilter =  promiseData.slice(
            parsedPage * perPage - perPage,
            parsedPage * perPage
        );
        response.status(200, {meta: { page: Number(page), perPage: Number(perPage), totalPages },
            data: usersFilter}, res);
    }
    catch (e){
        // console.log(e);
        response.status(400, {message: `${e}`}, res);
    }
}
exports.getPersonalPosts = async (req, res) => {
    const userId = req.params.id;
    // const userData = jwt.verify(token, config.jwt);
    const user = User.getUserById(userId);
    if(!user){
        return response.status(200, {message: `User with id = ${userId} not found`}, res);
    }
    try{
        const { page } = req.query;
        const parsedPage = page ? Number(page) : 1;
        const perPage = 10;
        const allPages = await Post.getPersonalPosts(userId);
        const reversedPosts = allPages.reverse();
        // allPages.map(  ( item

        //     )=> {
        //         const date = new Date(item.publish_date);
        //         item.publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        //     }
        // )
        const totalPages = Math.ceil(reversedPosts.length / perPage);
        const usersFilter = reversedPosts.slice(
            parsedPage * perPage - perPage,
            parsedPage * perPage
        );
        response.status(200, {meta: { page: Number(page), perPage: Number(perPage), totalPages },
            data: usersFilter}, res);
    }
    catch (e){
        response.status(400, {message: `${e}`}, res);
    }
}
exports.getAllPosts = async (req, res) => {
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    if(userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res);
    }
    try{
        const { page } = req.query;
        const parsedPage = page ? Number(page) : 1;
        const perPage = 10;
        const allPages = await Post.getAllPosts();
        const reversedPosts = allPages.reverse();
        const data = reversedPosts.map(async( item

            )=> {
                const date = new Date(item.publish_date);
                const publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                const [{login}] = await User.getLogin(item.author_id);
                return {
                    id: item.id,
                    author: login,
                    title: item.title,
                    content: item.content,
                    image: item.image,
                    status: item.status,
                    publish_date: date
                }
            }
        )
        const promiseData = await Promise.all(data);
        const totalPages = Math.ceil(  promiseData.length / perPage);
        const usersFilter =  promiseData.slice(
            parsedPage * perPage - perPage,
            parsedPage * perPage
        );
        response.status(200, {meta: { page: Number(page), perPage: Number(perPage), totalPages },
            data: usersFilter}, res);
    }
    catch (e){
        response.status(400, {message: `${e}`}, res);
    }
}

exports.getActivePostById = async (req, res) =>{
    let id = req.params.id;
    const post = await Post.getPostById(id);
    if(!post){
        return response.status(404, {message: `Post with id = ${id} not found`}, res);
    }
    // const date = new Date(post[0].publish_date);
    // post[0].publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const [{login}] = await User.getLogin(post[0].author_id);
    const [{photo}] = await User.getUserPhoto(post[0].author_id)
    // delete post[0].author_id;
    post[0].author = login;
    post[0].authorImage = photo;
 
    if(post[0].status === 'inactive'){
        return response.status(404, {message: `Post with id = ${id} is inactive`}, res);
    }
    response.status(200, {post}, res);
}

exports.getPostByIdAdmin = async (req, res) => {
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    if(userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res);
    }
    let id = req.params.id;
    const post = await Post.getPostById(id);
    // const date = new Date(post[0].publish_date);
    // post[0].publish_date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const [{login}] = await User.getLogin(post[0].author_id);
    delete post[0].author_id;
    post[0].author = login;
    if(!post){
        return response.status(404, {message: `Post with id = ${id} not found`}, res);
    }
    response.status(200, {post}, res);
}

exports.getPostCategories = async (req, res) => {
    const id = req.params.id;
    const post = await Post.getPostById(id);
    if(!post){
        return response.status(404, {message: `Post with id = ${id} not found`}, res);
    }
    try{
        const categoriesId = await Post.getPostCategories(id);
        const categories = categoriesId.map((item) => Category.getCategoryById(item.category_id));
        const returnCategories = await Promise.all(categories);
        response.status(200, {categories: returnCategories, postId: post[0].id}, res);
    }
    catch (e)
    {
        response.status(500, {message: `${e}`}, res);
    }
}
exports.createNewPost = async (req, res) =>{
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const authorId = userData.userId;
    const {title, content, image, ...categories} = req.body;
    if(!title || !content || !categories){
       return response.status(400, {message: `Fill in all fields`}, res);
    }
    if(await Post.isPostWithSuchTitleExist(title)){
        return response.status(409, {message:`Post with title - ${title} already exist`}, res);
    }
    try{
        await Post.createPost(req.body, authorId);
        response.status(200, {message:"Post created without image"}, res);
    }
    catch (e){
        //console.log(e)
        response.status(500, {message: `${e}`}, res);
    }
}
exports.updatePostUser = async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    // console.log(req.body);
    const userData = jwt.verify(token, config.jwt);
    const post = await Post.getPostById(id);
    const isPostTitle = await Post.isPostWithSuchTitleExist(req.body.title)
    if(+post[0].author_id !== userData.userId){
        return response.status(403, {message:"Access denied"}, res)
    }
    if(!post){
        return response.status(409, {message:`Post with id - ${id} not found`}, res);
    }
    else if(isPostTitle && req.body.title !== post[0].title){
        return response.status(409, {message:`Post with title - ${req.body.title} already exist`}, res);
    }
    try{
        await Post.updatePostData(req.body, id);
        response.status(200, {message:`Values changed`}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }
}
exports.addPictureToPost = async (req, res) =>{
    const pathFile = req.file.filename;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    try{
        response.status(200, {message:`Image to post added`, path: pathFile}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }
}
exports.adminSetStatus = async (req,res) =>{
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    if(userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res);
    }
    const post_id = req.params.id;
    const post = await Post.getPostById(post_id);
    if(!post){
        return response.status(409, {message:`Post with id - ${post_id} not found`}, res);
    }
    const {status} = req.body;
    if(status === 'active' || status === 'inactive'){
        try{
            await Post.adminSetStatus(status, post_id);
            response.status(200, {message: "Status Changed"}, res);
        }
        catch (e){
            response.status(500, {message: `${e}`}, res);
        }

    }else {
        return response.status(400, {message: 'Invalid status for post'}, res);
    }
}
exports.updateImage = async (req, res) => {
    const pathFile = req.file.filename;
    const postId = req.params.id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const post = await Post.getPostById(postId);
    if(+post[0].author_id !== userData.userId){
        return response.status(403, {message:"Access denied"}, res)
    }
    try{
        await Post.updateImage(pathFile, postId);
        response.status(200, {message:`Post image changed`, path: pathFile}, res);
    }
    catch (e){
        response.status(500, {message: `${e}`}, res);
    }
}
exports.updateCategoriesForPost = async (req, res) => {
    const {token, id} = req.params;
    const {...categoriesId} = req.body;
    const userData = jwt.verify(token, config.jwt);
    const post = await Post.getPostById(id);
    // console.log(categoriesId);
    if (!post) {
        return response.status(404, {message: `Post with id = ${id} not found`}, res);
    }

    if (post[0].author_id !== userData.userId && userData.role !== 'Admin') {
        return response.status(403, {message: "Access denied"}, res);
    }
    const oldCategory = await Post.getPostCategories(id);

    const idOldCategory = oldCategory.map(({category_id}) => category_id);

    const lengthUpdate = Object.keys(categoriesId).length;

    const idNewCategory = Object.values(categoriesId).map(item => +item);

    if (_.isEqual(idNewCategory, idOldCategory)) {
        return;
    }
    const lengthOldCategory = oldCategory.length;
    if (lengthUpdate > lengthOldCategory) {
        const addCategory = idNewCategory.filter(
            (item) => !idOldCategory.includes(item)
        );
        addCategory.forEach(async (item) => await Category.updateCategoriesForPostAdd(id, item));

        return response.status(200, {message: 'Categories changed'}, res);
    }
    else if (lengthUpdate < lengthOldCategory) {
        const delCategory = idOldCategory.filter(
            (item) => !idNewCategory.includes(item)
        );
        if(delCategory.length === idOldCategory.length){
            idNewCategory.forEach(async (item) => await Category.updateCategoriesForPostAdd(id, item));
        }
        delCategory.forEach(
            async (item) => await Category.updateCategoriesForPostDel(id, item)
        );
        return response.status(200, {message: 'Categories changed'}, res);
    }
    else {
        const category = idNewCategory.filter(
            (item) => !idOldCategory.includes(item)
        );
        const updateCategory = idOldCategory.filter(
            (item) => !idNewCategory.includes(item)
        );
        await Category.updateCategoriesForPost(id, updateCategory[0], category[0]);
        return response.status(200, {message: 'Categories changed'}, res);
    }

}

exports.deletePost = async (req, res) =>{
    const id = req.params.id;
    const token = req.params.token;
    const userData = jwt.verify(token, config.jwt);
    const post = await Post.getPostById(id);
    if(!post){
        return response.status(404, {message: `Post with id = ${id} not found`}, res);
    }
    if(post[0].author_id !== userData.userId && userData.role !== 'Admin'){
        return response.status(403, {message:"Access denied"}, res);
    }

    await Post.detelePost(id);
    response.status(200, {message: `Post with id = ${id} deleted`}, res);
}



