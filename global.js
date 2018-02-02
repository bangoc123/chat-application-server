export const errors = {
  GeneralError: {
    message: 'SOMETHING_WENT_WRONG',
  },
  BadRequest: {
    message: 'INVALID_DATA',
  },
  UserDoesNotExist: {
    message: 'USER_DOES_NOT_EXIST',
  },
  WrongPassword: {
    message: 'WRONG_PASSWORD',
  },
};

export const pagingDefault = {
  limit: 20,
  skip: 0,
};

export const underscoreId = '_id';

export const config = {
  passport: {
    secret: 'cmc-awesome-developers',
    expiresIn: 9007199254740991,
  },
  env: {
    dev: {
      port: 8000,
      mongoDBUri: 'mongodb://localhost/cmc',
    },
  },
};

