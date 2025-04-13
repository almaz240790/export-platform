import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendResetCode(phone: string, code: string) {
  try {
    await client.messages.create({
      body: `Ваш код для восстановления пароля: ${code}. Код действителен 15 минут.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
} 