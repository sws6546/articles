import { db } from '$lib/server/db/index.js';
import { admin } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import nodemailer from "nodemailer";
import { ADMIN_EMAIL, SMTP_EMAIL, SMTP_PASSWORD } from '$env/static/private';
import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://localhost:6379',
})
await redisClient.connect();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
    },
});

async function sendMail(to: string, text: string, subject: string) {
    await transporter.sendMail({
        from: SMTP_EMAIL,
        to,
        subject,
        text,
    });
}

async function setCodeForMailInRedis(mail: string, code: string) {
    await redisClient.set(mail, code)
    await redisClient.expire(mail, 600)
}

async function existAdminWithEmail(email: string) {
    if (email === ADMIN_EMAIL) {
        return true
    }

    const isEmailExist = (await db.select().from(admin).where(eq(admin.email, email)).execute()).length > 0;
    if (isEmailExist) {
        return true
    }

    return false
}

export async function POST({ request, cookies }) {
    let email = ""
    try {
        email = (await request.json()).email;
    }
    catch (error) {
        return json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!await existAdminWithEmail(email)) {
        return json({ error: 'Email not found' }, { status: 404 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await setCodeForMailInRedis(email, code);
    await sendMail(email, `Your verification code is ${code}`, 'Verify your email');

    return json({message: "Success. Now type the code you received in your email."}, {status: 200})
}