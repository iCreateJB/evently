var app = require('../app.js')

user = {
  email: 'info@hermes.io',
  credentials: {
    api_key: '2a246359-6b80-47eb-85fe-124c5c4bca40'
  }
}

describe('[AdminService] createUser',function(){
var response
before(function(done){
  redis.hmset('user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
  redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
  redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce2','user:info@hermes.io',function(err,res){})
  request(app).post('/admin/user')
    .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
    .set('Content-Type','application/json')
    .set('Accept','application/json')
    .send({
      user: {
        email: 'info@niqnam.es',
        first_name: 'Test',
        last_name: 'User'
      }
    })
    .end(function(req, res){
      response = res;
      done();
    });
})

  it('has key [:user_id]',function(){ response.body.should.have.property('user_id') })
  it('has key [:first_name]',function(){ response.body.should.have.property('first_name') })
  it('has key [:last_name]', function(){ response.body.should.have.property('last_name') })
  it('has key [:email]',function(){ response.body.should.have.property('email') })
  it('has key [:status]',function(){ response.body.should.have.property('status') })
  it('has key [:api_key]',function(){ response.body.should.have.property('api_key') })

  it('[:email]',function(){ response.body.email.should.equal('info@niqnam.es') })
  it('[:first_name]',function(){ response.body.first_name.should.equal('Test') })
  it('[:last_name]',function(){ response.body.last_name.should.equal('User') })

  it('[201]',function(){ response.status.should.equal(201) })
});

describe('[AdminService] createUser invalid', function(){
  var response
  before(function(done){
    redis.hmset('user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce2','user:info@hermes.io',function(err,res){})
    request(app).post('/admin/user')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({
        user: {
          email: 'info@hermes.io',
          first_name: 'Test',
          last_name: 'User'
        }
      })
      .end(function(req, res){
        response = res;
        done();
      });
  })

  it('[400]', function(){ response.status.should.equal(400) })

  it('[:status]',function(){ response.body.status.should.equal('Error') })
  it('[:detail]',function(){ response.body.detail.should.equal('User Invalid') })
})

describe('[AdminService] getUser', function(){
  var response, getResponse
  before(function(done){
    redis.hmset('user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce2','user:info@hermes.io',function(err,res){})
    request(app).post('/admin/user')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({
        user: {
          email: 'support@niqnam.es',
          first_name: 'Test',
          last_name: 'User'
        }
      })
      .end(function(req, res){
        response = res;
        request(app).get('/admin/user/'+response.body.email+'?app_id=a6e1a32a-2f19-4751-990a-298f3b1f2ce2')
          .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
          .set('Content-Type','application/json')
          .set('Accept','application/json')
          .end(function(req_2,res_2){
            getResponse = res_2
            done();
          })
      });
  })

  it('[200]',function(){ getResponse.status.should.equal(200) })

  it('[:user_id]',function(){ getResponse.body.should.have.property('user_id') })
  it('[:email]',function(){ getResponse.body.should.have.property('email') })
  it('[:first_name]',function(){ getResponse.body.should.have.property('first_name') })
  it('[:last_name]',function(){ getResponse.body.should.have.property('last_name') })
  it('[:status]',function(){ getResponse.body.should.have.property('status') })
  it('[:api_key]',function(){ getResponse.body.should.have.property('api_key') })
  it('[:apps]',function(){ getResponse.body.should.have.property('apps') })

  it('[:user_id]',function(){ getResponse.body.user_id.should.equal('support@niqnam.es') })
  it('[:first_name]',function(){ getResponse.body.first_name.should.equal('Test') })
  it('[:last_name]',function(){ getResponse.body.last_name.should.equal('User') })
})

describe('[AdminService] getUser invalid', function(){
  var response, getResponse
  before(function(done){
    redis.hmset('user:info@hermes.io', 'data', JSON.stringify(user), function(err,res){})
    redis.sadd('api_key:2a246359-6b80-47eb-85fe-124c5c4bca40','user:info@hermes.io',function(err,res){})
    redis.sadd('app_id:a6e1a32a-2f19-4751-990a-298f3b1f2ce2','user:info@hermes.io',function(err,res){})
    request(app).post('/admin/user')
      .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
      .set('Content-Type','application/json')
      .set('Accept','application/json')
      .send({
        user: {
          email: 'engineering@niqnam.es',
          first_name: 'Test',
          last_name: 'User'
        }
      })
      .end(function(req, res){
        response = res;
        request(app).get('/admin/user/'+'test@niqnam.es'+'?app_id=a6e1a32a-2f19-4751-990a-298f3b1f2ce2')
          .set('Authorization', '2a246359-6b80-47eb-85fe-124c5c4bca40')
          .set('Content-Type','application/json')
          .set('Accept','application/json')
          .end(function(req_2,res_2){
            getResponse = res_2
            done();
          })
      });
  })

  it('[400]',function(){ getResponse.status.should.equal(400) })

  it('[:status]',function(){ getResponse.body.status.should.equal('Error') })
  it('[:detail]',function(){ getResponse.body.detail.should.equal('User Invalid')})
})
