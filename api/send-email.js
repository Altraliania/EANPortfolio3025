import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

    // =========================
    // CORS
    // =========================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://altraliania.github.io"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // Browser preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }


    // Only allow POST
    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });

    }


    try {

        const {
            name,
            email,
            message
        } = req.body || {};


        // Validate
        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                error: "Please fill out all fields."
            });

        }


        console.log("Contact form received");
        console.log("Name:", name);
        console.log("Email:", email);


        // =========================
        // SEND EMAIL
        // =========================

        const {
            data,
            error
        } = await resend.emails.send({

            from: "onboarding@resend.dev",

            to: [
                "negussiegamer@gmail.com"
            ],

            subject:
                `New message from ${name}`,

            replyTo: email,

            text: `
Name: ${name}

Email: ${email}

Message:

${message}
`
        });


        // Resend error
        if (error) {

            console.error(
                "RESEND ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                error:
                    error.message ||
                    "Resend failed"
            });

        }


        console.log(
            "EMAIL SENT:",
            data
        );


        return res.status(200).json({

            success: true,

            message:
                "Email sent successfully!",

            data: data

        });


    } catch (error) {

        console.error(
            "SERVER ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                error.message ||
                "Internal server error"

        });

    }

}