import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    try {
        const { name, email, message } = req.body;

        const { data, error } = await resend.emails.send({
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

        if (error) {
            console.error("Resend error:", error);

            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}