const amqplib = require('amqplib')


const ordredConsume = async () => {
    
  try {
    const connect = await amqplib.connect('amqps://uwhexygi:eL3Xu2xMnkhpGUhEERG6hAOoICfuYWcg@octopus.rmq3.cloudamqp.com/uwhexygi');
    const channel = await connect.createChannel();
    const queueName = 'ordred-queue';

    await channel.assertQueue(queueName, {
        durable: true
    })
    channel.prefetch(1); // ordered queue 
    channel.consume(queueName, (message) => {

        const msg = message.content.toString();

        setTimeout(() => {
            console.log(`Process:: ${msg}`);
            channel.ack(message)
        }, Math.random() * 1000);
       
    })
  } catch (error) {
    console.error(error);
  }


}

ordredConsume().catch(error => console.log(error))