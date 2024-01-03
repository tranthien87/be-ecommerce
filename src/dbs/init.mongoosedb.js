const mongoose = require('mongoose');

const { countConnect, checkOverLoad } = require('../helpers/check.connect');
const {db: {host, name, port}} = require('../configs/config.mongodb')

const url = `mongodb://${host}:${port}/${name}`;
console.log('connect string::', url);

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        // if(1 === 1) {
        //     mongoose.set('debug', true);
        //     mongoose.set('debug', {color: true})
        // }
        mongoose.connect(url)
        .then(() => {
            countConnect()
            console.log(`Mongoose database connected sucessfull!`);
            // console.log('Checking overload:::', checkOverLoad());
    
        })
        .catch(error => console.log(`Mongoose connect error: ${error}`))
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance =  new Database();
        }
        return Database.instance;
    }

}

const instanceMongoDatabase = Database.getInstance();
    

module.exports = instanceMongoDatabase;
