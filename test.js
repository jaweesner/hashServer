process.env.TESTCONTEXT = true;
const expect = require('chai').expect;
const request = require('request');
const {_get256Hash, _redisClient, _server} = require('./server.js');

describe('Hash helper function', () => {
  it('Should return the correct hash for a message', (done)=>{
    expect(_get256Hash('hello!')).to.equal('ce06092fb948d9ffac7d1a376e404b26b7575bcc11ee05a4615fef4fec3a308b');
    expect(_get256Hash('A different hash')).to.equal('b5c6f1debb3d30d68ec28b439ab5c23db6c21e0e70264c75337260be0e2e9eea');
    done();
  })
})

describe('Server function', () => {
  it ('Should return an error when getting hashes not in the database', (done) => {
    _redisClient.del('08c1497b65db88f4882ec8bbc9fbda357d3f42519a56f55668d6c16536690790');
    request(
      'http://127.0.0.1:3000/messages/08c1497b65db88f4882ec8bbc9fbda357d3f42519a56f55668d6c16536690790', 
      (err, response, body) => {
        expect(err).to.equal(null);
        expect(response).to.exist;
        expect(response.statusCode).to.equal(404);
        body = JSON.parse(body);
        expect(body.err_msg).to.equal('Message not found');
        done();
      }
    )
  });
  it ('Should add messages to the database and return the matching hash', (done) => {
    request.post({
      url:'http://127.0.0.1:3000/messages/',
      json: true,
      body: {"message":"TEST VALUE"}
      }, (err, response, body) => {
        expect(err).to.equal(null);
        expect(response).to.exist;
        expect(response.statusCode).to.equal(201);
        //body = JSON.parse(body);
        expect(body.digest).to.equal('08c1497b65db88f4882ec8bbc9fbda357d3f42519a56f55668d6c16536690790');
        done();
      }
    )  
  });
  it ('Should retrieve existing messages from the DB and return', (done) => {
    request(
      'http://127.0.0.1:3000/messages/08c1497b65db88f4882ec8bbc9fbda357d3f42519a56f55668d6c16536690790', 
      (err, response, body) => {
        expect(err).to.equal(null);
        expect(response).to.exist;
        expect(response.statusCode).to.equal(200);
        body = JSON.parse(body);
        expect(body.message).to.equal('TEST VALUE');
        done();
      }
    )


  })


  after((done) => {
    _server.close(() => {
      _redisClient.quit();
      done();
    });
  });

})
