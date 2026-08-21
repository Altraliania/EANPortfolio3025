import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = Redis.fromEnv();

const ACTIVE_WINDOW = 60;

function getClientIP(request) {
    const forwarded = request.headers.get("x-forwarded-for");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    return (
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

function hashIP(ip) {
    const secret =
        process.env.VISITOR_HASH_SECRET ||
        "change-this-secret";

    return crypto
        .createHash("sha256")
        .update(`${secret}:${ip}`)
        .digest("hex");
}

function getDayKey() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}

export default async function handler(request) {
    if (request.method !== "POST") {
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

    try {
        const ip = getClientIP(request);
        const visitorId = hashIP(ip);
        const day = getDayKey();
        const now = Date.now();

        const activeKey =
            `portfolio:active:${visitorId}`;

        const dailyKey =
            `portfolio:visitors:${day}`;

        await redis.set(
            activeKey,
            now,
            {
                ex: ACTIVE_WINDOW
            }
        );

        await redis.sadd(
            dailyKey,
            visitorId
        );

        await redis.expire(
            dailyKey,
            60 * 60 * 24 * 8
        );

        const dailyVisitors =
            await redis.scard(
                dailyKey
            );

        const previousTotal =
            Number(
                await redis.get(
                    "portfolio:total-visitors"
                )
            ) || 0;

        const visitorCountKey =
            `portfolio:counted:${day}:${visitorId}`;

        const alreadyCounted =
            await redis.exists(
                visitorCountKey
            );

        let totalVisitors =
            previousTotal;

        if (!alreadyCounted) {

            await redis.set(
                visitorCountKey,
                "1",
                {
                    ex: 60 * 60 * 24
                }
            );

            totalVisitors =
                await redis.incr(
                    "portfolio:total-visitors"
                );

        }

        return Response.json({
            success: true,
            dailyVisitors,
            totalVisitors,
            timestamp: now
        });

    } catch (error) {

        console.error(
            "Visitor tracking error:",
            error
        );

        return Response.json(
            {
                success: false,
                error: "Visitor tracking failed"
            },
            {
                status: 500
            }
        );
    }
}