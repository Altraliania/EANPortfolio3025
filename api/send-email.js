import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    const { name, email, message } = req.body;

    try {
        await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: "emanuel.negussie@gmail.com",
            subject: `New message from ${name}`,
            html: `
                <h2>New Portfolio Contact</h2>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>${message}</p>
            `
        });

        res.status(200).json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
    }
}