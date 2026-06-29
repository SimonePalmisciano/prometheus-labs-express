// Controller per la gestione della newsletter
import { sendNewsletterEmail } from "../utils_js/mailer/mailer.js";

const store = async (request, response) => {
    const { email } = request.body;

    // Controlla che l'email sia presente
    if (!email) {
        return response.status(400).json({ error: "Email is required" });
    }

    try {
        await sendNewsletterEmail(email);
        return response.status(200).json({ message: "Email inviata con successo" });
    } catch (error) {
        console.error("Errore invio newsletter:", error);
        return response.status(500).json({ error: "Errore interno del server" });
    }
};

const newsletterController = { store };

export default newsletterController;