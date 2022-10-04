const nodemailer = require('nodemailer');

class SendMail {
    constructor(userEmail) {
        // this.from = 'usof.confirmation.kh@gmail.com';
        // this.password = 'vzfcmyxpzdahbnmv';
        this.from = 'kennedy.ernser@ethereal.email';
        this.password = '6CqKm49M56V9mj5efN';
    }
    send(to, token, type) {
        const massageEmail = {};
        if (type === 'activate') {
            massageEmail.subject = 'Email confirmation - usof.com';
            massageEmail.html = `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        div{
            padding: 15px;
            text-align: center;
            background-color: #000000;
        }
        .header{
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 600;
            font-size: 28px;
            line-height: 43px;
            color: #9e9e9e;
        } 
        .text{
            font-family: 'Montserrat';
            font-style: normal;
            width: 400;
            text-align: center;
            font-weight: 400;
            font-size: 18px;
            line-height: 150%;
            width: 446px;
            color: #9e9e9e;
        }
        .confirm-link{
            font-family: 'Montserrat';
            text-decoration: none;
            font-weight: 400;
            font-size: 18px;
            line-height:  150%;
        }
        .text-div{
        display: flex;
        margin-left: 360px;
        
        }
    </style>
</head>
<body>
    
    <div>
        <h1 class="header">USOF</h1>
        <div class="text-div" style="justify-content: center">
        <p class="text">
            Thank you for registering on our website,
                <a style="color:#fba92c;"class ="confirm-link" href="http://localhost:3000/confirm-email/${token}">
                click here
                </a>
                to confirm your email
        </p>
    </div>
    </div>
</body>
</html>
        `;
        } else {
            massageEmail.subject = 'Reset password - usof.com';
            massageEmail.html = `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        div{
            padding: 15px;
            text-align: center;
            background-color: #000000;
        }
        .header{
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 600;
            font-size: 28px;
            line-height: 43px;
            color: #9e9e9e;
        } 
        .text{
            font-family: 'Montserrat';
            font-style: normal;
            width: 400;
            text-align: center;
            font-weight: 400;
            font-size: 18px;
            line-height: 150%;
            width: 446px;
            color: #9e9e9e;
        }
        .confirm-link{
            font-family: 'Montserrat';
            text-decoration: none;
            font-weight: 400;
            font-size: 18px;
            line-height:  150%;
        }
        .text-div{
        display: flex;
        margin-left: 360px;
        
        }
    </style>
</head>
<body>
    
    <div>
        <h1 class="header">USOF</h1>
        <div class="text-div" style="justify-content: center">
        <p class="text">
             You requested for reset password,
                <a style="color:#fba92c;"class ="confirm-link" href="http://localhost:3500/api/auth/password-reset/${token}">
                click here
                </a>
                to reset your password
        </p>
    </div>
    </div>
</body>
</html>
        `;
        }
        const mail = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: this.from,
                pass: this.password,
            },
        });
        const mailOptions = {
            from: this.from,
            to,
            subject: massageEmail.subject,
            text: '',
            html: massageEmail.html,
        };
        mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('send massage');
            }
        });
    }
}

module.exports = new SendMail();


