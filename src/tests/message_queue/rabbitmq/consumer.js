const amqplib = require('amqplib')


const runConsumer = async () => {
   try {
    const connect = await amqplib.connect('amqp://localhost');
    const channel = await connect.createChannel();
    const queueName = 'test-queue';

    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.consume(queueName, (message) => {
        console.log(`Message recieved at consumer:: ${message.content.toString()}`);
    }, {
        noAck: true
    })

   } catch (error) {
    console.error(error)
   }
}

runConsumer().catch(error => console.log(error))