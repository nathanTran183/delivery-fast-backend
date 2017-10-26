/**
 * Created by nathan on 16/10/2017.
 */
const Employee = require('../../models/index').Employee;
const config = require('../../config/index');

module.exports = {

    signIn (req, res, next) {
        return res.render('user/signIn');
    },

    postSignIn(req, res, next) {
        // check validation
        req.assert('username', 'Username/Email is required').notEmpty();
        req.assert('password', 'A valid password (length between 6 to 48) is required').len(6, 48);  //Validate password
        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('/signIn');
            return;
        }

        Employee
            .findOne({
                where: {
                    $or: [{username: req.body.username}, {email: req.body.username}]
                }
            })
            .then(account => {
                if (account != null) {
                    if (account.status == false) {
                        req.flash('reason_fail', 'Your account has been deactivated!');
                        res.redirect('/signIn');
                        return;
                    }

                    account.comparePassword(req.body.password, (err, result) => {
                        if (err) return next({status: 500, body: err});
                        if (result == true) {
                            if (req.body.rememberme) {
                                req.session.cookie.maxAge = 2592000000;
                            } else {
                                req.session.cookie.expires = false;
                            }
                            let date = new Date(account.date_of_birth);
                            account.date_of_birth = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                            req.session.user = account;
                            res.redirect('/profile');
                        } else {
                            req.flash('reason_fail', 'Password is not correct!');
                            res.redirect('/signIn');
                            return;
                        }
                    })
                }
                else {
                    req.flash('reason_fail', 'Username or Email doesn\'t existed!');
                    res.redirect('/signIn');
                    return;
                }
            })
            .catch(err => {
                return res.json(Response.returnError(err.message, err.code));
            })
    },

    logout (req, res, next) {
        req.session.user = null;
        res.redirect('/signIn');
    },

    profile: function (req, res, next) {
        res.render('user/profile');
    },

    changePassword: function (req, res, next) {
        // get parameters
        var old_password = req.body.old_password;
        var new_password = req.body.new_password;
        var confirm_new_password = req.body.confirm_new_password;

        // check validation
        req.assert('old_password', 'A valid current password (length between 6 to 48) is required').len(6, 48);  //Validate old password
        req.assert('new_password', 'A valid new password (length between 6 to 48) is required').len(6, 48);  //Validate new password
        req.assert('confirm_new_password', 'A valid confirm new password (length between 6 to 48) is required').len(6, 48);  //Validate confirm new password
        var errors = req.validationErrors();
        if (confirm_new_password !== new_password) {
            if (errors.length > 0) {
                errors.push({'msg': 'Confirm new password is not match with new password'});
            } else {
                errors = [{'msg': 'Confirm new password is not match with new password'}];
            }
        }
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('/profile');
            return;
        }

        Employee
            .findOne({'username': req.session.user.username})
            .then(user => {
                if (!user) {
                    req.flash('reason_fail', 'Time out! Please login');
                    res.redirect('/login');
                    return;
                }
                user.comparePassword(old_password, (err, result) => {
                    if (err) return next({status: 500, body: err});
                    if (result == true) {
                        user.password = new_password;
                        user
                            .save()
                            .then(savedUser => {
                                req.flash('success', 'Password has been changed!');
                                res.redirect('/profile');
                            })
                            .catch(err => next({status: 500, body: err}))
                    } else {
                        req.flash('reason_fail', 'Password is not correct!');
                        res.redirect('/profile');
                        return;
                    }
                })
            })
            .catch(err => next({status: 500, body: err}))
    },

    // forgotPassword (req, res,next){
    //     res.render('user/forgotPassword');
    // },

    updateInfo: async function (req, res)  {
        // check validation
        req.assert('first_name', 'First name is required').notEmpty();
        req.assert('last_name', 'Last name is required').notEmpty();
        req.assert('phone_number', 'Phone number is required').len(6, 48);
        var errors = req.validationErrors();
        Employee
            .find({phone_number: req.body.phone_number})
            .then(employee => {
                if(employee){
                    if (errors.length > 0) {
                        errors.push({msg: "Phone number is matched!"})
                    } else {
                        errors = [{msg: "Phone number is matched!"}]
                    }
                    //
                }
            })
            .catch(err => {
                console.log(err);
                return res.json({status: 500, body: err})
            })
        let date = new Date(req.body.date_of_birth);
        if(date == "Invalid Date") {
            if (errors.length > 0) {
                errors.push({msg: "Invalid date format!"})
            } else {
                errors = [{msg: "Invalid date format!"}]
            }
        } else req.body.date_of_birth = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            return res.redirect('/profile');
        }

        try {
            const employee = await Employee.findById(req.session.user.id);
            if (employee) {
                const updatedUser = await Employee.update(req.body, {
                    where: {
                        id: employee.id
                    },
                    returning: true
                });
                if (updatedUser[1]) {
                    req.session.user = updatedUser[1][0].dataValues;
                    req.session.user.date_of_birth = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();;
                    // console.log(updatedUser[1][0].dataValues);
                    req.flash('success', 'User information has been updated!');
                    return res.redirect('/profile');
                } else {
                    req.flash('errors', 'No record is updated!');
                    return res.redirect('/profile');
                }

            } else {
                req.flash('errors', 'Employee is not found!');
                return res.redirect('/profile');
            }
        } catch (e) {
            console.log(e);
            return res.json(e);
        }
    },

    list(req, res) {
        Employee
            .all({
                where: {
                    role: {
                        $ne: 'Admin'
                    }
                }
            })
            .then(employees => {
                let data = {
                    employees: employees
                };
                return res.json(Response.returnSuccess("get list of employees successfully", data));
            })
            .catch(error => {
                res.json(Response.returnError(error.message, error.code))
            });
    },

    get(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    return res.json(Response.returnError('Employee Not Found', httpStatus.NOT_FOUND));
                }
                let data = {
                    employee: employee
                };
                return res.status(200).json(Response.returnSuccess("Retrieve employee successfully!", data));
            })
            .catch(error => res.json(Response.returnError(error.message, error.code)));
    },

    create(req, res) {
        Employee
            .create(req.body)
            .then(employee => {
                let data = {
                    employee: employee
                };
                return res.json(Response.returnSuccess("Create employee successfully!", data));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    update(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    return res.json(Response.returnError("Employee not found!", httpStatus.NOT_FOUND))
                } else {
                    employee
                        .update(req.body)
                        .then(employee => {
                            let data = {
                                employee: employee
                            };
                            return res.json(Response.returnSuccess("Update employee successfully!", data))
                        })
                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                }
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },
}