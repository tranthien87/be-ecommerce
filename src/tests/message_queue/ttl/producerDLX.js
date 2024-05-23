const amqplib = require('amqplib');

const producerDlx = async() => {
    try {
        const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
        const channel = await connect.createChannel();
        // create exchange
        const notificationExchange = 'notificationEx';
        const notiQueue = 'notificationQueueProcess';
        const notificationExchangeDLX = 'notificationExDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

        // create exhange notification
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })
        // create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, 
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        }) 
        console.log('Queue object::', queueResult);
        //  bindding queue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        const message = process.argv.slice(2).join(' ') || "A product has created !"; // get message from command line

        await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
            expiration: "10000"
        })

        console.log(`Message sent OK:: ${message}`);
        // setTimeout(() => {
        //     connect.close();
        //     process.exit(0); // exit process
        // }, 3000)


    } catch (error) {
        console.error(error);
    }
}

producerDlx().then(res => console.log(res)).catch(error => console.error(error));