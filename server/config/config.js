/**
 * PORT
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * URL DB
 */
process.env.URLDB = "mongodb://localhost:27017/users";

/**
 * Token Expiration
 */

process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30

/**
 * Auth seed
 */

process.env.SEED = process.env.SEED || 'this-is-the-seed'