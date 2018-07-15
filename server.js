const express = require('express');
const bodyParse = require('body-parser');
const crypto = require('crypto');

const redis = require('redis');
//client = redis.createClient();


//helper function for getting hash
const get256Hash = (message) => {
  let hash = crypto.createHash('sha256');
  hash.update(message);
  return hash.digest("hex")
}

const app = express();
app.use(bodyParse.text());



let data = {}
app.post('/messages', (request, response) => {44
  //convert message to  hash
  let messageHash = get256Hash(request.body);
  //<TODO>
  //store as key value pair in redis
  //</TODO>
  data[messageHash] = request.body;
    //on redis response, send post response
  response.end(messageHash);
})

app.get('/messages/:hash', (request, response) =>{
  if (!data[request.params.hash]){
    response.json(404, {"err_msg":	"Message	not	found"});
  } else {
    response.send(data[request.params.hash]);
  }
  //sendRequest to redis 
})

const PORT = 3000;
app.listen(PORT, ()=>console.log(`server listening on ${PORT}`));