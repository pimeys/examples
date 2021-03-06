const util = require('util');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { hello } = require('../native/index.node');

function fromCallback(cb) {
  return util.promisify(cb)();
}

module.exports = function Server({ port = 3000 } = {}) {
  const app = express();
  const server = http.createServer(app);

  app.use(bodyParser.raw({ type: 'application/json' }));

  app.get('/', (req, res) =>
    res.json({
      routes: {
        method: 'POST',
        path: '/hello',
        request: {
          name: 'String'
        },
        response: {
          greeting: 'String'
        }
      }
    })
  );

  app.post('/hello', ({ body }, res) => res.type('json').send(hello({ body })));

  return {
    listen() {
      return fromCallback(cb => server.listen(port, cb));
    },
    close() {
      return fromCallback(cb => server.close(port, cb));
    },
    get port() {
      return port;
    }
  };
};
