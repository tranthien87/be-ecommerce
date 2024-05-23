const amqplib = require('amqplib')

const message = 'Message from shop DEV';

const runProducer = async () => {
   try {
    
    const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
    const channel = await connect.createChannel();
    const queueName = 'test-queue';

    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(message));

    console.log(`Message sent: ${message}`);
    // setTimeout(() => {
    //     connection.close();
    // }, 2000)

   } catch (error) {
    console.error(error)
   }
}

runProducer().catch(error => console.log(error))