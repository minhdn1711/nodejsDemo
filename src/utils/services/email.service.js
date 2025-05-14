import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = this.createTransporter();
    }

    createTransporter() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendResetPasswordEmail(toEmail, resetUrl) {
        const html = this.generateResetPasswordTemplate(resetUrl);

        try {
            await this.transporter.verify();

            const mailOptions = {
                from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USERNAME}>`,
                to: toEmail,
                subject: 'Đặt lại mật khẩu',
                html,
                text: htmlToText(html)
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email đặt lại mật khẩu đã được gửi:', info.messageId);
            return info;
        } catch (error) {
            console.error('❌ Lỗi gửi email:', error);
            throw new Error(`Không thể gửi email: ${error.message}`);
        }
    }

    generateResetPasswordTemplate(resetUrl) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Đặt lại mật khẩu</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết dưới đây để tiếp tục:</p>
                <a href="${resetUrl}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                ">Đặt lại mật khẩu</a>
                <p style="margin-top: 20px;">Liên kết sẽ hết hạn sau 10 phút.</p>
            </div>
        `;
    }
}

export default new EmailService();
