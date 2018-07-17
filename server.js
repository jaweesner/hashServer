const express = require('express');
const bodyParse = require('body-parser');
const crypto = require('crypto');

//configure DB
const redis = require('redis');
const client = redis.createClient();

client.on("connect", ()=>console.log('connected to DB'))
client.on("error", function (err) {
  throw new Error(err);
});

//helper function for getting hash
const get256Hash = (message) => {
  let hash = crypto.createHash('sha256');
  hash.update(message);
  return hash.digest("hex")
}

// create express instance and parse body
const app = express();
app.use(bodyParse.json());

//handle routes
app.post('/messages', (request, response) => {
  let messageHash = get256Hash(request.body.message);

  client.set(messageHash, request.body.message, (err, reply)=>{
    if (err){
      response.status(500).json({"err_msg":	"Could not add to database"});
    } else {
      response.status(201).json({"digest": messageHash});
    }
  })
})

app.get('/messages/:hash', (request, response, next) =>{
  client.get(request.params.hash, (err, reply) =>{
    if(err){
      response.status(500).json({"err_msg":	"Database Error"});
    } else if (reply === null) {
      response.status(404).json({"err_msg":	"Message not found"});
    } else {
      response.json({"message": reply});
    }
  })
})


//start listening to server port
const PORT = 3000;
const server = app.listen(PORT, ()=>console.log(`server listening on ${PORT}`));


//only export for testing
if (process.env.TESTCONTEXT === 'true'){
  module.exports._get256Hash = get256Hash;
  module.exports._redisClient = client;
  module.exports._server = server;
}
