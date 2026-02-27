import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendRateLimitAlert(recipientEmail: string, prompt: string, userName: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const mailOptions = {
    from: `"Opportunity RAG Alert" <${process.env.SMTP_USER}>`,
    to: process.env.ERROR_ALERT_EMAIL,
    subject: '⚠️ Gemini Rate Limit Hit (429 Error)',
    html: `
      <h2>Rate Limit Alert</h2>
      <p>The Gemini API returned a 429 (Rate Limit Exceeded) error for a user request.</p>
      <hr />
      <p><strong>Gemini API Key:</strong> ${GEMINI_API_KEY}</p>
      <p><strong>User Name:</strong> ${userName}</p>
      <p><strong>User Email:</strong> ${recipientEmail}</p>
      <p><strong>Prompt Sent:</strong></p>
      <blockquote style="background: #f4f4f4; padding: 10px; border-left: 5px solid #ccc;">
        ${prompt}
      </blockquote>
      <hr />
      <p>Please check the API usage or switch to a different API key if necessary.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Rate limit alert email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending rate limit alert email:', error);
    throw error;
  }
}
