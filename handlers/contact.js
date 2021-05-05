const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const verifyRecaptcha = require("../services/reCaptcha");

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const { MAILGUN_PRIVATE_API_KEY, MAILGUN_PUBLIC_API_KEY } = process.env;

const mg = mailgun.client({
  username: "api",
  key: MAILGUN_PRIVATE_API_KEY,
  public_key: MAILGUN_PUBLIC_API_KEY,
});

exports.contact = async function (req, res, next) {
  try {
    // check google recaptcha token for suspicious activity
    const verify = await verifyRecaptcha(req.body.reCaptcha);

    if (verify.data.success === true) {
      // grab relevant .env data
      const DOMAIN = process.env[req.body.mailgunDomain];

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
      const messageOptions = {
        from: `${req.body.name} <${req.body.email}>`,
        to: req.body.recipient,
        subject: "Website Enquiry",
        html: template(templateData),
      };

      // send email to mailgun
      await mg.messages.create(DOMAIN, messageOptions);

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
