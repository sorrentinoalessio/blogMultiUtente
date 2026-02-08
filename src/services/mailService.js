import mailer from 'nodemailer';
import { mailConfig } from '../constants/mailConfig.js';
import { host, port } from '../../server.js';

const transport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mailConfig.sender,
        pass: mailConfig.password
    }


}

class MailService {
    async sendRegistrationMail(user) {
        const link = `https://alessio-be.longwavestudio.dev/user/${user._id}/confirm/${encodeURIComponent(user.registrationToken)}`;
        const mailData = {
            from: `'Blog service' <${mailConfig.sender}>`,
            to: user.email,
            subject: 'Conferma il tuo indirizzo email',
            text: `Ciao ${user.name}, clicca sul seguente link per confermare il tuo indirizzo email: ${link}`,
            html: ''
        }
        return await mailer.createTransport(transport).sendMail(mailData);
    }
     async sendMailLinkPassRecovery(user) {
        const link = `https://alessio-be.longwavestudio.dev/user/reset/${encodeURIComponent(user.registrationToken)}`;
        const mailData = {
            from: `'Blog service' <${mailConfig.sender}>`,
            to: user.email,
            subject: 'RESET PASSWORD',
            text: `Ciao ${user.name}, clicca il link per impostare la nuova password, se non sei stato tu a richiederla ignora questa email:  ${link}`,
            html: ''
        }
        return await mailer.createTransport(transport).sendMail(mailData);
    }

async sendMailNewPassword(user) {
     const link = `https://alessio-be.longwavestudio.dev/user/new_password/${user.registrationToken}`;
           const mailData = {
            from: `'Blog service' <${mailConfig.sender}>`,
            to: user.email,
            subject: 'NEW PASSWORD',
            text: `clicca il link per modificare la password ${link}`,
            html: ''
        }
        return await mailer.createTransport(transport).sendMail(mailData);
    }
   

}


export default new MailService();