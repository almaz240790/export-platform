import nodemailer from 'nodemailer';

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendResetCode(email: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Код для восстановления пароля',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Восстановление пароля</h2>
        <p style="color: #666; font-size: 16px;">Ваш код для восстановления пароля:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Код действителен в течение 15 минут.</p>
        <p style="color: #666; font-size: 14px;">Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 