import express from 'express';
import { errors, underscoreId } from './../global';
import { validatePassword, generatehashedPassword } from './../helper';
import { User } from '../db/models';

const loginController = express.Router();

/**
 * entry point: /login
 * method: GET
 */
loginController.get('/', (req, res) => {
  res.render('login', { error: req.flash('error') || null });
});

/**
 * entry point: /login
 * method: POST
 * get data from req.body
 * data includes username, password
 * check not null these fields. If one field null, return 400 BadRequest
 * check user existence. If does not, redirect to /login and set flash error
 * hash req.body.password and compare to hashedPassword in DB
 * if equal, redirect to dashboard
 * other cases, redirect to /login
 */

loginController.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || !validatePassword(password)) {
    req.flash('error', errors.BadRequest.message);
  } else {
    try {
      // check user existence
      const user = await User.findOne({ username }).lean().exec();
      if (!user) {
        req.flash('error', errors.UserDoesNotExist.message);
      } else if (user.hashedPassword !== generatehashedPassword(password)) {
        req.flash('error', errors.WrongPassword.message);
      } else {
        req.session.username = username;
        req.session.userId = user[underscoreId];
        res.redirect('/dashboard');
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: errors.GeneralError.message,
        error,
      });
    }
  }
  res.redirect('/login');
});

export default loginController;
