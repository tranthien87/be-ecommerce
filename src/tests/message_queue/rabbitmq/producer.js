const amqplib = require('amqplib')

const message = 'hello shopDEV';

const runProducer = async () => {
   try {
    const connect = await amqplib.connect('amqp://localhost');
    const channel = await connect.createChannel();
    const queueName = 'test-queue';

    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(message))

    console.log(`Message sent: ${message}`)
   } catch (error) {
    console.error(error)
   }
}

runProducer().catch(error => console.log(error))