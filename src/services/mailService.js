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
            from: `'todolist service' <${mailConfig.sender}>`,
            to: user.email,
            subject: 'Conferma il tuo indirizzo email',
            text: `Ciao ${user.name}, clicca sul seguente link per confermare il tuo indirizzo email: ${link}`,
            html: ''
        }
        return await mailer.createTransport(transport).sendMail(mailData);
    }

   async sendPostOverdueMail(to, payload) {
        const list = payload.map(a => `- ${a.name} (ID: ${a.postId})`).join('\n');
        const mailData = {
            from: `'todolist service' <${mailConfig.sender}>`,
            to: to,
            subject: 'Lista delle tue post scadute',
            text: `Ciao ecco la lista delle tue post scadute \n ${list}.`
         };

        return await mailer.createTransport(transport).sendMail(mailData);
    }

}


export default new MailService();