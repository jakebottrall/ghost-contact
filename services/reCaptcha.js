const axios = require("axios");

async function verifyRecaptcha({ secretKey, token }) {
  let verification = axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env[secretKey]}&response=${token}`,
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
