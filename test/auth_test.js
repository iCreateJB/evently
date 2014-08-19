process.env.NODE_ENV = 'test'

var expect = require("chai").expect,
    assert = require("assert"),
    should = require("should"),
   request = require('supertest'),
     sinon = require('sinon'),
     redis = require('../lib/db.js'),
       app = require('../app.js');

  user = {
    email: 'info@hermes.io',
    credentials: {
      api_key: '2a246359-6b80-47eb-85fe-124c5c4bca40'
    }
  }

describe('[Request] POST /',function(){

  it('respond with invalid request type',function(done){
    request(app).post('/').set('Accept','application/html').expect(406,done)
  })

  it('respond with invalid request type [GET]',function(done){
    request(app).get('/').set('Content-Type','application/json').expect(406,done)
  })

  it('respond with unauthorized [no key]',function(done){
    request(app).post('/').send({ app_id: 12345 }).set('Content-Type','application/json').expect(401,done)
  })

  it('respond with unauthorized [invalid key]',function(done){
    request(app).post('/')
      .set('Authorization', 'c7762e8ec07f')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({})
      .expect(401,done)
  })

  it('respond with unauthorized [invalid app id]',function(done){
    request(app).post('/')
      .set('Authorization', 'c7762e8ec07f')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({ app_id: '124c5c4bca40' })
      .expect(401,done)
  })

  it('respond with newly created event',function(done){
    redis.hmset( 'user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce2','user:info@hermes.io',function(err,res){})
    request(app).post('/')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce2', messageDetail: 'This is a test', messageType: 'Info' })
      .expect(201,done)
  })
})

describe('[Response] POST /',function(){
  var response
  before(function(done){
    redis.hmset( 'user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce2','user:info@hermes.io',function(err,res){})
    request(app).post('/')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce2', messageDetail: 'This is a test', messageType: 'Info' })
      .end(function(req, res){
        response = res.body;
        done();
      });
  })

  it('has key [:status]',function(){ response.should.have.property('status') })
  it('has key [:data]',function(){ response.should.have.property('data') })
  it('[data] has key [:event_id]',function(){ response.data.should.have.property('event_id') })
  it('[data] has key [:ip]',function(){ response.data.should.have.property('ip') })
  it('[data] has key [:params]',function(){ response.data.should.have.property('params') })
  it('[data] has key [:timestamp]',function(){ response.data.should.have.property('timestamp') })
  it('[data] has key [:detail]',function(){ response.data.should.have.property('detail') })
  it('[data] has key [:app_id]',function(){ response.data.should.have.property('app_id') })
})

describe ('[Request] GET /event/:event_id',function(){
  var response
  before(function(done){
    redis.hmset( 'user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce2','user:info@hermes.io',function(err,res){})
    request(app).post('/')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce2', messageDetail: 'This is a test', messageType: 'Info' })
      .end(function(req, res){
        response = res.body;
        done();
      });
  })

  it('respond with the :event',function(done){
    request(app).get('/event/'+response.data.event_id+'?app_id=a6e1a32a-2f19-4751-990a-298f3b1f2ce2')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .end(function(req,res){
        getRes = res.body.data
        getRes.event_id = response.data.event_id
        done();
      })
  })
})
