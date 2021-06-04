'use strict';

const hapi = require('@hapi/hapi');
const { v4: uuidv4 } = require('uuid');
const RecruiterService = require('./services/recruiter-service');
const Schmervice = require('@hapipal/schmervice');

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

    await appServer.register(Schmervice);

    appServer.registerService(RecruiterService);

    appServer.route([
        {
            method: 'GET', path: '/api/recruiter/{recruiterId}', handler: async (request, h) => {
                const { recruiterService } = request.services();
                const recruitersObj = await recruiterService.getARecruiter(request, h);
                return h.response(recruitersObj);
            }
        },
        {
            method: 'POST', path: '/api/recruiters/register', handler: async (request, h) => {
                const { recruiterService } = request.services();
                const newRecruiter = await recruiterService.registerRecruiter(request, h);
                return h.response(newRecruiter);
            }
        },
        {
            method: 'GET', path: '/api/v2/recruiters', handler: async (request, h) => {
                const { recruiterService } = request.services();
                const recruitersObj = await recruiterService.getAllRecruitersV2(request, h);
                return h.response(recruitersObj);
            }
        }
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
            configResponse.header('X-CORRELATION-ID', uuidv4());
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
