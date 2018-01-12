const express = require("express");
const router = express.Router();
const profileService = require("../profile");
const path = require('path');
const fs = require('fs');

const ALLOWED_UPLOAD_TYPES = ['.png', '.gif', '.jpg', '.jpeg'];

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
    const userId = req.params.userId;
    profileService.getProfile(userId, (err, user)=> {
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


router.get('/profileimage/:userId', (req, res)=> {       
    res.sendFile(path.resolve(path.join(__dirname,'../user-images/'+ req.params.userId + '.jpg')));    
});

router.post('/backup', (req, res)=> { 
    const backupPath = path.resolve(path.join(__dirname,'../backup/'));

    profileService.backup(backupPath, (err, users)=> {
        if (err) {
            sendError(err);
        } else {
            response.data = users;
            res.json(response);
        }
    });    
});


router.post('/uploadprofileimage/:profileId', (req, res) => { 
    if (!req.files) {
        response.status = 400;
        response.message = "No Files to upload.";        
        res.status(400).json(response);
        return;
    }

    let profileImageFile = req.files.uploadFile;
    const profileId = req.params.profileId;
    const extName = '.jpg'; // hardcoding jpg as extension orpath.extname(profileImageFile.name).toLowerCase();
    const targetPath = path.resolve(path.resolve(path.join(__dirname,'../user-images/'+ profileId + extName)));

    // The name of the input field (i.e. "profileImageFile") is used to retrieve the uploaded file
        

    // Use the mv() method to place the file somewhere on your server
    profileImageFile.mv(targetPath, function(err) {
        if (err)
            sendError(err, res);
                
        response.message = 'File Successfuly uploaded.';        
        res.json(response);        
    });
});

module.exports = router;