const express = require("express");
const router = express.Router();
const profileService = require("../profile");

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};



/* GET api listing. */
router.get('/user/:userId', (req, res)=> {    
    profileService.getProfile(req.params.userId, (err, user)=> {
        if (err) {
            sendError(err)
        } else {
            response.data = user;
            res.json(response);
        }
    });
    
});

router.post('/user', (req, res)=> {    
    profileService.addOrUpdateProfile(req.body, (err, user)=> {
        if (err) {
            sendError(err);
        } else {
            response.data = user;
            res.json(response);
        }
    });    
});

router.get('/users', (req, res)=> {    
    profileService.getUsers((err, users)=> {
        if (err) {
            sendError(err)
        } else {
            response.data = users;
            res.json(response);
        }
    });
    
});

module.exports = router;