const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

const Model = require ('../models/admin/register.js');
const staffModel = require ('../models/staff/staff.js');

const upload = require ('../index.js');

// register routes
const register = (req, res, next) => {
  // check if user phone already exists
  Model.findOne ({
    where: {
      phone: req.body.phone,
    },
  })
    .then (dbUser => {
      if (dbUser) {
        return res.status (201).json ({message: 'Phone number already exists'});
      } else if (req.body.phone) {
        bcrypt.genSalt (10, (err, salt) => {
          if (err) {
            return res
              .status (500)
              .json ({message: 'Salt could not be generated'});
          }
          bcrypt.hash (req.body.password, salt, (err, hashPassword) => {
            if (err) {
              return res
                .status (500)
                .json ({message: 'Could not hash the password'});
            } else if (hashPassword) {
              return Model.create ({
                username: req.body.username,
                phone: req.body.phone,
                password: hashPassword,
              })
                .then (() => {
                  res
                    .status (200)
                    .json ({message: 'User successfully created!'});
                })
                .catch (e => {
                  res
                    .status (502)
                    .json ({message: 'Error while registering user'});
                });
            }
          });
        });
      } else if (!req.body.password) {
        return res.status (400).json ({message: 'password not provided'});
      } else if (!req.body.phone) {
        return res.status (400).json ({message: 'phone not provided'});
      }
    })
    .catch (err => {
      console.log ('Error: ' + err);
    });
};

const login = (req, res, next) => {
  console.log (res);
  // check if phone already exists
  Model.findOne ({
    phone: req.body.phone,
  })
    .then (dbUser => {
      if (!dbUser) {
        return res.status (404).json ({message: 'user not found'});
      } else {
        // password hash
        bcrypt.compare (req.body.password, dbUser.password, (err, result) => {
          if (err) {
            return res
              .status (502)
              .json ({message: 'error while checking password'});
          } else if (result) {
            const token = jwt.sign ({phone: req.body.phone}, 'secret', {
              expiresIn: '1h',
            });
            res.status (200).json ({message: 'User logged in', token: token});
          } else {
            res.status (401).json ({message: 'Invalid Credentials'});
          }
        });
      }
    })
    .catch (err => {
      console.log ('error', err);
    });
};

const staff = (req, res, next) => {
  // check if user phone already exists
  staffModel
    .findOne ({
      where: {
        phone: req.body.phone,
      },
    })
    .then (dbUser => {
      if (dbUser) {
        return res.status (201).json ({message: 'Phone number already exists'});
      } else if (req.body.phone) {
        return staffModel
          .create ({
            hotelName: req.body.hotelName,
            name: req.body.name,
            phone: req.body.phone,
            passport: req.file.passport,
            position: req.body.position,
            salary: req.body.salary,
            address: req.body.address,
            state: req.body.state,
          })
          .then (() => {
            res
              .status (200)
              .json ({message: 'Hotelia Profile successfully created!'});
          })
          .catch (e => {
            res.status (502).json ({message: 'Error while registering user'});
          });
      }
    })
    .catch (err => {
      console.log ('Error: ' + err);
    });
};

const allStaff = async (req, res, next) => {
  staffModel
    .find ()
    .then (staff => {
      res.send (staff);
      // res.status (200).json ({message: 'Staff data fetched successfully'});
    })
    .catch (err => {
      res.status (500).json ({message: 'Error while fetching staff'});
    });
};

const isAuth = (req, res, next) => {
  const authHeader = req.get ('Authorization');
  if (!authHeader) {
    return res.status (401).json ({message: 'not authenticated'});
  }
  const token = authHeader.split (' ')[1];
  let decodedText;
  try {
    decodedText = jwt.verify (token, 'secret');
  } catch (e) {
    return res
      .status (500)
      .json ({message: e.message || 'could not be decoded'});
  }
  if (!decodedText) {
    res.status (401).json ({message: 'unauthorized'});
  } else {
    res.status (200).json ({message: 'Here is your resource'});
  }
};

module.exports = {register, login, isAuth, staff, allStaff};
