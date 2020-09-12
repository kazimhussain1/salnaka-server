const nodemailer = require("nodemailer");

exports.sendMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USERNAME_SENDMAIL,
        pass: process.env.PASSWORD,
      },
    });

    var mailOptions = {
      from: "no-reply@salnaka.com",
      to: waitingforAccount, // salnaka.support@gmail.com
      subject: "SALNAKA - SUPPORT",
      text:
        "First Name: " +
        firstName +
        "\n" +
        "Last Name: " +
        lastName +
        "\n" +
        "Email: " +
        email +
        "\n" +
        "Phone No: " +
        phone +
        "\n\n" +
        "Subject: " +
        subject +
        "\n\n" +
        "Message: " +
        message +
        "\n",
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: {
        msg:
          "Your message has been forward to our support team. We will get back to you within 48 hours",
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      errors: [
        {
          code: 500,
          msg: err.toString(),
        },
      ],
    });
  }
};
