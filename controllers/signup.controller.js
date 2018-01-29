import express from 'express';
import { validateEmail, generatehashedPassword, validatePassword } from './../helper';
import { User } from '../db/models';
import { errors } from './../global';

const signupController = express.Router();

/**
 * entry point: /signup
 * method: GET
 */
signupController.get('/', (req, res) => {
  res.render('signup', { error: req.flash('error') || null });
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
signupController.post('/', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username
      || !password
      || !email
      || !validatePassword(password)
      || !validateEmail(email)) {
    req.flash('error', errors.BadRequest.message);
    res.redirect('/signup');
  } else {
    try {
      const hashedPassword = generatehashedPassword(password);
      // Add user to database
      const user = new User({ email, username, hashedPassword });
      await user.save();
      // Set user online.
      req.session.username = username;
      // Redirect to dashboard
      res.redirect('/dashboard');
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: errors.GeneralError.message,
        error,
      });
    }
  }
});

export default signupController;

