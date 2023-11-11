import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../../utils.js";

export default class Mail {
  constructor() {
    this.transport = nodemailer.createTransport(smtpTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: config.userGmail,
        pass: config.passGmail,
      },
    }));
  }
  send = async (user, subject, url) => {
    const result = await this.transport.sendMail({
      from: config.userGmail,
      to: user.email,
      subject,
      html: `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #000;
            padding: 0px;
            margin: 0px;
          }
          .container {
            max-width: 600px;
            margin: 0px auto;
            padding: 20px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .content {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #005500;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
          }
          .button:hover {
            background-color: #003300;
          }
          .button-container{
            text-align: center;
          }
          .uppercase {
            text-transform: uppercase;
            color: #000; /* Negro */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <img src="cid:headerMail" alt="img headerMail">
            <h1>Restablecimiento de Contraseña</h1>
            <p>Estimado/a <strong class="uppercase">${user.firstName}</strong>,</p>
            <p>Para restablecer la contraseña, por favor haz clic en el siguiente botón:</p>
            <div class="button-container">
              <p><a class="button" href="${url}">Restablecer Contraseña</a></p>
            </div>
            <p>Si no has solicitado este restablecimiento de contraseña, puedes ignorar este mensaje.</p>
            <img src="cid:footerMail" alt="img footerMail">
          </div>
        </div>
      </body>
    </html>`,
      attachments: [
        {
          filename: "footerMail.JPG",
          path: __dirname + "/src/images/footerMail.JPG",
          cid: "footerMail",
        },
        {
          filename: "headerMail.JPG",
          path: __dirname + "/src/images/headerMail.JPG",
          cid: "headerMail",
        },
      ],
    });
    return result;
  };
  sendDeleteUser = async (user, subject, url) => {
    const result = await this.transport.sendMail({
      from: config.userGmail,
      to: user.email,
      subject,
      html: `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #000;
            padding: 0px;
            margin: 0px;
          }
          .container {
            max-width: 600px;
            margin: 0px auto;
            padding: 20px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .content {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #005500;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
          }
          .button:hover {
            background-color: #003300;
          }
          .button-container{
            text-align: center;
          }
          .uppercase {
            text-transform: uppercase;
            color: #000; /* Negro */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <img src="cid:headerMail" alt="img headerMail">
            <h1>Se ha eliminado su cuenta</h1>
            <p>Estimado/a <strong class="uppercase">${user.firstName}</strong>,</p>
            <p>Por inactividad de más de 2 días se ha eliminado su cuenta</p>
            <div class="button-container">
              <p><a class="button" href="${url}">Volver a Registrarse</a></p>
            </div>
            <p>Si no has solicitado este restablecimiento de contraseña, puedes ignorar este mensaje.</p>
            <img src="cid:footerMail" alt="img footerMail">
          </div>
        </div>
      </body>
    </html>`,
      attachments: [
        {
          filename: "footerMail.JPG",
          path: __dirname + "/src/images/footerMail.JPG",
          cid: "footerMail",
        },
        {
          filename: "headerMail.JPG",
          path: __dirname + "/src/images/headerMail.JPG",
          cid: "headerMail",
        },
      ],
    });
    return result;
  };
}
