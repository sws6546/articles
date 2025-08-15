import { ADMIN_EMAIL, ADMIN_NAME, JWT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db/index.js';
import { admin } from '$lib/server/db/schema.js';
import { redisClient } from '$lib/server/redis/index.js';
import { json, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as jose from 'jose'

async function checkCodeInRedis(mail: string, code: string) {
    const storedCode = await redisClient.get(mail);
    return storedCode === code;
}

export async function POST({ request, cookies }) {
    let email = ""
    let code = ""
    try {
        ({ email, code } = await request.json());
    }
    catch (error) {
        return json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!email || !code) {
        return json({ error: 'Email and code are required' }, { status: 400 });
    }

    if (!await checkCodeInRedis(email, code)) {
        return json({ error: 'Invalid code' }, { status: 400 });
    }

    let token = ""

    if (email === ADMIN_EMAIL) {
        token = await new jose.SignJWT({ name: ADMIN_NAME, email })
            .setProtectedHeader({ alg: 'HS256' })
            .sign(new TextEncoder().encode(JWT_SECRET));
    }
    else {
        const adminData = await db.select().from(admin).where(eq(admin.email, email)).execute();
        if (adminData.length === 0) {
            return json({ error: 'Admin not found' }, { status: 404 });
        }
        token = await new jose.SignJWT({ name: adminData[0].name, email: adminData[0].email })
            .setProtectedHeader({ alg: 'HS256' })
            .sign(new TextEncoder().encode(JWT_SECRET));
    }

    cookies.set("jwt", token, { path: "/" });

    redirect(302, '/admin/panel');
}