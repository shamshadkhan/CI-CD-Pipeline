const amqp = require('amqplib/callback_api');
const fs = require('fs');
// create file to store the queue messages
fs.writeFile('app/data.txt', '', function (err) {
    if (err) throw err;
    console.log('File Created!');
  });
// rabbitmq connection
amqp.connect('amqp://guest:guest@rabbitmq:5672', (err, conn) => {
    if (err) {
        console.log(`Error ${err}`);
    }
    // create channel to send exchange topic     
    conn.createChannel((error, channel) => {
        if (error) {
            console.log(`Error ${err}`);
        }
        //define exchange and key
        const exchange = 'topic_my';
        const key = 'my.#';
        channel.assertExchange(exchange, 'topic', {
            durable: false
            });
            channel.assertQueue('', {
                exclusive: true
              }, function(error2, q) {
                if (error2) {
                    console.log(`Error ${error2}`);
                }
                // bind the topic to queue
                channel.bindQueue(q.queue, exchange, key);
                // consume queue and save the content to file
                channel.consume(q.queue, function(msg) {
                    const d = new Date();
                    const n = d.toISOString();
                    const newtext = `${n} Topic ${msg.fields.routingKey}:${msg.content} \n`;
                    // write the received messages to file
                    fs.appendFile('app/data.txt', newtext, function (err) {
                        if (err) throw err;
                        console.log('Saved!',newtext);
                      });
                }, {
                  noAck: true
                });
              });
        
    });
    // setTimeout(function() { 
    //     conn.close(); 
    //     process.exit(0) 
    // }, 3000);
});
