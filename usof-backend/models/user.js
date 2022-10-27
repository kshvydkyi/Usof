const Model = require('./model');
const bcrypt = require('bcryptjs');
const db = require("../settings/db");

class User extends Model {
    constructor() {
        super();
    }
    async register(body) {
        try{
            const isLogin = await this.isLoginExist(body.login);
            const isEmail = await this.isEmailExist(body.email);
            if(!isLogin || !isEmail){
                const sql = await this.DB.query("INSERT INTO `users`(`login`, `password`,`full_name`,`email`) VALUES('"+ body.login +"', '"+ body.password +"','"+ body.fullName +"','"+ body.email +"')");
                return;
            }
            throw 'This login or email already exist';
        }
        catch (e){
            throw e;
        }

    }
    async initUser(value){
        const sql = await this.DB.query("SELECT id, login FROM users WHERE email = '"+ value +"'")
        return sql[0];
    }
    async getLogin(id){
        const sql = await this.DB.query("SELECT login FROM users WHERE id = '"+ id +"'")
        return sql[0];
    }
    async getUserPhoto(id){
        const sql = await this.DB.query("SELECT photo FROM users WHERE id = '"+ id +"'")
        return sql[0];
    }
    async login(value){
        const sql = await this.DB.query("SELECT id, login, password, role FROM users WHERE login = '"+ value +"'");
        return sql[0];
    }
    async getToken(id){
        const sql = await this.DB.query("SELECT tmp_token FROM users WHERE id = '"+ id +"'");
        return sql[0];
    }
    async getAllUsers(){
        const sql = await this.DB.query('SELECT users.id, users.login, users.full_name, users.photo, users.email, users.role, users.rating FROM `users`');
        return sql[0];
    }

    async addNewUser(body, enPassword){
        const sql = await this.DB.query("INSERT INTO `users`(`login`, `password`,`full_name`,`email`,`role`) VALUES('"+ body.login +"', '"+ enPassword +"','"+ body.fullName +"','"+ body.email +"','"+ body.role +"')");
        return;
    }

    async getUserById(id){
            const sql = await this.DB.query("SELECT login, full_name, photo, email, role, rating FROM users WHERE id = '"+ id +"'");
            return sql[0].length === 0 ? false : sql[0];
    }

    async isLoginExist(login){
        const sql = await this.DB.query("SELECT * FROM users WHERE login = '"+ login +"'");
        return sql[0].length !== 0;
    }

    async isEmailExist(email){
            const sql = await this.DB.query("SELECT * FROM users WHERE email = '"+ email +"'");
            return sql[0].length !== 0;
        }

    async uploadAvatar(path, id){
        const sql = await this.DB.query("UPDATE users SET photo = '"+path+"' WHERE id = '"+ id +"'");
        return;
    }
    async updateUserData(body, id){
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
        const sql = await this.DB.query("UPDATE users SET "+key+" = '"+value+"' WHERE id = '"+ searchParam +"'");
        return;
    }
    async isAdmin(id){
        const [sql] = await this.DB.query("SELECT role FROM users WHERE id = '"+id+"'")
        return sql[0].role === 'Admin';
    }
    async ratingPlus(userId){
        const [rating] = await this.DB.query("SELECT rating FROM users WHERE id = '"+userId+"'");
        const newRating = rating[0].rating +1;
        const sql = await this.DB.query("UPDATE users SET rating = '"+newRating+"' WHERE id = '"+userId+"'");
        return;
    }
    async minusRating(userId){
        const [rating] = await this.DB.query("SELECT rating FROM users WHERE id = '"+userId+"'");
        const newRating = rating[0].rating - 1;
        const sql = await this.DB.query("UPDATE users SET rating = '"+newRating+"' WHERE id = '"+userId+"'");
        return;
    }
    async deleteUser(id){
        const sql = await this.DB.query("DELETE FROM users WHERE id = '"+ id +"'");
        return;
    }
}
module.exports = new User();

