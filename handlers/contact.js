const fs = require("fs");
const verifyRecaptcha = require("../helpers/reCaptcha");
const path = require("path");
const Handlebars = require("handlebars");
const mailgun = require("mailgun-js");

exports.contact = async function (req, res, next) {
  try {
    let verify = await verifyRecaptcha(req.body.reCaptcha);
    if (verify.data.success === true) {
      const API_KEY = process.env[req.body.apiKey];
      const DOMAIN = process.env[req.body.domain];
      const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

      const source = fs.readFileSync(
        path.join(__dirname, `../mail_templates/message.hbs`),
        "utf8"
      );
      const template = Handlebars.compile(source);

      const templateData = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        baseURL:
          process.env.NODE_ENV === "development"
            ? "http://localhost:2368"
            : req.body.baseURL,
      };

      const data = {
        from: `${req.body.name} <${req.body.email}>`,
        to:
          process.env.NODE_ENV === "development"
            ? "jakebottrall@gmail.com"
            : req.body.recipient,
        subject: "Website Enquiry",
        html: template(templateData),
      };

      await mg.messages().send(data);

      return res.status(200).json({ message: "success" });
    } else {
      return next({
        status: 400,
        message: "You're a robot!",
      });
    }
  } catch (err) {
    return next(err);
  }
};
