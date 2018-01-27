import sha256 from 'sha256';
/**
 * check email valid. If valid, return true
 * if invalid, return false
 * @param {*} email
 */
export const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

/**
 * check password valid withe length more than 8.
 * If yes, return true
 * if not, return false.
 * @param {*} password
 */
export const validatePassword = password => password.length > 8;

/**
 * return hashed password followed sha256.
 * @param {*} password
 */
export const generatehashedPassword = password => sha256(password);
