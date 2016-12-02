const Path = require('path'),
      Hapi = require('hapi'),
      Good = require('good'),
      fs = require('fs'),
      pug = require('pug');

const server = new Hapi.Server({
    connections: {
        routes: { files: {
            relativeTo: Path.join(__dirname, 'public')
        }}
    }
});

server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.register(require('inert'), (err) => {
    if (err) throw err;

    server.route({
        method: 'GET',
        path: '/',
        handler: function (req, res) {
            res.end();
        }
    });
});

server.register({
    register: Good,
    options: { reporters: {
        console: [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, 
            { module: 'good-console' },
            'stdout'
        ]
    }}
}, (err) => {
    if (err) throw err; // something bad happened loading the plugin
    
    server.start((err) => {
        if (err) throw err;
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});