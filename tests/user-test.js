const assert = require('chai').assert;

var request = require('supertest');
const express = require('express');

request = request('http://localhost:5000')
describe('Index', function() {
    const app = require('../index');
    it('should return html', function(done) {
      
      request.get('/')
      .expect('Content-Type', 'text/html; charset=utf-8', done);
      done();
    });
    
});
