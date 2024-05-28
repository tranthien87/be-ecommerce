const amqplib = require('amqplib')

const message = 'Message from shop DEV';

const orderedPublish = async () => {
   try {
    
    const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
    const channel = await connect.createChannel();
    const queueName = 'ordred-queue';

    await channel.assertQueue(queueName, {
        durable: true
    })

    for (let index = 0; index < 10; index++) {
        const message = `orderd queue message :: ${index}`;
        console.log(message);
        channel.sendToQueue(queueName, Buffer.from(message), { 
            persistent: true
        });

    }


    // setTimeout(() => {
    //     connection.close();
    // }, 5000)

   } catch (error) {
    console.error(error)
   }
}

orderedPublish().catch(error => console.log(error))