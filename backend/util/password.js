const bcrypt = require('bcrypt');

// Constants definition
const PASSWORD_BCRYPT = 1;
const PASSWORD_DEFAULT = PASSWORD_BCRYPT;

// password_get_info function
function getPasswordInfo(hash) {
  return (hash.length < 60 || !hash.match(/^\$2[aby]\$\d{2}\$/))
    ? { algo: 0, algoName: 'unknown', options: {} }
    : { algo: 1, algoName: 'bcrypt', options: { cost: parseInt(hash.substring(4, 6), 10) } };
}

// password_hash function
async function encryptPassword(password, options = {}) {
  if (options.cost && (options.cost < 4 || options.cost > 31)) {
    throw new Error(`Invalid bcrypt cost parameter specified: ${options.cost}`);
  }

  const cost = options.cost || 10;
  const salt = await bcrypt.genSalt(cost);

  return bcrypt.hash(password, salt);
}

// password_needs_rehash function
function isRehashRequired(hash, algo, options = {}) {
  const info = getPasswordInfo(hash);

  if (algo !== info.algo) {
    return true;
  } else if (algo === 1) {
    options.cost = options.cost || 10;
    return info.options.cost !== options.cost;
  }

  return false;
}

// password_verify function
async function verifyPassword(password, hash) {
  if (hash.length !== 60) {
    return false;
  }

  const result = await bcrypt.compare(password, hash);

  return result;
}

module.exports = {  
  verifyPassword,
  encryptPassword,
  getPasswordInfo,
  isRehashRequired  
}