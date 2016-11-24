/* eslint-env mocha */
const supertest = require('supertest');
const should = require('should');

// This agent refers to PORT where program is runninng.
const app = require("../index.js");
const server = supertest.agent(app);

describe('Routes test', () => {
  it('should return home page', (done) => {
    server
    .get('/')
    .expect('Content-type', /json/)
    .expect(200)
    .end((err, res) => {
      done();
    });
  });

  it('should return product list', (done) => {
    server
    .get('/products')
    .expect('Content-type', /json/)
    .expect(200)
    .end((err, res) => {
      done();
    });
  });

  it('should return 404', (done) => {
    server
    .get('/random404')
    .expect(404)
    .end((err, res) => {
      done();
    });
  });


});
