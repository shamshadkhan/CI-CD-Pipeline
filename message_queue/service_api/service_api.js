const express = require('express');
const app = express();
const http = require('http'); 
const amqp = require('amqplib/callback_api');
const store = require('store');
const fs = require('fs');

// create file to store the status
fs.writeFile('data.txt', '', function (err) {
    if (err) throw err;
    console.log('File Created!');
  });
  
  
// api gateway interface
app.get("/", (req, res, next) => {
 // display index.html 
  res.writeHead(200, { 'content-type': 'text/html' });
  fs.createReadStream('index.html').pipe(res);
});
  
  
// GET/messages api
app.get("/messages", (req, res, next) => {
 // Read data 
 http.get('http://service_httpserv:3000', (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.write(data.toString());
            res.end();
        });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    }).end();
});

// PUT/state api
app.put("/state", (req,res) => {
    // get the status and store in the storage
    console.log(req.query.data);
    const msg = req.query.data;
    store.set("status", req.query.data);
    
    // create log for state change
    const d = new Date();
    const n = d.toISOString();
    let newtext = "";
    // for init store log for both init and running
    if(msg==="INIT"){
    	newtext = `${n}: ${msg} \n${n}: RUNNING \n`;
    }
    else
    {
    	newtext = `${n}: ${msg} \n`;
    }
    // write the received messages to file
    fs.appendFile('data.txt', newtext, function (err) {
        if (err) throw err;
        console.log('Saved!', newtext);
      });
    
    // connect rabbitmq
    amqp.connect('amqp://guest:guest@rabbitmq:5672', (err, conn) => {
    if (err) {
        console.log(`Error ${err}`);
    }
    //create channel
    conn.createChannel((error, channel) => {
        if (error) {
            console.log(`Error ${err}`);
        }
        const exchange = 'topic_state';
        const key = 'my.state';
        const msg = req.query.data;

        channel.assertExchange(exchange, 'topic', {
            durable: false
            });
        // send pause message to orginal
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:%s", key, msg);
    });
   });
   res.write("PUT /state called");
   res.end();
}); 

// GET/state api
app.get("/state", (req, res, next) => {
 // Read state 
 const status = store.get("status")?store.get("status"):"RUNNING";
 res.write(status);
 res.end();
});

// GET/run-log api
app.get("/run-log", (req, res, next) => {
 // Read logs from file
 fs.readFile('data.txt', function(err, data) {
      if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
      });
});

// GET/node-statistic api
app.get("/node-statistic", (req, res, next) => {
 // Read logs from rabbitmq api
  http.get('http://guest:guest@rabbitmq:15672/api/nodes', (resp) => {
       
            let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
        const obj = JSON.parse(data);
        // set default json array to extract data
        const finaljson= {"mem_used":"", "fd_used":"", "sockets_used":"", "io_read_avg_time":"", "exchange_types":""};
        //extract data
    	for(let i = 0; i < obj.length; i++) {
    	    const result = obj[i];
        	    	finaljson.mem_used = result.mem_used;
        	    	finaljson.fd_used = result.fd_used;
        	    	finaljson.sockets_used = result.sockets_used;
        	    	finaljson.io_read_avg_time = result.io_read_avg_time;
        	    	finaljson.exchange_types = result.exchange_types;
    	}
        res.write(JSON.stringify(finaljson));
        res.end();
        });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    }).end();
});

// GET/queue-statistic api
app.get("/queue-statistic", (req, res, next) => {
 // Read logs from rabbitmq api
  http.get('http://guest:guest@rabbitmq:15672/api/queues', (resp) => {
       
         let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
        const obj = JSON.parse(data);
        // set default json array to extract data
        const finaljson= [];
        //extract data
    	for(let i = 0; i < obj.length; i++) {
    	    const result = obj[i];
        	    if(result.message_stats){
        		//extract data   
    		finaljson.push({"publish":result.message_stats.publish, "publish_details":result.message_stats.publish_details, "deliver_get":result.message_stats.deliver_get, "deliver_get_details":result.message_stats.deliver_get_details, "deliver_no_ack":result.message_stats.deliver_no_ack, "deliver_no_ack_details":result.message_stats.deliver_no_ack_details});
        	    }
    	}
        res.write(JSON.stringify(finaljson));
        res.end();
        });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    }).end();
});


//listen to port 8081
const server = app.listen(8081, function () {
   const host = server.address().address;
   const port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
});

module.exports = server;
