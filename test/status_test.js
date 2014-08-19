process.env.NODE_ENV = 'test'

var expect = require("chai").expect,
    assert = require("assert"),
   request = require('supertest'),
     sinon = require('sinon'),
     redis = require('../lib/db.js'),
       app = require('../app.js');


describe('[Request] GET /ping', function(){
  before(function(done){
    sinon.stub(redis,'ping').returns({ ping: function(){ return true } })
    done();
  })

  it('respond to html',function(done){
    request(app).get('/ping')
      .set('Content-Type','application/html')
      .set('Accept','application/html')
      .expect('Content-Type',/json/,done)
  })

  it('respond to json',function(done){
    request(app).get('/ping')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .expect('Content-Type',/json/,done)
  })

  it('respond with json', function(done){
    request(app).get('/ping')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .expect('Content-Type',/json/,done)
  })

  it('respond with 200',function(done){
    request(app).get('/ping')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .expect(200, done);
  })

  it('should contain :status', function(done){
    request(app).get('/ping')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .expect('Content-Type',/json/)
      .end(function(req, res){
        expect(res.body).to.have.property('status')
      });
      done();
  })

  it('should set status as "Ok"',function(done){
    request(app).get('/ping')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .end(function(req, res){
        expect(res.body.status == 'Ok')
      });
      done();
  })

  it('should set status as "Down"',function(done){
    request(app).get('/ping')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .end(function(req, res){
        expect(res.body.status == 'Down')
      });
      done();
  })
})
