'use strict';

const hapi = require('@hapi/hapi');
const { v4: uuidv4 } = require('uuid');

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

    appServer.route({
        path: '/api/recruiters',
        method: 'GET',
        handler: async (request, h) => {
            const registeredRecruiters = await request.mongo.db.collection('Recruiter').find({}).toArray();
            const response = h.response({
                'correlationId': uuidv4(),
                'recruiters': registeredRecruiters
            });
            return response;
        }
    });

    appServer.route({
        path: '/api/recruiter/{recruiterId}',
        method: 'GET',
        handler: async (request, h) => {
            const registeredRecruiters = await request.mongo.db.collection('Recruiter').findOne({ recruiterId: request.params['recruiterId'] }, {
                projection: {
                    recruiterId: 1,
                    recruiter: 1,
                    _id: 0
                }
            });
            const response = h.response({
                'correlationId': uuidv4(),
                'recruiters': registeredRecruiters
            });
            return response;
        }
    });

    appServer.route({
        path: '/api/recruiters/register',
        method: 'POST',
        handler: async (request, h) => {
            const newRecruiter = {
                recruiterId: uuidv4(),
                recruiter: request.payload
            }
            await request.mongo.db.collection('Recruiter').insertOne(newRecruiter);
            const registeredRecruiters = await request.mongo.db.collection('Recruiter').findOne({ recruiterId: newRecruiter.recruiterId });
            return h.response({
                'correlationId': uuidv4(),
                'recruiters': registeredRecruiters
            });
        }
    });

    appServer.route({
        path: '/api/config',
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
