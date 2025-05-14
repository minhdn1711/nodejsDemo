import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';

class EmailService {
    constructor() {
        // Cấu hình transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Giới hạn đặt lại mật khẩu
        this.resetPasswordLimiter = new RateLimiterMemory({
            points: 5, // Giới hạn 5 lần
            duration: 5 * 60, // Trong 5 phút
        });
    }

    // Phương thức gửi email reset password
    async sendResetPasswordEmail(email, resetURL) {
        // Rate limiting
        try {
            await this.resetPasswordLimiter.consume(email);
        } catch (error) {
            throw new Error('Quá nhiều yêu cầu đặt lại mật khẩu');
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Đặt lại mật khẩu cho tài khoản của bạn',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                // Thêm unique identifier
                'X-Email-Version': `${new Date().getTime()}`
            },
            html: `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
                    <meta http-equiv="Pragma" content="no-cache">
                    <meta http-equiv="Expires" content="0">
                <title>Đặt lại mật khẩu</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .email-header {
                        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .email-body {
                        padding: 30px;
                    }
                    .email-footer {
                        background-color: #f1f1f1;
                        padding: 15px;
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                    }
                    .reset-button {
                        display: inline-block;
                        background: #4CAF50;
                        color: white !important;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                        font-weight: bold;
                        text-transform: uppercase;
                        transition: background 0.3s ease;
                    }
                    .reset-button:hover {
                        background: #45a049;
                    }
                    .warning-text {
                        color: #ff6f61;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Đặt lại mật khẩu</h1>
                    </div>
                    <div class="email-body">
                        <p>Xin chào,</p>
                        
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu đây là yêu cầu của bạn, vui lòng nhấp vào nút bên dưới:</p>
                        
                        <div style="text-align: center;">
                            <a href="${resetURL}" class="reset-button">Đặt lại mật khẩu</a>
                        </div>
                        
                        <p class="warning-text">Lưu ý: Liên kết này sẽ chỉ có hiệu lực trong vòng 10 phút.</p>
                        
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ nếu có điều gì đáng ngại.</p>
                        
                        <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
                    </div>
                    <div class="email-footer">
                        © ${new Date().getFullYear()} Bản quyền thuộc về Công ty của chúng tôi. 
                        Mọi thắc mắc vui lòng liên hệ: support@company.com
                    </div>
                </div>
            </body>
            </html>
            `
        };

        try {
            // Gửi email
            await this.transporter.sendMail(mailOptions);
            console.log(`Reset password email sent to ${email}`);
        } catch (error) {
            console.error('Error sending reset password email:', error);
            throw new Error('Không thể gửi email đặt lại mật khẩu');
        }
    }
}

export default new EmailService();
