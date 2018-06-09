const assert = require('chai').assert;
//const app = require('../index')
let request = require('supertest');
const express = require('express')
//require('http').request()
request = request('http://localhost:5000')
describe('Index', function() {
    const app = require('../index')
    it('should return html', function(done) {
      
      request.get('/')
      .expect('Content-Type', 'text/html; charset=utf-8', done);


    });

});
