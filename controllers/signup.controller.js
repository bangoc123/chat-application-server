import express from 'express';
import User from './../db/User';
import { validateEmail, generatehashedPassword, validatePassword } from './../helper';

const signupController = express.Router();

/**
 * entry point: /signup
 * method: GET
 */
signupController.get('/', (req, res) => {
  res.render('signup');
});

/**
 * Get data from req.body
 * Data includes email, username and password
 * check not null three fields. If one field null, throw BadRequest 400
 * check email is valid format. If not, throw BadRequest 400
 * Hashing password using SHA256.
 * save user to database.
 * If save sucessfully, return 200.
 * If failed, return GeneralError 500.
 */
const userDB = new User();
signupController.post('/', (req, res) => {
  const { username, password, email } = req.body;

  if (!username
      || !password
      || !email
      || !validatePassword(password)
      || !validateEmail(email)) {
    res.status(400).send('Invalid data');
  } else {
    try {
      const hashedPassword = generatehashedPassword(password);
      // Add user to database
      userDB.add({ email, username, hashedPassword });
      // Set user online.
      req.session.username = username;
      res.redirect('/dashboard');
    } catch (e) {
      res.status(500).send('Something went wrong');
    }
  }
});

export default signupController;

