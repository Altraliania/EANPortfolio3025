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
                error: "Please fill out all fields."
            });
        }

const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: ["emanuel.negussie@gmail.com"],
    subject: `New message from ${name}`,
    replyTo: email,
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
`
});

        if (error) {
            console.error("Resend error:", error);

            return res.status(500).json({
                error: error.message || "Resend failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            error: error.message || "Internal server error"
        });
    }
}