const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const config = require("../config");
const fs = require("fs");

const dbConnection = (closure)=> {
    return mongoClient.connect(config.mongodbUrl, (err, db)=> {
        if (err) HTMLFormControlsCollection.log(err);

        closure(db);
    });
};

const createBackUp = (backupPath, users, completed)=> {
    const fileName = (new Date()).valueOf() + ".json";
    const fullPath = backupPath + "/" + fileName;
    fs.writeFile(fullPath, JSON.stringify(users, null, "\t"), function (err) {
        if (err) {
            completed(err);
        } else {
            completed(undefined, users);
        }
    });
};

const updateProfile = (db, profile, completed)=> {        
    db.collection('users')
    .updateOne({
        _id: profile._id
    }, {
        $set: profile
    })
    .then((user)=> {
        console.log("SUCCESS");
        completed(undefined, user);
    }, (rej)=> {
        console.log("REJECTION",rej);
        completed(rej);
    })
    .catch((err)=> {
        console.log("CATCH", err)
        completed(err);
    });
}

const insertProfile = (db, profile, completed)=> {
    delete profile._id;
    db.collection('users')
    .insertOne(profile)
    .then((user)=> {
        completed(undefined, user);
    })
    .catch((err)=> {
        completed(err);
    });
}

const profile = {
    "getProfile": (userId, completed)=> {
        let userObjectId = "";
        if(!ObjectId.isValid(userId)) {
            userObjectId = new ObjectId();
        } else {
            userObjectId = new ObjectId(userId);
        }
        dbConnection((db)=> {              
            db.collection('users')
            .findOne({_id: userObjectId})
            .then((user)=>{                
                completed(undefined, user);
            })
            .catch((err)=> {
                console.log(err);
                completed(err);
            });
        });
    },

    "addOrUpdateProfile": (profile, completed)=> {
        dbConnection((db)=> {
            console.log("OUT" + profile._id);
            if (profile._id && profile._id != '0') {
                console.log("OIN 1 -" + profile._id);
                profile._id = new ObjectId(profile._id);    
                console.log("O IN 2 - " + profile._id);
            } 
            
            db.collection('users')
            .findOne({_id: profile._id})
            .then((user)=>{
                if (user == null) {
                    console.log("INSERT");
                    insertProfile(db, profile, completed);
                } else {
                    console.log("UPDATE");
                    updateProfile(db, profile, completed);
                }                                 
            })
            .catch((err)=> {
                console.log(err);
                completed(err);
            });
        });
    },

    "getUsers": (completed)=> {
        dbConnection((db)=> {              
            db.collection('users')
            .find({}, {_id: true, basicInfo: true})
            .toArray()
            .then((users)=>{                
                completed(undefined, users);
            })
            .catch((err)=> {
                console.log(err);
                completed(err);
            });
        });
    },
    "backup": (backupPath, completed)=> {
        dbConnection((db)=> {              
            db.collection('users')
            .find({})
            .toArray()
            .then((users)=>{
                createBackUp(backupPath, users, completed); 
            })
            .catch((err)=> {
                console.log(err);
                completed(err);
            });
        });
    }
}

module.exports = profile;