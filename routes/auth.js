const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
let success = false;

const JWT_SEECRET = 'raviisgood'
//create a user using :'/api/auth/createuser'


router.post('/createuser', [
  body('name', "Enter a valid name").isLength({ min: 3 }),
  body('email', "Enter valid email").isEmail(),
  body('password', "Enter valid password").isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check weather user with email is existing or not
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(404).json({ error: "sorry with this email user is already exit" })
    }

    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass,
    })
    // .then(user => res.json(user))
    // .catch(err =>{console.log(err)
    // res.json({error:"Please enter a unique email",message:err.message})});

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SEECRET);
    // console.log(authtoken);
    success = true;
    res.json({success,authtoken});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occured");
  }
});


//create a login using :'/api/auth/login' : no login require
router.post('/login', [
  body('email', "Enter valid email").isEmail(),
  body('password', "password can not be blank").exists()
], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user =await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'please use right passowrd' });

    }
    const passwordcompare =await bcrypt.compare(password, user.password);

    if (!passwordcompare) {
      return res.status(400).json({ error: 'please use right passowrd in compare passowrd' });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SEECRET);
    success = true;
    res.json({success,authtoken});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occured");
  }
});

//get user data using :'/api/auth/getdata' : login require
router.post('/getdata',fetchuser, async (req, res) => {
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal error occured");
}

})

module.exports = router