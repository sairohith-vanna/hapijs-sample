const { v4: uuidv4 } = require('uuid');

async function getAllRecruiters(request, h) {
    const registeredRecruiters = await request.mongo.db.collection('Recruiter').find({}).toArray();
    const response = h.response({
        'correlationId': uuidv4(),
        'recruiters': registeredRecruiters
    });
    return response;
}

async function getARecruiter(request, h) {
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

async function registerRecruiter(request, h) {
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

module.exports = { getAllRecruiters, getARecruiter, registerRecruiter };
