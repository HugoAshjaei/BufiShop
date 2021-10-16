import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import localDict from '../../helpers/dict';

async function hasSMTP() {
    if (global.CONFIG.website.smtp?.host && global.CONFIG.website.smtp?.port && global.CONFIG.website.smtp?.auth?.user && global.CONFIG.website.smtp?.auth?.pass) {
        return true;
    } else {
        return false;
    }
}

async function sendEmail(to: string, template: string, data: any) {
    if (await hasSMTP()) {
        const transporter = nodemailer.createTransport({
            host: global.CONFIG?.website?.smtp?.host,
            port: global.CONFIG?.website?.smtp?.port,
            secure: true,
            auth: {
                user: global.CONFIG?.website?.smtp?.auth?.user,
                pass: global.CONFIG?.website?.smtp?.auth?.pass,
            },
        });
        data.storeUrl = global.CONFIG?.website?.url;
        data.storeLogo = global.CONFIG?.website?.logo?.small;
        data.storeName = global.CONFIG?.website?.name;
        const templateFile = fs.readFileSync(`${__dirname}/../../../templates/email/${template}.html`, 'utf8');
        const compiledTemplate = handlebars.compile(templateFile);
        const html = compiledTemplate(data);

        const mailOptions = {
            from: global.CONFIG?.website?.smtp?.from,
            to,
            subject: localDict.fa.info.email[template],
            html,
        };

        await transporter.sendMail(mailOptions);
    }
}

export default sendEmail;