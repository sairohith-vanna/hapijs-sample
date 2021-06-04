'use strict';

const Schmervice = require('@hapipal/schmervice');
const { v4: uuidv4 } = require('uuid');

class RecruiterService extends Schmervice.Service {

    async getAllRecruitersV2(request) {
        const registeredRecruiters = await request.mongo.db.collection('Recruiter').find({}).toArray();
        console.log(registeredRecruiters);
        return {
            'correlationId': uuidv4(),
            'recruiters': registeredRecruiters
        };
    }

    async getARecruiter(request) {
        const registeredRecruiters = await request.mongo.db.collection('Recruiter').findOne({ recruiterId: request.params['recruiterId'] }, {
            projection: {
                recruiterId: 1,
                recruiter: 1,
                _id: 0
            }
        });
        const recruiterInfo = {
            'correlationId': uuidv4(),
            'recruiter': registeredRecruiters
        };
        return recruiterInfo;
    }

    async registerRecruiter(request) {
        const newRecruiter = {
            recruiterId: uuidv4(),
            recruiter: request.payload
        }
        await request.mongo.db.collection('Recruiter').insertOne(newRecruiter);
        const registeredRecruiters = await request.mongo.db.collection('Recruiter').findOne({ recruiterId: newRecruiter.recruiterId });
        return {
            'correlationId': uuidv4(),
            'registeredRecruiter': registeredRecruiters
        };
    }
}

module.exports = RecruiterService;