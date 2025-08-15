import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const jwt = cookies.get("jwt");
    console.log(jwt)
    if (!jwt) {
        redirect(302, '/admin/login');
    }

}