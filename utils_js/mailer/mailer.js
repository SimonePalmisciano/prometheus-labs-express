// Configurazione Nodemailer per invio email
import nodemailer from 'nodemailer';

// oggetto che gestisce la connessione con il server email di Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

// Funzione per inviare email all'utente dopo l'ordine
const sendUserEmail = async (orderData) => {
    await transporter.sendMail({
        from: `"Prometheus Labs" <${process.env.MAIL_USER}>`,
        to: orderData.guest_email,
        subject: 'Thank you for your order! - Prometheus Labs',
        html: `
            <h1>Thank you for your purchase, ${orderData.guest_name}!</h1>
            <p>Your order has been successfully received.</p>
            <p><strong>Order total:</strong> €${orderData.total_amount}</p>
            <p>Your superpower is on its way! 🚀</p>
            <br>
            <p>The Prometheus Labs Team</p>
        `
    });
};

// Funzione per inviare email all'admmin dopo l'ordine
const sendAdminEmail = async (orderData) => {
    await transporter.sendMail({
        from: `"Prometheus Labs" <${process.env.MAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'New order received! - Prometheus Labs',
        html: `
            <h1>New order received!</h1>
            <p><strong>Customer:</strong> ${orderData.guest_name} ${orderData.guest_surname}</p>
            <p><strong>Email:</strong> ${orderData.guest_email}</p>
            <p><strong>Total:</strong> €${orderData.total_amount}</p>
            <p><strong>City:</strong> ${orderData.city}, ${orderData.country}</p>
        `
    });
};

export { transporter, sendUserEmail, sendAdminEmail };