const fs = require("fs");
const path = require("path");
const mailgun = require("mailgun-js");
const Handlebars = require("handlebars");
const verifyRecaptcha = require("../services/reCaptcha");

exports.contact = async function (req, res, next) {
  try {
    // check google recaptcha token for suspicious activity
    const verify = await verifyRecaptcha(req.body.reCaptcha);

    if (verify.data.success === true) {
      // grab relevant .env data
      const API_KEY = process.env.MAILGUN_API_KEY;
      const DOMAIN = process.env[req.body.mailgunDomain];
      const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

      // import html email template
      const source = fs.readFileSync(
        path.join(__dirname, `../mail_templates/message.hbs`),
        "utf8"
      );
      const template = Handlebars.compile(source);

      // accumulate data from message and env for template
      const templateData = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        baseUrl: req.body.baseUrl,
        logoUrl: req.body.logoUrl,
      };

      // create email
      const data = {
        from: `${req.body.name} <${req.body.email}>`,
        to: req.body.recipient,
        subject: "Website Enquiry",
        html: template(templateData),
      };

      // send email to mailgun
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
