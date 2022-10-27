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
            const { page } = req.query;
            const parsedPage = page ? Number(page) : 1;
            const perPage = 10;

            const postsIDs = await Category.getPostsByCategoriesAdmin(id);
            const posts = postsIDs.map((item) => Post.getPostById(item.post_id));
            const userPosts = await Promise.all(posts);
            const responsePosts = userPosts.map( async (item) => {   
                const date = new Date(item[0].publish_date);
                const [{login}] = await User.getLogin(item[0].author_id);
                const [{photo}] = await User.getUserPhoto(item[0].author_id);
                return {
                    title: item[0].title,
                    content: item[0].content,
                    image: item[0].image,
                    status: item[0].status,
                    publish_date: date,
                    id: item[0].id,
                    authorId: item[0].author_id,
                    author: login,
                    authorPhoto: photo,
                   
                }
                
            })
            const promisedPosts = await Promise.all(responsePosts);
            const totalPages = Math.ceil(  promisedPosts.length / perPage);
             const usersFilter =  promisedPosts.slice(
                 parsedPage * perPage - perPage,
                 parsedPage * perPage
             );
            response.status(200, {meta: { page: Number(page), perPage: Number(perPage), totalPages },
            data: usersFilter}, res);
         }
         catch(e){
             response.status(500, {message: `${e}`}, res);
         }
     }
     else{
         try{
            const { page } = req.query;
            const parsedPage = page ? Number(page) : 1;
            const perPage = 10;
             const postsIDs = await Category.getPostsByCategoriesAdmin(id);
             const posts = postsIDs.map((item) => Post.getPostById(item.post_id));
             const userPosts = await Promise.all(posts);
             const filterPosts = userPosts.filter(([item]) => item.status === 'active');
            //  console.log(filterPosts);
            const responsePosts = filterPosts.map( async (item) => {   
                const date = new Date(item[0].publish_date);
                const [{login}] = await User.getLogin(item[0].author_id);
                const [{photo}] = await User.getUserPhoto(item[0].author_id);
                return {
                    title: item[0].title,
                    content: item[0].content,
                    image: item[0].image,
                    status: item[0].status,
                    publish_date: date,
                    id: item[0].id,
                    authorId: item[0].author_id,
                    author: login,
                    authorPhoto: photo,
                   
                }
                
            })
            const promisedPosts = await Promise.all(responsePosts);
            // console.log(promisedPosts);
             const totalPages = Math.ceil(  promisedPosts.length / perPage);
             const usersFilter =  promisedPosts.slice(
                 parsedPage * perPage - perPage,
                 parsedPage * perPage
             );
             response.status(200, {meta: { page: Number(page), perPage: Number(perPage), totalPages },
             data: usersFilter}, res);
         }
         catch (e){
            // console.log(e);
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

