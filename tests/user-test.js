const assert = require('chai').assert;

var request = require('supertest');
const express = require('express');


request = request('http://localhost:5000/')
describe('Login page', function() {
    const app = require('../index');
    it('should return html', function(done) {
      
      request.get('/login')
      .expect('Content-Type', 'text/plain; charset=utf-8', done);
      
    });


    // it('should respond with redirect on post', function(done) {
    //   request.post('/login')
    //     .send({"participant":{"nuid":"98ASDF988SDF89SDF89989SDF9898"}})
    //     .expect(200)
    //     .expect('Content-Type', /json/)
    //     .end(function(err, res) {
    //       if (err) done(err);
    //       res.body.should.have.property('participant');
    //       res.body.participant.should.have.property('nuid', '98ASDF988SDF89SDF89989SDF9898');
  
    //        });
    //       });
});
