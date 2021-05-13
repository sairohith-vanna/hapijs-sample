'use strict';

const hapi = require('@hapi/hapi');
const { v4: uuidv4 } = require('uuid');
const { getAllRecruiters, getARecruiter, registerRecruiter } = require('./recruiter-service');

const appInit = async () => {

    const appServer = hapi.server({
        host: 'localhost',
        port: 3690
    });

    await appServer.register({
        plugin: require('hapi-mongodb'),
        options: {
            url: 'mongodb+srv://rechub_db:Developer2718@cluster0.vahf9.mongodb.net/recruiterhub?retryWrites=true&w=majority',
            settings: {
                useUnifiedTopology: true
            },
            decorate: true
        }
    });

    appServer.route([
        { method: 'GET', path: '/api/recruiters', handler: getAllRecruiters },
        { method: 'GET', path: '/api/recruiter/{recruiterId}', handler: getAllRecruiters },
        { method: 'POST', path: '/api/recruiters/register', handler: getAllRecruiters }
    ]);

    appServer.route({
        path: '/server/config',
        method: 'GET',
        handler: (_request, h) => {
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
