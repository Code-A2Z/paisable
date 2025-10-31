const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const calculateNextDueDate = (startDate, frequency) => {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
        throw new Error('Invalid startDate');
    }

    let nextDueDate = new Date(start);


    switch (frequency) {
        case 'daily':
            nextDueDate.setDate(nextDueDate.getDate() + 1);
            break;
        case 'weekly':
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
        case 'monthly':
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
        case 'annually':
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
        default:
            throw new Error(`Unknown frequency: ${frequency}`);
    }

    return nextDueDate;
};

const sendEmail= async(options)=>{
    // Accept both styles for compatibility:
    // controller may call with { to, subject, text }
    // older code may call with { email, subject, message }
    const to = options.to || options.email;
    const text = options.text || options.message;

    const mailOptions={
        from:`Paisable <${process.env.EMAIL_FROM}>`,
        to,
        subject:options.subject,
        text
    }
    await transporter.sendMail(mailOptions);
}



module.exports = { calculateNextDueDate,sendEmail };