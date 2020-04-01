const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = { 
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({email: email});
        if (existingUser) {
          throw new Error('email in use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('must be between 4 and 20 characters')
    .custom((passwordConfirmation, {req}) => {
      if(passwordConfirmation !== req.body.password ) {
        throw new Error('password must match')
      }
    })
}