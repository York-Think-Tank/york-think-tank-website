import { read } from '$app/server';
import favicon from '$lib/assets/favicon.ico';
import type { RequestHandler } from './$types';

// Served here instead of static/ because the static file server sends .ico with an empty Content-Type
export const GET: RequestHandler = () =>
	new Response(read(favicon).body, { headers: { 'Content-Type': 'image/x-icon' } });
