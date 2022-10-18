const Model = require('./model');
const db = require("../settings/db");
const Category = require('./../models/category');

class Post extends Model {
    constructor() {
        super();
    }
    async getActivePosts(){
        const sql = await this.DB.query("SELECT id, author_id, title, content, image, status, publish_date FROM posts WHERE status = 'active'");
        return sql[0];
    }
    async getAllPosts(){
        const sql = await this.DB.query("SELECT * FROM posts");
        return sql[0];
    }
    async getPostById(id){
        const sql = await this.DB.query("SELECT id, author_id, title, content, image, status, publish_date FROM posts WHERE id = '"+ id +"'");
        return sql[0].length === 0 ? false : sql[0];
    }
    async addPostToCategory(categories, [{id}]){
        Object.entries(categories).forEach( async ([,value]) => {
            await this.DB.query("INSERT INTO categories_posts(post_id, category_id) VALUES('"+id+"', '"+value+"')");
        })
    }
    async createPost({title, content, image, ...categories}, author_id){
        const sql = await this.DB.query("INSERT INTO posts(author_id, title, content, image, publish_date) VALUES ('"+author_id+"', '"+title+"', '"+content+"', '"+image+"', CURRENT_TIMESTAMP())");
        const getId = await this.DB.query("SELECT id FROM posts WHERE title = '"+title+"'");
        Object.entries(categories).forEach( async ([,value]) => {
            await this.DB.query("INSERT INTO categories_posts(post_id, category_id) VALUES('"+getId[0][0].id+"', '"+value+"')");
        })
        return;

    }
    async isPostWithSuchTitleExist(title){
        const sql = await this.DB.query("SELECT * FROM posts WHERE title = '"+ title +"'");
        return sql[0].length !== 0;
    }
    async getPostCategories(id){
        const sql = await this.DB.query("SELECT category_id FROM categories_posts WHERE post_id = '"+id+"'");
        return sql[0];

    }
    async getPersonalPosts(id){
        const sql = await this.DB.query("SELECT title, content, image, status, publish_date FROM posts WHERE author_id = '"+id+"'");
        return sql[0];
    }

    async updatePostData(body, id){
        try{
            if(Object.entries(body).length === 0){
                throw 'Incorrect values';
            }
            Object.entries(body)
                .filter(([key, value]) => value)
                .map(([key, value]) => this.updateValues(key, value, id))
        }
        catch(e){
            throw e;
        }
    }
    async updateValues(key, value, searchParam) {
        const sql = await this.DB.query("UPDATE posts SET "+key+" = '"+value+"' WHERE id = '"+ searchParam +"'");
        return;
    }
    async adminSetStatus(status, postId){
        const sql = await this.DB.query("UPDATE posts SET status = '"+status+"' WHERE id = '"+postId+"'")
    }
    async updateImage(path, id){
        const sql = await this.DB.query("UPDATE posts SET image = '"+path+"' WHERE id = '"+ id +"'");
        return;
    }
    async detelePost(id){
        const sql = await this.DB.query("DELETE FROM posts WHERE id = '"+ id +"'");
        return;
    }
}

module.exports = new Post();


