const amqp = require('amqplib/callback_api');
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
        //define exchange and keys
        const exchange = 'topic_my';
        const exchange1 = 'topic_my';
        const key = 'my.o';
        const key1 = 'my.i';
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
                // consume and publish to another exchange topic
                channel.consume(q.queue, function(msg) {
                    setTimeout(() => {
                    	 //publish message with new exchange topic
                        channel.publish(exchange1, key1, Buffer.from('Got ' + msg.content));
                        console.log(" [x] Got %s:%s", key1, msg.content);
                    }, 1000);
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
