// script to submit contact forms to ghost-contact api

// get contact form
const contactForm = document.querySelector("#contact-form");

// bind onsubmit to function
if (contactForm) {
  contactForm.onsubmit = submit;
}

async function submit(e) {
  try {
    e.preventDefault();
    // get recaptcha token
    const token = await validateCaptcha();
    if (token) {
      // get form data
      const name = document.querySelector("#name");
      const email = document.querySelector("#email");
      const message = document.querySelector("#message");

      const data = {
        baseUrl,
        logoUrl,
        mailgunDomain,
        name: name.value,
        email: email.value,
        message: message.value,
        recipient: contactRecipient,
        reCaptcha: {
          token,
          secretKey: reCaptchaSecretKey,
        },
      };

      // post form data
      axios({
        data,
        method: "post",
        url: contactUrl,
      })
        .then((res) => {
          name.value = "";
          email.value = "";
          message.value = "";
          console.log("Message succefully sent");
          // add any success handlers or functions for your site/app here
        })
        .catch((error) => {
          console.log(err.message);
          // add any error handlers or functions for your site/app here
        });
    }
  } catch (error) {
    console.log(error.message);
    // add any error handlers or functions for your site/app here
  }
}

// validate recaptcha with google
function validateCaptcha() {
  return new Promise((res, rej) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(reCaptchaSiteKey, { action: "submit" })
        .then((token) => {
          return res(token);
        });
    });
  });
}
