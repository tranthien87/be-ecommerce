const amqplib = require('amqplib');

const receiveMail = async () => {
    try {

        const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
        const channel = await connect.createChannel();
        // create exchange
        const exchangeName = 'send_email';
        await channel.assertExchange(exchangeName, 'fanout', {
            durable: true
        })

        // create queue
        const { queue }  = await channel.assertQueue('', {
            exclusive: true
        }); // create a random queue
        console.log(`Name queue:: ${queue}`);
        // bindding queue  to exchange

        await channel.bindQueue(queue, exchangeName, ''); // bind queue to exchange
        // consume message
        await channel.consume(queue, (msg) => { 
             console.log(`Message recieved :: ${msg.content.toString()}`); 
            }, {
                noAck: true     
            })

    } catch (error) {
        console.error(error);
    }
}

receiveMail();

