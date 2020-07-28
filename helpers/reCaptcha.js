const axios = require("axios");

async function verifyRecaptcha(key) {
  let verification = axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${key}`,
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
    }
  );
  return verification;
}

module.exports = verifyRecaptcha;
