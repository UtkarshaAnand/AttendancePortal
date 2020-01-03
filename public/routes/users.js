const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const path = require('path');

const User = require('../../server/db/models/User');
const Attendance = require('../../server/db/models/Attendance');
const keys = require('../../server/db/config'); 
const validateRegisterInput = require('../../server/validation/register');
const validateLoginInput = require('../../server/validation/login');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'Index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'Login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'Signup.html')); 
});

router.post('/signup', (req, res) => {
    
    const {errors, isValid} = validateRegisterInput(req.body);
    
    // check validation for registration input
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({Userid: req.body.Userid})
        .then(user => {
            if(user && user.userType === req.body.userType){
                return res.status(400).json({Userid: 'id already exists for selected user type'});
            }
            else{
                const newUser = new User({
                    name: req.body.name,
                    Userid: req.body.Userid,
                    password: req.body.password,
                    userType: req.body.userType
                });
                //console.log(newUser);

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            //.then(user => res.json("Registration Succesfull! Please, login to continue"))
                            .then(user => res.redirect('/login'))
                            .catch(err);
                    });
                });
            }
        });
});

router.post('/login', (req, res) => {
    
    const {errors, isValid} = validateLoginInput(req.body);
    
    // check validation for registration input
    if(!isValid){
        return res.status(400).json(errors);
    }

    const Userid = req.body.Userid;
    const password = req.body.password;
    const userType = req.body.userType;

    User.findOne({$and: [{Userid}, {userType}]})
        .then(user => {
            if(!user){
                errors.Userid = "User not found"
                return res.status(404).json(errors);
            }
            const name = user.name;
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // user matched/ token 
                        const payload = {id: user.id, name: user.name};
                        jwt.sign(payload, 
                            keys.secretOrKey, 
                            {expiresIn: 3600}, 
                            (err, token) => {
                                res.cookie('jwt', token, {
                                    expires: new Date(Date.now() + 3600*1000),
                                    secure: false,
                                    httpOnly: true
                                });
                                /*res.json({
                                    message: "Succesful Login",
                                    Userid: user.Userid,
                                    name: user.name,
                                });*/
                                if(userType == "Teacher")
                                    res.redirect('/teacherProfile');
                                else    
                                    res.redirect('/studentProfile');
                            });
                    }
                    else{
                        errors.password = "Password incorrect";
                        return res.status(400).json(errors);
                    }
                });
        });
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});

router.get('/teacherProfile', passport.authenticate('jwt', {session: false}), (req, res) => {
    //id= req.user.id;
    const name =  req.user.name;
    const Userid = req.user.Userid;
    const userType = req.user.userType;
    
    if(userType === 'Student')
        return res.status(401).json("Unauthorised");
    User.find({userType: 'Student'})
    .then(users => {
        if(!users){
            return res.status(401).json({User: 'No student'});
        }

        res.status(200).render('teacherProfile', {
            name,
            users
        });
    });
});

router.post('/teacherProfile', (req, res) => {
    User.find({userType: 'Student'})
    .then(users => {
        if(!users){
            return res.status(401).json({User: 'No student'});
        }

        var students = [];
        var i = 0;
        for(student of users){
            const newAttendance = new Attendance({
                name: student.name,
                Userid: student.Userid,
                status: req.body.status[i]
            })
            i += 1;
            students.push(newAttendance);
            newAttendance.save()
                /*.then(attendance)

                .catch(err);*/
        }
        res.status(200).json("Record submitted successfully!");
    });
});

router.get('/studentProfile', passport.authenticate('jwt', {session: false}), (req, res) => {
    //id= req.user.id;
    const name =  req.user.name;
    const Userid = req.user.Userid;
    const userType = req.user.userType;

    if(userType === "Teacher")
        return res.status(401).json("Unauthorised");
    Attendance.find({name: name}, 'date status')
        .then(records => {
            if(!records)
                return res.json("No record");
            res.status(200).render('studentProfile', {
                name,
                records
            });
        });
});

module.exports = router;