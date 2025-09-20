import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/dbConnect";

async function createAuth() {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "240-academy");
    
    return betterAuth({
        database: mongodbAdapter(db),
        user: {
            additionalFields: {
                phone: {
                    type: "string",
                    required: true,
                },
                surname: {
                    type: "string",
                    required: true,
                },
            },
        },
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7,
            updateAge: 60 * 60 * 24,
        },
        trustedOrigins: [process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"],
        advanced: {
            database: {
                generateId: () => crypto.randomUUID(),
            },
        },
    });
}

export const auth = await createAuth();