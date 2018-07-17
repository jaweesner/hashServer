# Hash Server

This application code provides a basic service that will handle the following routes:
- POST /messages 
  - store the message body recieved through the request in redis and will respond with the message's sha256 hash
- GET /messsages/<SHA256 HASH>
  - retrieve the message corresponding to request hash and respond with message

## To Use
Currently, this service is active at  http://ec2-54-83-154-76.compute-1.amazonaws.com/ and can be queried directly.

### To Run
node.js and Redis must be installed. They can be downloaded here:  
- https://nodejs.org/en/download/    
- https://redis.io/download/

If you would like host the service yourself, clone the repo to your computer and run `npm install` while in the repo directory. then run `npm start`.  By default, the server will listen on port 3000. 


To run the test suite, run `npm test`

### Examples

```
$ curl -X POST -H "Content-Type: application/json" -d '{"message": "foo"}' http://ec2-54-83-154-76.compute-1.amazonaws.com/messages

>{"digest":"2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"}

$ curl http://ec2-54-83-154-76.compute-1.amazonaws.com/messages/2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae

>{"message":"foo"}



```
