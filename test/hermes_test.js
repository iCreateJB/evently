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

describe ('[Request] findByEventId',function(){
  var response, getResponse
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

        request(app).get('/event/'+response.data.event_id+'?app_id=a6e1a32a-2f19-4751-990a-298f3b1f2ce2')
          .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
          .set('Content-Type','application/json')
          .set('Accept','application/json')
          .end(function(req_2,res_2){
            getResponse = res_2.body.data
            getResponse.event_id = response.data.event_id
            done();
          })
      });
  })

  it('has key [:app_id]',function(){ getResponse.should.have.property('app_id') })
  it('has key [:detail]',function(){ getResponse.should.have.property('detail') })
  it('has key [:event_id]',function(){ getResponse.should.have.property('event_id') })
  it('has key [:ip]',function(){ getResponse.should.have.property('ip') })
  it('has key [:params]',function(){ getResponse.should.have.property('params') })
  it('has key [:status]',function(){ getResponse.should.have.property('status') })
  it('has key [:timestamp]',function(){ getResponse.should.have.property('timestamp') })
})
