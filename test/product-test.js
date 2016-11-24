/* eslint-env mocha */
const supertest = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const config = require('../config');

/* For local test for coverage, start with : sudo docker-compose -f docker-compose.test.yml -p ci up */
const app = require("../index.js");
const server = supertest.agent(app);

// Sample produts
const parsedJSON = require('../mongo-seed/product.json');

describe('Products', () => {

  // Clean up db
  beforeEach((done) => {
    mongoose.connection.dropDatabase(error => {
      mongoose.connection.collection('products').insertMany(parsedJSON, (err, r) => {
        done();
      });
    });
  });

  describe('Find', function (){
    it('should return list of product', function(done) {
      server
      .get('/products')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.body.length.should.be.eql(3);
        done();
      });
    });

    it('should return 400 cause of bad param', (done) => {
      server
      .get('/products?test=0885909462872')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return 400 cause of empty param', (done) => {
      server
      .get('/products?test=')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of string ean', (done) => {
      server
      .get('/products?ean=dfdfdffd')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too short ean', (done) => {
      server
      .get('/products?ean=123')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too long ean', (done) => {
      server
      .get('/products?ean=123456789123456789')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });


    it('should return a array with one single product', (done) => {
      server
      .get('/products?ean=0885909462872')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.body.length.should.be.eql(1);
        done();
      });
    });

    it('should return an 404 because product dont exist', (done) => {
      server
      .get('/products?ean=3072665220052')
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        done();
      });
    });

    it('should return a single product', (done) => {
      server
      .get('/products/0885909462872')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.body.ean.should.equal('0885909462872');
        done();
      });
    });

    it('should return an 404 because product dont exist', (done) => {
      server
      .get('/products/3072665220052')
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of string ean', (done) => {
      server
      .get('/products/azeqds')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of bad ean', (done) => {
      server
      .get('/products/132456')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

  });

  describe('Add', () => {

    it('should add a single product', (done) => {
      server
      .post('/products')
      .send({
        brand: 'Coca Cola',
        category: '/Alimentaire/Boissons/Sodas',
        color: 'Jaune',
        description: 'Boisson citronné avec des extraits de plantes. Rafraîchissant et vivifiant',
        ean: '5449033017888',
        height: {
          value: 0.4,
          unitcode: 'MTR',
          unitText: 'm'
        },
        logo: 'http://cdn.pymesenlared.es/img/136/1727/45696/0x1200/fanta-limon-1l.jpg',
        offers: [
          {
            price: 1.29,
            priceCurrency: '€',
            validFrom: '2016-10-02T17:32:16.777Z',
            validThrough: '2016-12-02T17:32:16.777Z'
          }
        ],
        model: '1l',
        name: 'Fanta Limon 1l',
        weight: {
          value: 1.1,
          unitcode: 'KGM',
          unitText: 'kg'
        }
      })
      .expect('Content-type', /json/)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        res.status.should.equal(201);
        server
        .get('/products')
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.length.should.be.eql(4);
          done();
        });
      });
    });
  });


  describe('Remove', () => {
    it('should remove a single product', (done) => {
      server
      .delete('/products')
      .query({ ean: '5449000017888' })
      .set('Accept', 'application/json')
      .expect(204)
      .end((err, res) => {
        server
        .get('/products')
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.length.should.be.eql(2);
          done();
        });
      });
    });

    it('should return a 400 because product dont exist', (done) => {
      server
      .delete('/products')
      .query({ ean: '3072665220052' })
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of string ean', (done) => {
      server
      .delete('/products')
      .query({ ean: 'dsfsdfd' })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too short ean', (done) => {
      server
      .delete('/products')
      .query({ ean: '123' })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too long ean', (done) => {
      server
      .delete('/products')
      .query({ ean: '123456798132456798' })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of not ean', (done) => {
      server
      .delete('/products')
      .query({})
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });


  });

});
