const Model = require('./model');
const db = require("../settings/db");

class Like extends Model{
    constructor() {
        super();
    }

    async isPostLikeExist(postId, userId){
        const sql = await this.DB.query("SELECT * FROM likes_post WHERE post_id = '"+postId+"' AND author_id = '"+userId+"'");
        return sql[0].length !== 0;
    }
    async getLikePostById(postId, author_id){
        const sql = await this.DB.query("SELECT * FROM likes_post WHERE post_id ='"+postId+"' AND author_id = '"+author_id+"'");
        return sql[0].length === 0 ? false : sql[0];
    }
    async getLikeCommentById(commentId, author_id){
        const sql = await this.DB.query("SELECT * FROM likes_comment WHERE comment_id ='"+commentId+"' AND author_id = '"+author_id+"'");
        return sql[0].length === 0 ? false : sql[0];
    }
    async createLikePost(authorId, postId){
        const sql = await this.DB.query("INSERT INTO likes_post(author_id, post_id) VALUES('"+authorId+"', '"+postId+"')");
        return;
    }
    async isCommentLikeExist(commentId, userId){
        const sql = await this.DB.query("SELECT * FROM likes_comment WHERE comment_id = '"+commentId+"' AND author_id = '"+userId+"'");
        return sql[0].length !== 0;
    }
    async createLikeComment(authorId, postId){
        const sql = await this.DB.query("INSERT INTO likes_comment(author_id, comment_id) VALUES('"+authorId+"', '"+postId+"')");
        return;
    }
    async getLikesPost(postId){
        const sql = await this.DB.query("SELECT * FROM likes_post WHERE post_id = '"+postId+"'");
        return sql[0];
    }
    async getLikesComment(commentId){
        const sql = await this.DB.query("SELECT * FROM likes_comment WHERE comment_id = '"+commentId+"'");
        return sql[0].length;
    }
    async deleteLikePost(postId, userId){
        const sql = await this.DB.query("DELETE FROM likes_post WHERE post_id = '"+postId+"' AND author_id = '"+userId+"'");
        return;
    }
    async deleteLikeComment(commentId, userId){
        const sql = await this.DB.query("DELETE FROM likes_comment WHERE comment_id = '"+commentId+"' AND author_id = '"+userId+"'");
        return;
    }
}

module.exports = new Like();

