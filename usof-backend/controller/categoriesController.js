const jwt = require('jsonwebtoken');
const config = require('../config');
const response = require('./../response');
const User = require('./../models/user');
const Category = require('./../models/category');
const Post = require("../models/post");

exports.getAllCategories = async (req, res) =>{
    try{
        const categories = await Category.getAllCategories();
        response.status(200, categories, res);
    }
    catch (e){
        response.status(400, {message: `${e}`}, res);
    }
}

exports.getCategoryById = async (req, res) => {
    let id = req.params.id;
    const category = await Category.getCategoryById(id);
    if(!category){
        return response.status(404, {message: `Category with id = ${id} not found`}, res);
    }
    response.status(200, category, res);

}
 exports.getAllPostsInCategory = async (req, res) => {
     const {id} = req.params;
     const category = await Category.getCategoryById(id);
     if(!category){
         return response.status(404, {message: `Category with id = ${id} not found`}, res);
     }
     const token = req.params.token;
     const userData = jwt.verify(token, config.jwt);
     const isAdmin = await User.isAdmin(userData.userId);
     if(isAdmin){
         try{
            const postsIDs = await Category.getPostsByCategoriesAdmin(id);
            const posts = postsIDs.map((item) => Post.getPostById(item.post_id));
            response.status(200, await Promise.all(posts), res);
         }
         catch(e){
             response.status(500, {message: `${e}`}, res);
         }
     }
     else{
         try{
             const postsIDs = await Category.getPostsByCategoriesAdmin(id);
             const posts = postsIDs.map((item) => Post.getPostById(item.post_id));
             const userPosts = await Promise.all(posts);
             const filterPosts = userPosts.filter(([item]) => item.status === 'active');
             response.status(200, {filterPosts}, res);
         }
         catch (e){
             response.status(500, {message: `${e}`}, res);
         }
     }


 }

 exports.createCategory = async (req, res) => {
     const token = req.params.token;
     const userData = jwt.verify(token, config.jwt);
     const isAdmin = await User.isAdmin(userData.userId);
     if(!isAdmin){
         return response.status(403, {message:"Access denied"}, res)
     }
     const {title, description} = req.body;
     if(!title || !description){
         return response.status(400, {message:`Fill in all fields`}, res)
     }
     if(await Category.isCategoryExist(title)){
         return response.status(409, {message:`Category with title - ${title} already exist`}, res);
     }
     try{
        await Category.addNewCategory(req.body);
        response.status(200, {message: `New Category with title - ${title} added`}, res)
     }
     catch (e){
         response.status(500, {message: `${e}`}, res);
     }
 }

 exports.updateCategory = async (req, res) => {
     const token = req.params.token;
     const userData = jwt.verify(token, config.jwt);
     const isAdmin = await User.isAdmin(userData.userId);
     if(!isAdmin){
         return response.status(403, {message:"Access denied"}, res);
     }
     const categoryId = req.params.id;
     const isCategory = await Category.getCategoryById(categoryId);
     if(!isCategory){
         return response.status(404, {message: `Category with id - ${categoryId} not found`}, res)
     }
     try{
         await Category.updateCategoryData(req.body, categoryId);
         response.status(200, {message:`Values changed`}, res);
     }
     catch (e){
         response.status(500, {message: `${e}`}, res);
     }

 }

 exports.deleteCategory = async (req, res) => {
     const categoryId = req.params.id;
     const token = req.params.token;
     const userData = jwt.verify(token, config.jwt);
     const isAdmin = await User.isAdmin(userData.userId);
     if(!isAdmin){
         return response.status(403, {message:"Access denied"}, res);
     }
     const category = await Category.getCategoryById(categoryId);

     if(!category){
         return response.status(404, {message: `Category with id = ${categoryId} not found`}, res);
     }
     await Category.deleteCategory(categoryId);
     response.status(200, {message: `Category with id = ${categoryId} deleted`}, res);
 }

