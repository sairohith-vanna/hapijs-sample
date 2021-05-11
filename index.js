'use strict';

const hapi = require('@hapi/hapi');
const { v4: uuidv4 } = require('uuid');

const appInit = async () => {

    const appServer = hapi.server({
        host: 'localhost',
        port: 3690
    });

    appServer.route({
        path: '/api/config',
        method: 'GET',
        handler: (request, h) => {
            const configResponse = h.response({
                'metadata': {
                    appServer: 'Hapi',
                    appInitAll: true,
                    appHost: appServer.info.uri
                },
                'serverStatus': {
                    'running': true,
                    'secure': false,
                    'serverId': uuidv4()
                }
            });
            configResponse.header('X-CORRELATION-ID', uuidv4())
            return configResponse;
        }
    });

    await appServer.start();
    console.log('The Hapi server has booted');
    console.log('Listening at %s', appServer.info.uri);
};

process.on('unhandledRejection', (error) => {

    console.log(error);
    process.exit(1);
});

appInit();
