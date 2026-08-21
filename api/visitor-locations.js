import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const LOCATION_KEY = "portfolio:visitor-locations";
const LOCATION_TTL = 60 * 60 * 24 * 30;

function getClientIP(request) {
    const forwarded =
        request.headers.get("x-forwarded-for");

    if (forwarded) {
        return forwarded
            .split(",")[0]
            .trim();
    }

    return (
        request.headers.get("x-real-ip") ||
        request.headers.get("true-client-ip") ||
        "unknown"
    );
}

async function getLocationFromIP(ip) {
    const response =
        await fetch(
            `https://ipwho.is/${encodeURIComponent(ip)}`,
            {
                method: "GET",
                headers: {
                    "Accept":
                        "application/json"
                },
                cache: "no-store"
            }
        );

    if (!response.ok) {
        throw new Error(
            `Geolocation request failed: ${response.status}`
        );
    }

    const data =
        await response.json();

    if (
        !data ||
        data.success === false
    ) {
        throw new Error(
            "Location lookup failed"
        );
    }

    const latitude =
        Number(data.latitude);

    const longitude =
        Number(data.longitude);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error(
            "Invalid coordinates"
        );
    }

    return {
        latitude,
        longitude,
        country:
            data.country || "",
        countryCode:
            data.country_code || "",
        region:
            data.region || "",
        city:
            data.city || "",
        timestamp:
            Date.now()
    };
}

export default async function handler(request) {

    if (request.method === "POST") {

        try {

            const ip =
                getClientIP(request);

            if (
                !ip ||
                ip === "unknown" ||
                ip === "127.0.0.1"
            ) {
                return Response.json({
                    success: true,
                    tracked: false
                });
            }

            const location =
                await getLocationFromIP(ip);

            const locationId =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 10)}`;

            await redis.hset(
                LOCATION_KEY,
                {
                    [locationId]:
                        JSON.stringify(location)
                }
            );

            await redis.expire(
                LOCATION_KEY,
                LOCATION_TTL
            );

            return Response.json({
                success: true,
                tracked: true
            });

        } catch (error) {

            console.error(
                "Visitor location tracking error:",
                error
            );

            return Response.json(
                {
                    success: false,
                    error:
                        "Could not track visitor location"
                },
                {
                    status: 500
                }
            );
        }
    }

    if (request.method === "GET") {

        try {

            const stored =
                await redis.hgetall(
                    LOCATION_KEY
                );

            const locations = [];

            if (stored) {

                for (
                    const value of Object.values(
                        stored
                    )
                ) {

                    try {

                        const parsed =
                            typeof value === "string"
                                ? JSON.parse(value)
                                : value;

                        if (
                            parsed &&
                            Number.isFinite(
                                Number(
                                    parsed.latitude
                                )
                            ) &&
                            Number.isFinite(
                                Number(
                                    parsed.longitude
                                )
                            )
                        ) {

                            locations.push({
                                latitude:
                                    Number(
                                        parsed.latitude
                                    ),

                                longitude:
                                    Number(
                                        parsed.longitude
                                    ),

                                country:
                                    parsed.country || "",

                                countryCode:
                                    parsed.countryCode || "",

                                region:
                                    parsed.region || "",

                                city:
                                    parsed.city || "",

                                timestamp:
                                    Number(
                                        parsed.timestamp
                                    ) || 0
                            });

                        }

                    } catch {
                    }
                }
            }

            return Response.json({
                success: true,
                locations,
                count: locations.length
            });

        } catch (error) {

            console.error(
                "Visitor location retrieval error:",
                error
            );

            return Response.json(
                {
                    success: false,
                    error:
                        "Could not load visitor locations",
                    locations: []
                },
                {
                    status: 500
                }
            );
        }
    }

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