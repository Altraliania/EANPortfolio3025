import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(request) {

    if (request.method !== "GET") {
        return Response.json(
            {
                success: false,
                error: "Method not allowed"
            },
            {
                status: 405
            }
        );
    }

    const checkedAt = Date.now();

    let databaseStatus = "Offline";
    let analyticsStatus = "Offline";
    let visitorApiStatus = "Offline";

    try {

        await redis.set(
            "portfolio:health-check",
            checkedAt,
            {
                ex: 60
            }
        );

        databaseStatus = "Connected";

    } catch (error) {

        console.error(
            "Database health check failed:",
            error
        );

    }

    try {

        const visitorStats =
            await redis.get(
                "portfolio:total-visitors"
            );

        void visitorStats;

        visitorApiStatus = "Operational";
        analyticsStatus = "Tracking";

    } catch (error) {

        console.error(
            "Analytics health check failed:",
            error
        );

    }

    return Response.json({
        success: true,

        website: "Online",

        visitorApi:
            visitorApiStatus,

        database:
            databaseStatus,

        analytics:
            analyticsStatus,

        hosting:
            "Vercel",

        checkedAt

    });
}