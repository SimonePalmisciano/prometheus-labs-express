// Configurazione Nodemailer per invio email 
import nodemailer from 'nodemailer';
import utils from "../utils.js";

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
    const tableRows = utils.generateTableRows(orderData.validatedItems);

    await transporter.sendMail({
        from: `"Prometheus Labs" <${process.env.MAIL_USER}>`,
        to: orderData.guest_email,
        subject: 'Thank you for your order! - Prometheus Labs',
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
            
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #edf2f7;">
                <h1 style="margin: 0 0 5px 0; font-size: 26px; color: #1a202c; font-weight: 700;">Hi ${orderData.guest_name},</h1>
                <h2 style="color: #e67e22; margin: 0; font-size: 20px; letter-spacing: 2px; font-weight: 800;">THANK YOU FOR YOUR PURCHASE</h2>
            </div>
            
            <p style="font-size: 16px; color: #4a5568; line-height: 1.5; margin-bottom: 25px;">Your order has been successfully processed and is being prepared in our laboratories.</p>
            
            <div style="font-size: 15px; font-style: italic; color: #4a5568; background-color: #fffaf0; border-left: 4px solid #e67e22; padding: 16px; margin-bottom: 30px; border-radius: 0 8px 8px 0; line-height: 1.6; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <strong style="color: #dd6b20; font-size: 16px; display: block; margin-bottom: 5px; font-style: normal; letter-spacing: 0.5px;">Welcome to the Elite, ${orderData.guest_name}.</strong>
                We want to remind you that the formulas we crafted for you are merely tools. The real superpowers—your determination, your drive, and your uniqueness—are already inside you.<br>
                Unlocking your true potential is a choice only an elite few dare to make. Thank you for choosing Prometheus Labs to accompany you on this journey. <strong>You are the extraordinary force here. ⚡</strong>
            </div>
            
            <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #edf2f7;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span style="font-size: 16px; font-weight: bold; color: #1a202c;">Order Details</span>
                    <span style="font-size: 14px; color: #718096; font-family: monospace;">ID: #${orderData.orderId}</span>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: left; font-weight: bold; color: #2d3748; font-size: 14px;">Product</th>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: center; font-weight: bold; color: #2d3748; font-size: 14px;">Qty</th>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: right; font-weight: bold; color: #2d3748; font-size: 14px;">Price</th>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: right; font-weight: bold; color: #2d3748; font-size: 14px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 18px; color: #1a202c; font-weight: 700;">
                        Order Total: <span style="color: #e67e22; font-size: 22px; margin-left: 10px;">€${Number(orderData.total_amount).toFixed(2)}</span>
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 35px; background: linear-gradient(90deg, #fff, #fffaf0, #fff); padding: 10px; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #2d3748;">Your superpowers are on their way! 🚀</p>
            </div>
            
            <div style="border: 1px dashed #cbd5e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
                <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; color: #718096; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Shipping Destination</h3>
                
                <table style="width: 100%; font-size: 14px; color: #4a5568; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; width: 120px; color: #718096;">Full Name:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.guest_name} ${orderData.guest_surname}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">Address:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.address}, ${orderData.house_number}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">City/Country:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.city}, ${orderData.country}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">Phone:</td>
                        <td style="padding: 4px 0; color: #1a202c; font-family: monospace;">${orderData.phone_number}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">Email:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.guest_email}</td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #edf2f7; font-size: 13px; color: #a0aec0;">
                <p style="margin: 0; font-weight: 600; color: #4a5568;">Prometheus Labs Team</p>
                <p style="margin: 5px 0 0 0;">Next-Gen Bio-Enhancements</p>
            </div>
        </div>
        `
    });
};

// Funzione per inviare email all'admmin dopo l'ordine
const sendAdminEmail = async (orderData) => {
    const tableRows = utils.generateTableRows(orderData.validatedItems);
    
    await transporter.sendMail({
        from: `"Prometheus Labs" <${process.env.MAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'New order received! - Prometheus Labs',
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
            
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #edf2f7;">
                <h1 style="margin: 0 0 5px 0; font-size: 24px; color: #1a202c; font-weight: 700;">New Order Received</h1>
                <p style="margin: 0; color: #718096; font-size: 14px;">An incoming order requires processing.</p>
            </div>
            
            <p style="font-size: 16px; color: #4a5568; line-height: 1.5; margin-bottom: 25px;">
                <strong>Customer:</strong> ${orderData.guest_name} ${orderData.guest_surname}<br>
                <strong>Account Email:</strong> ${orderData.guest_email}
            </p>
            
            <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #edf2f7;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <tr>
                        <td style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: bold; color: #1a202c; padding: 0 0 10px 0;">
                            Items Summary
                        </td>
                        <td style="font-family: monospace; font-size: 14px; color: #718096; text-align: right; padding: 0 0 10px 0;">
                            ID: #${orderData.orderId}
                        </td>
                    </tr>
                </table>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: center; font-weight: bold; color: #2d3748; font-size: 14px;">Product</th>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: center; font-weight: bold; color: #2d3748; font-size: 14px;">Qty</th>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: center; font-weight: bold; color: #2d3748; font-size: 14px;">Price</th>
                            <th style="border: 1px solid #e2e8f0; padding: 10px; background-color: #edf2f7; text-align: center; font-weight: bold; color: #2d3748; font-size: 14px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 18px; color: #1a202c; font-weight: 700;">
                        Total Revenue: <span style="color: #2d3748; font-size: 22px; margin-left: 10px;">€${Number(orderData.total_amount).toFixed(2)}</span>
                    </p>
                </div>
            </div>
            
            <div style="border: 1px dashed #cbd5e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
                <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; color: #718096; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Shipping Details</h3>
                
                <table style="width: 100%; font-size: 14px; color: #4a5568; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; width: 120px; color: #718096;">Full Name:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.guest_name} ${orderData.guest_surname}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">Address:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.address}, ${orderData.house_number}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">City/Country:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.city}, ${orderData.country}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">Phone:</td>
                        <td style="padding: 4px 0; color: #1a202c; font-family: monospace;">${orderData.phone_number}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #718096;">Email:</td>
                        <td style="padding: 4px 0; color: #1a202c;">${orderData.guest_email}</td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #edf2f7; font-size: 13px; color: #a0aec0;">
                <p style="margin: 0; font-weight: 600; color: #4a5568;">Prometheus Labs Automated Notification</p>
                <p style="margin: 5px 0 0 0;">Internal Fulfillment System</p>
            </div>
        </div>
        `
    });
};

export { transporter, sendUserEmail, sendAdminEmail };