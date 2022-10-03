const db = require('./../settings/db');

class Model {
    constructor() {
        this.DB = db;
    }
}
module.exports = Model;


