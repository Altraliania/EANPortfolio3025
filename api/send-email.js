import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { name, email, message } = req.body;

        // Make sure all fields were provided
        if (!name || !email || !message) {
            return res.status(400).json({
                error: "Please fill out all fields."
            });
        }

        const { data, error } = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: ["emanuel.negussie@gmail.com"],
            subject: `New message from ${name}`,
            replyTo: email,
            html: `
                <h2>New Portfolio Contact</h2>

                <p><strong>Name:</strong> ${name}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Message:</strong></p>

                <p>${message}</p>
            `
        });

        if (error) {
            console.error("Resend error:", error);

            return res.status(500).json({
                error: "Failed to send email."
            });
        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            error: "Something went wrong."
        });
    }
}