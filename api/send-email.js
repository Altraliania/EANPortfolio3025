import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const { name, email, message } = req.body || {};

        // Check form fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: "Please fill out all fields."
            });
        }

        // Send email through Resend
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: ["negussiegamer@gmail.com"],
            subject: `New message from ${name}`,
            text: `
Name: ${name}

Email: ${email}

Message:
${message}
            `
        });

        // Resend returned an error
        if (error) {
            console.error("RESEND ERROR:", error);

            return res.status(500).json({
                success: false,
                error: error.message || "Resend failed"
            });
        }

        // Success
        console.log("EMAIL SENT:", data);

        return res.status(200).json({
            success: true,
            message: "Email sent successfully!",
            data: data
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);

        return res.status(500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
}