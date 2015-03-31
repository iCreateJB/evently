  var app = require('../app.js')

  user = {
    email: 'info@hermes.io',
    credentials: {
      api_key: '2a246359-6b80-47eb-85fe-124c5c4bca40'
    }
  }

describe('[Request] findByEventId',function(){
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

describe('[Request] activity',function(){
  var getReq, getRes
  before(function(done){
    redis.hmset( 'user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce22','user:info@hermes.io',function(err,res){})

    request(app).post('/')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce22', messageDetail: 'This is a test [:error]', messageType: 'Error' })
      .end(function(err, res){
        if (err) throw err;
        request(app).post('/')
          .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
          .set('Content-Type','application/json')
          .set('Accept','application/json')
          .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce22', messageDetail: 'This is a test [:debug]', messageType: 'Debug' })
          .end(function(err, res){
            if (err) throw err;
            request(app).get('/activity?app_id='+res.body.data.app_id)
              .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
              .set('Content-Type','application/json')
              .set('Accept','application/json')
              .end(function(request,response){
                getRes = response.body
                done();
              })
        })
      })
  })

  it('has key [:count]',function(){ getRes.should.have.property('count') })
  it('has a size of [2]',function(){ getRes.count.should.be.equal(2) })
  it('has key [:data]',function(){ getRes.should.have.property('data') })
  it('should be an array',function(){ getRes.data.should.be.instanceof(Array) })
  it('event has different timestamp',function(){ getRes.data[0].timestamp.should.not.be.equal(getRes.data[1].timestamp)})
})

describe('[Request] messageType :error', function(){
  var getReq, getRes
  before(function(done){
    redis.hmset( 'user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce22','user:info@hermes.io',function(err,res){})

    request(app).post('/')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce22', messageDetail: 'This is a test [:error]', messageType: 'Error' })
      .end(function(err, res){
        if (err) throw err;
        request(app).post('/')
          .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
          .set('Content-Type','application/json')
          .set('Accept','application/json')
          .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce22', messageDetail: 'This is a test [:debug]', messageType: 'Debug' })
          .end(function(err, res){
            if (err) throw err;
            request(app).get('/type?app_id='+res.body.data.app_id+'&messageType=Error')
              .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
              .set('Content-Type','application/json')
              .set('Accept','application/json')
              .end(function(request,response){
                getRes = response.body
                done();
              })
        })
      })
  })

  it('has key [:count]',function(){ getRes.should.have.property('count') })
  it('has key [:data]',function(){ getRes.should.have.property('data') })
  it('has key [:status]',function(){ getRes.data[0].should.have.property('status') })
  it('should be Error',function(){ getRes.data[0].status.should.be.equal('Error') })
  it('should be an array',function(){ getRes.data.should.be.instanceof(Array) })
})

describe('[Request] messageType :debug', function(){
  var getReq, getRes
  before(function(done){
    redis.hmset( 'user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce22','user:info@hermes.io',function(err,res){})

    request(app).post('/')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce22', messageDetail: 'This is a test [:error]', messageType: 'Error' })
      .end(function(err, res){
        if (err) throw err;
        request(app).post('/')
          .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
          .set('Content-Type','application/json')
          .set('Accept','application/json')
          .send({ app_id: 'a6e1a32a-2f19-4751-990a-298f3b1f2ce22', messageDetail: 'This is a test [:debug]', messageType: 'Debug' })
          .end(function(err, res){
            if (err) throw err;
            request(app).get('/type?app_id='+res.body.data.app_id+'&messageType=Debug')
              .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
              .set('Content-Type','application/json')
              .set('Accept','application/json')
              .end(function(request,response){
                getRes = response.body
                done();
              })
        })
      })
  })

  it('has key [:count]',function(){ getRes.should.have.property('count') })
  it('has key [:data]',function(){ getRes.should.have.property('data') })
  it('has key [:status]',function(){ getRes.data[0].should.have.property('status') })
  it('should be Debug',function(){ getRes.data[0].status.should.be.equal('Debug') })
  it('should be an array',function(){ getRes.data.should.be.instanceof(Array) })
  it('event has different timestamp',function(){ getRes.data[0].timestamp.should.not.be.equal(getRes.data[1].timestamp)})
})
