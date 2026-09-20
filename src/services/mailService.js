import mailer from 'nodemailer';
import { mailConfig } from '../constants/mailConfig.js';

const transport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mailConfig.sender,
        pass: mailConfig.password
    }
};

class MailService {

    async sendRegistrationMail(user) {
        const link = `https://swimigo.it/api/user/${user._id}/confirm/${encodeURIComponent(user.registrationToken)}`;

        const mailData = {
            from: `'Swimigo' <${mailConfig.sender}>`,
            to: user.email,
            subject: 'Conferma il tuo indirizzo email',
            text: `Ciao ${user.name}, clicca sul seguente link per confermare il tuo indirizzo email: ${link}`,
            html: ''
        };

        return await mailer.createTransport(transport).sendMail(mailData);
    }

    async sendMailLinkPassRecovery(user) {
        const link = `${process.env.FRONTEND_URL}/reset-password/${encodeURIComponent(user.registrationToken)}`;

        const mailData = {
            from: `'Swimigo' <${mailConfig.sender}>`,
            to: user.email,
            subject: 'Reimposta la password',
            text: `Ciao ${user.name}, clicca sul seguente link per impostare una nuova password. Se non sei stato tu a richiederla, ignora questa email: ${link}`,
            html: ''
        };

        return await mailer.createTransport(transport).sendMail(mailData);
    }

    async sendMailCommentNotification(postUser, post) {
        const link = `${process.env.FRONTEND_URL}/user/post/${post._id.toString()}`;

        const mailData = {
            from: `'Swimigo' <${mailConfig.sender}>`,
            to: postUser.email,
            subject: 'Nuovo commento al tuo post',
            text: `Un utente ha commentato il tuo post "${post.title}". Clicca sul seguente link per visualizzarlo: ${link}`,
            html: ''
        };

        return await mailer.createTransport(transport).sendMail(mailData);
    }
}

export default new MailService();