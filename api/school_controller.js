const service = require('../services/school_services');

const searchSchool = async (req, res) => {

    try {
        const { schoolName } = req.params;
        const result = {
            schools: await service.searchSchoolName(schoolName)
        };
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Server Error!' });
    }
}

module.exports = {
    searchSchool
}