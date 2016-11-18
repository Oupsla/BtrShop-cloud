# BtrShop-cloud [![Build Status](https://travis-ci.org/Oupsla/BtrShop-cloud.svg?branch=master)](https://travis-ci.org/Oupsla/BtrShop-cloud) [![Coverage Status](https://coveralls.io/repos/github/Oupsla/BtrShop-cloud/badge.svg)](https://coveralls.io/github/Oupsla/BtrShop-cloud)


API for the project `Recommendation in situ de produits en magasins` submitted by Université Lille 1 in collaboration with the Inria and the team Spirals.

## Authors
- Nicolas Delperdange
- Denis Hamann
- Charlie Quetstroey


## Install

You only need [Docker](https://docs.docker.com/engine/installation/) and [docker-compose](https://docs.docker.com/compose/install/)

- Run: `docker-compose up` to run the app. _You might need `sudo` for this one_.

## Architecture

The project is divided according to Yeoman generator https://github.com/ndelvalle/generator-api and the idea is to be able to scale having a simple architecture.

```
├───index.js
├───routes.js
├───package.json
├───config.js
└───lib/
|   ├───controller.js
|   ├───facade.js
└───model/
    ├───product/
    │   └───product-controller.js
    |   └───product-facade.js
    |   └───product-router.js
    |   └───product-schema.js
```

### Controller:
HTTP layer, in this instance you can manage express request, response and next. In `lib/controller` are the basic RESTful methods `find`, `findOne`, `findById`, `create`, `update` and `remove`. Because this class is extending from there, you got that solved. You can overwrite extended methods or create custom ones here.

### Facade:
This layer works as a simplified interface of mongoose and as Business Model layer, in this instance you can manage your business logic. For example, if you want to create a pet before creating a user, because you'll end up adding that pet to the person, this is the place.

In `lib/facade` you have the basic support for RESTful methods. Because this class is extending from there, you got that solved. You can overwrite extended methods or create custom ones here. Also you can support more mongoose functionality like `skip`, `sort` etc.

### Model:
The folder `Model` contains the various business objects. This is what defines the schema of business objects, roads and overload controller and facade.


## Tests

Tests are written thanks to the framework Mocha and are executable with the command `npm test` after launching the server with Docker.

It is possible that you have to launch the following command to install test dependencies :
- `npm install -g standard`
- `npm install -g mocha`
- `docker-compose build`
- `docker-compose up -d`
- `npm test`
