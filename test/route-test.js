/* eslint-env mocha */
const supertest = require('supertest');
const should = require('should');

// This agent refers to PORT where program is runninng.

const server = supertest.agent('http://localhost:8080');

describe('Routes test', () => {
  it('should return home page', (done) => {
    server
    .get('/')
    .expect('Content-type', /json/)
    .expect(200)
    .end((err, res) => {
      res.status.should.equal(200);
      done();
    });
  });

  it('should return product list', (done) => {
    server
    .get('/products')
    .expect('Content-type', /json/)
    .expect(200)
    .end((err, res) => {
      res.status.should.equal(200);
      done();
    });
  });

  it('should return 404', (done) => {
    server
    .get('/random404')
    .expect(404)
    .end((err, res) => {
      res.status.should.equal(404);
      done();
    });
  });


});
