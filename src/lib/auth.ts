import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/dbConnect";

async function createAuth() {
    const client = await clientPromise;
    const db = client.db("240academy");
    
    return betterAuth({
        database: mongodbAdapter(db),
        user: {
            additionalFields: {
                phone: {
                    type: "string",
                    required: false,
                },
                surname: {
                    type: "string",
                    required: false,
                },
                role: {
                    type: "string",
                    required: false,
                    defaultValue: "user",
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
                generateId: () => {
                    // Используем Web Crypto API вместо Node.js crypto
                    if (typeof window !== 'undefined') {
                        return crypto.randomUUID();
                    }
                    // Fallback для серверной стороны
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                },
            },
        },
    });
}

export const auth = await createAuth();