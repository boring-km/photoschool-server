const service = require('../services/school_services');

const searchSchool = async (req, res) => {
    const { schoolName } = req.params;
    const result = {
        schools: await service.searchSchoolName(schoolName)
    };
    res.json(result);
}

module.exports = {
    searchSchool
}