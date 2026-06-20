export async function onRequest(context) {
    const { request } = context;
    const targetHost = 'i.pximg.net';
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname + url.search, `https://${targetHost}`);
    const headers = new Headers(request.headers);
    headers.set('Host', targetHost);
    headers.set('Referer', 'https://www.pixiv.net/');
    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: request.body
        });
        const modifiedResponse = new Response(response.body, response);
        modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
        if (!modifiedResponse.headers.has('Cache-Control')) {
            modifiedResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        }
        return modifiedResponse;
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}