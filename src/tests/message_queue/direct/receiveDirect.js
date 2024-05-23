const amqplib = require('amqplib');
const agr = process.argv.slice(2)
const receiveDirect = async () => {
    try {

        const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
        const channel = await connect.createChannel();
        // create exchange
        const exchangeName = 'logs_direct';
      
        await channel.assertExchange(exchangeName, 'direct', {
            durable: true
        })

        // create queue
        const { queue }  = await channel.assertQueue('', {
            exclusive: true
        }); // create a random queue
        console.log(`Name queue:: ${queue}`);

        console.log(agr);
        // bindding queue  to exchange
        agr.forEach(severity => {
            channel.bindQueue(queue, exchangeName, severity); // bind queue to exchange
        })
       
        // consume message
        await channel.consume(queue, (msg) => { 
             console.log(`Message recieved direct :: ${msg.content.toString()}`); 
            }, {
                noAck: true     
            })

    } catch (error) {
        console.error(error);
    }
}

receiveDirect();

