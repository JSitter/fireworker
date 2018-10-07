const assert = require('chai').assert;

var request = require('supertest');
const express = require('express');

request = request('http://localhost:5000')
describe('Login page', function() {
    const app = require('../index');
    it('should return html', function(done) {
      
      request.get('/login')
      .expect('Content-Type', 'text/plain; charset=utf-8', done);
    });

    it('should return 401 when not logged in', function(done){
      request.get('/u')
      .expect(401, done)
    })
});
