const mongoose = require('mongoose');

const { countConnect, checkOverLoad } = require('../helpers/check.connect');
const {clouddb: {username, password}} = require('../configs/config.mongodb')

// const url = `mongodb://${host}:${port}/${name}`;
const usernameUri = encodeURIComponent(username);
const passwordUri = encodeURIComponent(password);
const url = `mongodb+srv://${usernameUri}:${passwordUri}@cluster0.vwxcp.mongodb.net/shopDev?retryWrites=true&w=majority&appName=Cluster0`


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
            console.log(`Mongoose database connected successfull!`);
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
