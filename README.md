# ghost-contact

This is a simple node.js api for submitting contact forms via `
**[mailgun](https://app.mailgun.com/)** and using **google reCaptcha**. Mainly intended to be used with **[ghost](https://ghost.org/)** sites it can be adapted to most front end applications or cms'. It's also able to service multiple websites simultaneously.

## Download/Install

Either use the download link or clone it via git:
`git clone git@github.com:jakebottrall/ghost-contact.git`

Once downloaded, cd into the directory and run `npm i`

## Backend Environment Variables

Environment variables **must** be setup for the api to function correctly:
`touch .env`

You'll need a few things before setting this file up:

- [Google reCaptcha v3 api keys](https://developers.google.com/recaptcha/docs/v3)
- [Mailgun api key](https://help.mailgun.com/hc/en-us/articles/203380100-Where-Can-I-Find-My-API-Key-and-SMTP-Credentials-)
- [Mailgun domain]()

Once you've attained the above requirements set up the .env file as the below example. **Note:** You can set up as many sites as you want. I recommend using different recaptcha keys and mg.domains for each.

**Example .env file**

> \# define the port the app will be listening on
> PORT=2000
>
> \# your google reCaptcha secret key
> YOUR_SITE_RECAPTCHA_SECRET_KEY=your-google-recaptcha-secret-key
>
> \# your mailgun api key
> MAILGUN_API_KEY=your-mailgun-api-key
>
> \# your mailgun domain
> MG_YOUR_DOMAIN=mg.yoursite.com

## Frontend Setup

I've included an example script to get up and running for ghost handlebars templates in the "frontend_scripts" folder. It requires google reCaptcha and axios. Include the below at the end of your body tag replacing the google reCaptcha public key with your own:

> \<!-- provided ghost api script -->
> \<script src="{{asset "js/ghost-contact.js"}}">\</script>
>
> \<!-- this allows the ghost-contact script to send the site/apps logo url in the email message -->
> \<script>const logoUrl = "{{@site.logo}}";\</script>
>
> \<!-- axios requirements -->
> \<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js" integrity="sha512VZ6m0F78+yo3sbu48gElK4irv2dzPoep8oo9LEjxviigcnnnNvnTOJRSrIhuFk68FMLOpNz+T77nNY89rnWDg==" crossorigin="anonymous">\</script>
>
> \<!-- google reCaptcha script -->
> \<script src="https://www.google.com/recaptcha/api.js render=YOUR_PUBLIC_KEY">\</script>

I usually include google reCaptcha script in code injection on Ghost to allow templates to be reusable.

### Contact Form

The contact form at its most basic level needs the following:

> \<form id="contact-form">
> \<input required type="text" id="name" value="" />
> \<input required type="email" id="email" value="" />
> \<textarea required id="message">\</textarea>
> \<button type="submit">Send\</button>
> \</form>

### Code Injection

If this is being used for **ghost** you'll need to define variables in the code injection to tell the ghost-contact api which .env variables to use. Example:

> \<script>
> const reCaptchaSiteKey = "your-site-key";
>
> // the name given to the reCaptcha secret key in the .env file
> const reCaptchaSecretKey = "YOUR_SITE_RECAPTCHA_SECRET_KEY"
>
> // the url where ghost contact is setup
> const contactUrl = "https://yoursite.com/ghost-contact";
>
> // where you want the email to go
> const contactRecipient = "info@yoursite.com";
>
> // the name given to the your mailGun domain in the .env file
> const mailgunDomain = "MG_YOUR_SITE";
>
> // the base url of your website
> const baseUrl = "https://yoursite.com";
> \</script>

If you're **not using ghost** the above variables need to be sent through your post request.

## Examples

### Ghost - daciatech.com

- See the git repo [here](https://github.com/jakebottrall/dacia-ghost-theme).
- See the live website [here](https://daciatech.com)

Code injection setup:

> \<script src="https://www.google.com/recaptcha/api.js render=6LcvNpgUAAAAADcjp5DBGulcK42Aq40gAlfn3ZjI">\</script>
> \<script>
> // General Config
> const reCaptchaSiteKey = "6LcvNpgUAAAAADcjp5DBGulcK42Aq40gAlfn3ZjI";
> const reCaptchaSecretKey = "DACIATECH_RECAPTCHA_SECRET_KEY"
> const contactUrl = "https://daciatech.com/ghost-contact";
> const contactRecipient = "info@daciatech.com";
> const mailgunDomain = "MG_DACIATECH";
> const baseUrl = "https://daciatech.com";
> \</script>

### React - jakebottrall.com

- See the git repo [here](https://github.com/jakebottrall/jbottrall).
- See the live website [here](https://jakebottrall.com)
