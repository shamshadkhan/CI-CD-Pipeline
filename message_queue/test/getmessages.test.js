const expect = require('chai').expect;
var request = require('supertest')("http://localhost:8081");
const nock = require('nock');


describe("Testing API with a mocked backend", function () {

  it("GET /messages returns a 200 when message got", function (done) {
    //specify the url to be intercepted
    nock("http://localhost:8081")
      //define the method to be intercepted
      .get('/messages/')
      //respond with a OK and the specified response
      .reply(200, "2020-11-19T18:05:36.037Z Topic my.o:MSG_1 ");
    //perform the request to the api which will now be intercepted by nock
    request
      .get('/messages/')
      .end(function (err, res) {
        //assert that the mocked response is returned
        expect(res.status).to.equal(200);
        expect(res.text).not.to.be.null;
        done();
      });
  })
  
  it("PUT /state returns a 200 when called", function (done) {
    //specify the url to be intercepted
    nock("http://localhost:8081")
      //define the method to be intercepted
      .put('/state?data=RUNNING')
      //respond with a OK and the specified response
      .reply(200, "PUT /state called ");
    //perform the request to the api which will now be intercepted by nock
    request
      .put('/state?data=RUNNING')
      .end(function (err, res) {
        //assert that the mocked response is returned
        expect(res.status).to.equal(200);
        expect(res.text).not.to.be.null;
        done();
      });
  })
  
  it("Get /state returns a 200 when called", function (done) {
    //specify the url to be intercepted
    nock("http://localhost:8081")
      //define the method to be intercepted
      .get('/state')
      //respond with a OK and the specified response
      .reply(200, "PAUSED");
    //perform the request to the api which will now be intercepted by nock
    request
      .get('/state')
      .end(function (err, res) {
        //assert that the mocked response is returned
        expect(res.status).to.equal(200);
        expect(res.text).not.to.be.null;
        done();

      });
  })
  
  it("Get /run-log returns a 200 when called", function (done) {
    //specify the url to be intercepted
    nock("http://localhost:8081")
      //define the method to be intercepted
      .get('/run-log')
      //respond with a OK and the specified response
      .reply(200, "2020-11-19T18:05:36.037Z: INIT");
    //perform the request to the api which will now be intercepted by nock
    request
      .get('/run-log')
      .end(function (err, res) {
        //assert that the mocked response is returned
        expect(res.status).to.equal(200);
        expect(res.text).not.to.be.null;
        done();
      });
  })
});

