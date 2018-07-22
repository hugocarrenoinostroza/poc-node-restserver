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


process.env.CLIENT_ID = process.env.CLIENT_ID || '802348873090-81ous98ki3c31db1jotb6ido29m604gu.apps.googleusercontent.com'