import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

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
            console.error(error);

            return res.status(500).json({
                error: "Resend failed to send the email"
            });
        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Server error"
        });
    }
}