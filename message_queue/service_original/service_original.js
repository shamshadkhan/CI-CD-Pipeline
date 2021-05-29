const amqp = require('amqplib/callback_api');
const store = require('store');
const status = "RUNNING";

// store the inital state
store.set("status",status);

// connect to rabbitmq
amqp.connect('amqp://guest:guest@rabbitmq:5672', (err, conn) => {
    if (err) {
        console.log(`Error ${err}`);
    }
    conn.createChannel((error, channel) => {
        if (error) {
            console.log(`Error ${err}`);
        }
        //define exchange and key
        const exchange = 'topic_my';
        const exchange1 = 'topic_state';
        const key = 'my.o';
        const key1 = 'my.state';
        const msgs = ['MSG_1','MSG_2','MSG_3'];

	    // define assertExchange for each topics
        channel.assertExchange(exchange, 'topic', {
            durable: false
            });
        channel.assertExchange(exchange1, 'topic', {
            durable: false
            });
        let i=0;        
        const interval = setInterval(function() { 
		// check the status and RESUME and PAUSE sending message
    		if(store.get("status") === "INIT" || store.get("status") === "RUNNING"){
    		// make the service send message forever
    		    if(i<3){
    		        channel.publish(exchange, key, Buffer.from(msgs[i]));
    		        console.log(" [x] Sent %s:%s", key, msgs[i]);
    		        i++;
    		    }
    		    else
    		    	i=0; 
    		}
            }, 3000);
         channel.assertQueue('', {
                exclusive: true
              }, function(error2, q) {
                if (error2) {
                    console.log(`Error ${error2}`);
                }
                // bind the topic status to queue
                channel.bindQueue(q.queue, exchange1, key1);
                // consume and publish to another exchange topic
                channel.consume(q.queue, function(msg) {
                    const newtext = `${msg.content}`;
                    console.log('Received State!',newtext);
                    store.set("status",newtext);
                    // if status INIT found set the status to running
                    if(newtext === "INIT")
                    {
                    	store.set("status","RUNNING");
                    }
                }, {
                  noAck: true
                });
              });
        
        
    });

    //setTimeout(function() { 
    //    conn.close(); 
    //    process.exit(0) 
    //}, 11000);

    
});
