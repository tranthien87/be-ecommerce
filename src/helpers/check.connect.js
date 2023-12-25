const { log } = require('console');
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

// console.log(process.env);
const SECOND = 5000;

const countConnect = () => {
    const connectNum = mongoose.connections.length;
    console.log(`Number of connections --- ${connectNum}`);
}

const checkOverLoad = () => {
    setInterval(() => {
        const connectNum = mongoose.connections.length;
        const numberCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log(`Active connect:: ${connectNum}`);
        
        console.log(`Memory use::: ${memoryUsage / 1024 /1024} MB`);

        const maxConnect = numberCore * 5;
    
        if (connectNum > maxConnect) {
            console.log('Overload connecttions detected');
        }
    
    }, SECOND) 
  
}
module.exports = { countConnect, checkOverLoad }