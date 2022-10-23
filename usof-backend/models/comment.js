const Model = require('./model');
const db = require("../settings/db");

class Comment extends Model{
    constructor() {
        super();
    }
    async createComment(content, authorId, postId){
        const sql = await this.DB.query("INSERT INTO comments(content, author_id, post_id) VALUES('"+content+"', '"+authorId+"', '"+postId+"')");
        return;
    }
    async getCommentById(id){
        const sql = await this.DB.query("SELECT id, content, author_id, post_id, publish_date, status FROM comments WHERE id = '"+ id +"'");
        return sql[0].length === 0 ? false : sql[0];
    }
    async getCommentsInPost(postId){
        const sql = await this.DB.query("SELECT id FROM comments WHERE post_id = '"+postId+"' AND status = 'active'");
        return sql[0];
    }
    async getCommentsInPostAdmin(postId){
        const sql = await this.DB.query("SELECT id FROM comments WHERE post_id = '"+postId+"'");
        return sql[0];
    }
    async updateComment(id, content){
        const sql = await this.DB.query("UPDATE comments SET content = '"+content+"' WHERE id = '"+id+"'");
        return;
        // const sql = await this.DB.query("UPDATE posts SET "+key+" = '"+value+"' WHERE id = '"+ searchParam +"'");
    }
    async setStatusComment(id, status){
        const sql = await this.DB.query("UPDATE comments SET status = '"+status+"' WHERE id = '"+id+"'")
    }
    async deteleComment(id){
        const sql = await this.DB.query("DELETE FROM comments WHERE id = '"+ id +"'");
        return;
    }
}

module.exports = new Comment();


