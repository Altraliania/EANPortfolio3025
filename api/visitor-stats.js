import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ACTIVE_WINDOW = 60;

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

    try {

        const now = Date.now();

        const totalVisitors =
            Number(
                await redis.get(
                    "portfolio:total-visitors"
                )
            ) || 0;

        const keys =
            await redis.scan(
                0,
                {
                    match: "portfolio:active:*",
                    count: 1000
                }
            );

        const activeKeys =
            keys[1] || [];

        let onlineVisitors = 0;

        if (activeKeys.length > 0) {

            const timestamps =
                await redis.mget(
                    ...activeKeys
                );

            for (
                const timestamp
                of timestamps
            ) {

                if (!timestamp) {
                    continue;
                }

                const difference =
                    now -
                    Number(timestamp);

                if (
                    difference <=
                    ACTIVE_WINDOW * 1000
                ) {

                    onlineVisitors++;

                }

            }

        }

        return Response.json({

            success: true,

            onlineVisitors,

            totalVisitors,

            updatedAt: now

        });

    } catch (error) {

        console.error(
            "Stats error:",
            error
        );

        return Response.json(
            {
                success: false,
                error: "Could not load visitor statistics"
            },
            {
                status: 500
            }
        );
    }
}