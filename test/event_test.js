process.env.NODE_ENV = 'test'

var expect = require("chai").expect,
    assert = require("assert"),
    should = require("should"),
     sinon = require('sinon'),
     uuid  = require('node-uuid'),
     redis = require('../lib/db.js'),
     Event = require('../lib/event.js');

  var event
  var app_id = uuid.v4()
  var api_key= uuid.v4()

before(function(done){
  event = new Event({ app_id: app_id, api_key: api_key, messageType: 'Info', messageDetail: 'Test Frame'},'127.0.0.1');
  done();
})

describe('Event #new',function(){
  it('should have :reqData', function(){event.should.have.property('reqData') })
  it('should have :ip', function(){ event.should.have.property('ip') })
  it('should have :error', function(){ event.should.have.property('error') })
})

describe('Event Response #create',function(){

  context('Keys',function(){
    var req
    before(function(done){
      req = event.create();
      done();
    })

    it('should return app_id',function(){ expect(req.api_id).to.not.be.null })
    it('should return event_id',function(){ expect(req.event_id).to.not.be.null })
    it('should return ip',function(){ expect(req.ip).to.not.be.null })
    it('should return params',function(){ expect(req.params).to.not.be.null })
    it('should return an JSON object', function(){ req.params.should.be.json })
    it('should return timestamp',function(){ expect(req.timestamp).to.not.be.null })
    it('should return status',function(){ expect(req.status).to.not.be.null })
    it('should return message',function(){ expect(req.detail).to.not.be.null })
    it('should return an Object', function(){ req.should.be.type('object')})
  })

  context('Values',function(){
    var recEvent
    before(function(done){
      recEvent = event.create();
      done();
    })
    it('should verify app_id', function(){ recEvent.app_id.should.be.equal(event.reqData.app_id )})
    it('should verify messageDetail is set to event.messageDetail',function(){ expect(recEvent.detail).to.be.equal('Test Frame') })
    it('should verify ip is set to event.ip',function(){ expect(recEvent.ip).to.equal('127.0.0.1') })
    it('should verify status is set to event.status',function(){ expect(recEvent.status).to.equal('Info') })
  })
})

describe('Event Response #create [Error]',function(){
  var reqError
  before(function(done){
    // reqError.ip = null;
    // reqError    = event.create();
    done();
  })
  it('should raise error');
})
