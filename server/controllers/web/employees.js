/**
 * Created by nathan on 16/10/2017.
 */
const Employee = require('../../models/index').Employee;
const validate = require('../../helpers/validate');
const Response = require('../../helpers/response');
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
                return res.json(err);
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
        req.assert('phone_number', 'Phone number is required').len(6, 48).isNumeric();
        var errors = req.validationErrors();
        Employee
            .find({phone_number: req.body.phone_number}, { id: {$ne: req.session.user.id}})
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
                return res.render('employees/index', {employees: employees});
            })
            .catch(error => {
                res.json(error)
            });
    },

    getDeliMansJSON(req, res) {
        Employee
            .all({
                where: {
                    role: 'DeliMan',
                    status: 'Active'
                }
            })
            .then(deliMans => {
                return res.json(Response.returnSuccess("Get Active DeliMans list successfully!", {deliMans: deliMans}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    get(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    req.flash('reason_fail', 'Employee not found!');
                    res.redirect('back');
                }
                let date = new Date(employee.date_of_birth);
                employee.date_of_birth = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                return res.render('employees/detail', {employee: employee});
            })
            .catch(error => res.json(error));
    },

    create(req, res) {
        req.assert('first_name', 'First name is required!').notEmpty();
        req.assert('username', 'Username is required!').notEmpty();
        req.assert('last_name', 'Last name is required').notEmpty();
        req.assert('email', 'Must be email format').isEmail();
        req.assert('email', 'Email is required').notEmpty();
        req.assert('phone_number', 'Phone number (length between 10 to 15) is required').len(10, 15);
        req.assert('date_of_birth', 'Date of birth is required').notEmpty();


        var errors = req.validationErrors();
        // if(validate.isLetter(req.body.first_name) == false){
        //     errors = validate.addErrorAssert('First name must be characters only', errors);
        // }
        // if(validate.isLetter(req.body.last_name) == false){
        //
        //     errors = validate.addErrorAssert('Last name must be characters only', errors);
        // }
        if(validate.isLetterNumber(req.body.username) == false){
            errors = validate.addErrorAssert('Username contains characters and numbers only', errors);
        }
        if(validate.isPhoneNumber(req.body.phone_number) == false){
            errors = validate.addErrorAssert("Phone number must be phone format!", errors);
        }
        if(validate.isDate(req.body.date_of_birth) == false){
            errors = validate.addErrorAssert("Date of birth must be date format!", errors);
        } else {
            let date = new Date(req.body.date_of_birth);
            req.body.date_of_birth = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }

        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('/employees');
            return;
        }

        let employee = Employee.build(req.body);
        employee.password = "12345678";
        employee.status = "Active";
        employee
            .save()
            .then(() => {
                req.flash('success', 'Create new employee successfully!');
                res.redirect('back');
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    update(req, res) {
        req.assert('first_name', 'First name is required!').notEmpty();
        req.assert('last_name', 'Last name is required').notEmpty();
        req.assert('username', 'Username is required!').notEmpty();
        req.assert('email', 'Email is required').notEmpty();
        req.assert('date_of_birth', 'Date of birth is required').notEmpty();
        req.assert('email', 'Must be email format').isEmail();
        req.assert('phone_number', 'Phone number (length between 10 to 15) is required').len(10, 15);

        var errors = req.validationErrors();
        // if(validate.isLetter(req.body.first_name) == false){
        //     errors = validate.addErrorAssert('First name must be characters only', errors);
        // }
        // if(validate.isLetter(req.body.last_name) == false){
        //     errors = validate.addErrorAssert('Last name must be characters only', errors);
        // }
        if(validate.isLetterNumber(req.body.username) == false){
            errors = validate.addErrorAssert('Username contains characters and numbers only', errors);
        }
        if(validate.isPhoneNumber(req.body.phone_number) == false){
            errors = validate.addErrorAssert("Phone number must be phone format!", errors);
        }
        if(validate.isDate(req.body.date_of_birth) == false){
            errors = validate.addErrorAssert("Date of birth must be date format!", errors);
        } else {
            let date = new Date(req.body.date_of_birth);
            req.body.date_of_birth = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }

        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    req.flash('reason_fail', 'Employee not found!');
                    res.redirect('back');
                } else {
                    employee
                        .update(req.body)
                        .then(employee => {
                            req.flash('success', 'Update employee successfully!')
                            res.redirect('/employees');
                        })
                        .catch(err => {
                            console.log(err);
                            req.flash('errors', {msg: err.message});
                            res.redirect('back');
                        })
                }
            })
            .catch(err => {
                req.flash('reason_fail', err.message);
                res.redirect('back');
            })
    },

    changeStatus(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    req.flash('reason_fail', 'Employee not found!');
                    res.redirect('back');
                } else {
                    employee
                        .update(req.body)
                        .then(employee => {
                            req.flash('success', 'Change employee\'s status successfully!')
                            res.redirect('/employees');
                        })
                        .catch(err => res.json(err))
                }
            })
            .catch(err => res.json(err))
    }
}