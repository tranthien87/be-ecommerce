const amqplib = require('amqplib');

const publishDirect = async({message}) => {
    try {
        const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
        const channel = await connect.createChannel();
        // create exchange
        const exchangeName = 'logs_direct';
        const agr = process.argv.slice(2)
        const severity = agr.length > 0 ? agr[0] : 'info';

        await channel.assertExchange(exchangeName, 'direct', {
            durable: true
        })

        await channel.publish(exchangeName, severity, Buffer.from(message)); // publish message
    
        setTimeout(() => {
            connect.close();
            process.exit(0); // exit process
        }, 3000)

    } catch (error) {
        console.error(error);
    }
}

const message = process.argv.slice(2).join(' ') || "Hello, This is message default!!"; // get message from command line
publishDirect({message});