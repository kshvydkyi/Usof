const Model = require('./model');
const db = require("../settings/db");
const Post = require('./../models/post');

class Category extends Model{
    constructor() {
        super();
    }
    async getPostsByCategoriesAdmin(id){
        const sql = await this.DB.query("SELECT post_id FROM categories_posts WHERE category_id = '"+id+"'");
        return sql[0];
    }

    async getAllCategories(){
        const sql = await this.DB.query("SELECT id, title, description FROM categories");
        return sql[0];
    }
    async getCategoryById(id){
        const sql = await this.DB.query("SELECT id, title, description FROM categories WHERE id = '"+ id +"'");
        return sql[0].length === 0 ? false : sql[0];
    }
    async isCategoryExist(title){
        const sql = await this.DB.query("SELECT * FROM categories WHERE title = '"+ title +"'");
        return sql[0].length !== 0;
    }
    async addNewCategory(body){
        const sql = await this.DB.query("INSERT INTO categories(title, description) VALUES ('"+body.title+"', '"+body.description+"')");
        return;
    }
    async deleteCategory(id){
        const sql = await this.DB.query("DELETE FROM categories WHERE id = '"+ id +"'");
        return;
    }
    async updateCategoryData(body, id){
        try{
            if(Object.entries(body).length === 0){
                throw 'Incorrect values';
            }
            Object.entries(body)
                .filter(([key, value]) => value)
                .map(([key, value]) => this.updateCategory(key, value, id))
        }
        catch(e){
            throw e;
        }
    }
    async updateCategory(key, value, searchParam){
        const sql = await this.DB.query("UPDATE categories SET "+key+" = '"+value+"' WHERE id = '"+ searchParam +"'");
        return;
    }
    async addPostToCategory(categories, [{id}]){
        Object.entries(categories).forEach( async ([,value]) => {
            await this.DB.query("INSERT INTO categories_posts(post_id, category_id) VALUES('"+id+"', '"+value+"')");
        })
    }

    async updateCategoriesForPostAdd(postId, categoryId){
        const sql = await this.DB.query("INSERT INTO categories_posts(post_id, category_id) VALUES ('"+postId+"', '"+categoryId+"')");
        return;
    }
    async updateCategoriesForPostDel(postId, categoryId){
        const sql = await this.DB.query("DELETE FROM categories_posts WHERE post_id = '"+postId+"' AND category_id = '"+categoryId+"'");
        return;
    }
    async updateCategoriesForPost(postId, categoryId, updateCategoryId){
        const sql = await this.DB.query("UPDATE categories_posts SET category_id = '"+updateCategoryId+"' WHERE post_id = '"+postId+"' AND category_id = '"+categoryId+"'");
        return;
    }
}

module.exports = new Category();


