const amqplib = require('amqplib');

require('dotenv').config(); // load .env file

const sendMail = async({message}) => {
    try {
        const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
        const channel = await connect.createChannel();
        // create exchange
        const exchangeName = 'send_email';
        await channel.assertExchange(exchangeName, 'topic', {
            durable: true
        })

        console.log(agrv);
        const message = agrv[1];
        const topic = agrv[0]


        await channel.publish(exchangeName, topic , Buffer.from(message)); // publish message

        console.log(`Message sen OK:: ${message}`);

        setTimeout(() => {
            connect.close();
            process.exit(0); // exit process
        }, 3000)

    } catch (error) {
        console.error(error);
    }
}

const message = process.argv.slice(2).join(' ') || "Hello, This is message default!!"; // get message from command line
sendMail({message});