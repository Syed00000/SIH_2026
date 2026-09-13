import nodemailer from 'nodemailer';

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'officialsamadhan043@gmail.com',
      pass: 'golqocsqtcqkpcxg' // removed spaces
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test" <officialsamadhan043@gmail.com>',
      to: 'test@example.com',
      subject: 'Test',
      text: 'Test'
    });
    console.log("Success:", info.messageId);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
