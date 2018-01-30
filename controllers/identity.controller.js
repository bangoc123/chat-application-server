import express from 'express';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator/check';
import { errors, config } from './../global';
import { User } from '../db/models';

const identityController = express.Router();

identityController.post('/', [
  check('username')
    .exists()
    .withMessage('USERNAME_IS_EMPTY'),
  check('password')
    .exists()
    .withMessage('PASSWORD_IS_EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_LENGH_MUST_MORE_THAN_8'),
], async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  // Validate using middleware

  if (!errorsAfterValidation.isEmpty()) {
    res.status(422).json({
      errors: errorsAfterValidation.mapped(),
    });
  } else {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      console.log('======**++======user', user);
      const isMatchedPassword = user.comparePassword(password);
      if (isMatchedPassword) {
        const token = jwt.sign({ username }, config.passport.secret, {
          expiresIn: 10000000000000000000,
        });
        res.status(200).json({
          token,
        });
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: errors.GeneralError.message,
        error,
      });
    }
  }
});

export default identityController;
