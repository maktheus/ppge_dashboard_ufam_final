import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { ADMIN_OTP_SECRET } from '../constants.ts';

dotenv.config({ path: '.env.local' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, whatsapp } = req.body;

    try {
        const user = 'admin@ppgee.ufam.edu.br';
        const service = 'PPGEE Dashboard';
        const otpauth = authenticator.keyuri(user, service, ADMIN_OTP_SECRET);

        const qrCodeUrl = await QRCode.toDataURL(otpauth);

        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
            console.error('Missing SMTP configuration. Please check your .env.local file.');

            return res.status(500).json({ error: 'Server misconfiguration: Missing SMTP settings' });
        }

        // Configure Nodemailer
        const secure = Number(smtpPort) === 465;
        console.log(`Attempting to send email using host: ${smtpHost}, port: ${smtpPort}, secure: ${secure}`);

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(smtpPort),
            secure: secure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        // Send Email
        await transporter.sendMail({
            from: '"PPGEE Dashboard" <no-reply@ppgee.ufam.edu.br>',
            to: 'maktheus@gmail.com',
            subject: 'Configuração de 2FA - PPGEE Dashboard',
            html: `
                <h1>Configuração de Autenticação de Dois Fatores</h1>
                <p><strong>Mensagem:</strong> ${message || 'Nenhuma mensagem fornecida.'}</p>
                <p><strong>WhatsApp:</strong> ${whatsapp || 'Não informado.'}</p>
                <hr />
                <p>Escaneie o QR Code abaixo com o seu aplicativo Google Authenticator:</p>
                <img src="cid:qrcode" alt="QR Code 2FA" />
                <p>Ou digite o segredo manualmente: <strong>${ADMIN_OTP_SECRET}</strong></p>
            `,
            attachments: [{
                filename: 'qrcode.png',
                path: qrCodeUrl,
                cid: 'qrcode' // same cid value as in the html img src
            }]
        });

        return res.status(200).json({
            message: 'QR Code enviado para maktheus@gmail.com',
            secret: ADMIN_OTP_SECRET
        });
    } catch (error) {
        console.error('Error generating QR code or sending email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
