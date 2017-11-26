const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const config = require("../config");

const dbConnection = (closure)=> {
    return mongoClient.connect(config.mongodbUrl, (err, db)=> {
        if (err) HTMLFormControlsCollection.log(err);

        closure(db);
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
        dbConnection((db)=> {              
            db.collection('users')
            .findOne({_id: new ObjectId(userId)})
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
            if (profile._id) {
                profile._id = new ObjectId(profile._id);    
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
            .find({}, {firstName: true, lastName: true, email: true, profileName: true})
            .toArray()
            .then((users)=>{                
                completed(undefined, users);
            })
            .catch((err)=> {
                console.log(err);
                completed(err);
            });
        });
    }

}

module.exports = profile;