const express    = require('express');
const mongoose   = require('mongoose');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const bluebird   = require('bluebird');
const expressValidator = require('express-validator');
const barcoder   = require('barcoder');

const config = require('./config');
const routes = require('./routes');
const app  = express();

mongoose.Promise = bluebird;
mongoose.connect(config.mongo.url);

// Validator options
const options = expressValidator({
  customValidators: {
    isEan(value) {
      return barcoder.validate(value);
    }
  }
});
// END : Validator options

app.use(helmet()); // secure Express/Connect apps with various HTTP headers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator(options)); // validator middleware
app.use(morgan('tiny')); // HTTP request logger middleware
app.use('/', routes);

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
});

module.exports = app;

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
swaggerDocument.host = config.swaggerurl;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
