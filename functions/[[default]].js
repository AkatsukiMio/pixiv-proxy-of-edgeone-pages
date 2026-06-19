export async function onRequest(context) {
    const { request } = context;
    
    // 1. 直接写死目标域名
    const targetHost = 'i.pximg.net';
    
    // 2. 解析原始 URL，保留路径和参数
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname + url.search, `https://${targetHost}`);
    
    // 3. 构建请求头
    const headers = new Headers(request.headers);
    headers.set('Host', targetHost);
    headers.set('Referer', 'https://www.pixiv.net/');

    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: request.body
        });

        // 4. 返回响应并添加缓存头
        const modifiedResponse = new Response(response.body, response);
        modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
        
        // 设置长期缓存
        if (!modifiedResponse.headers.has('Cache-Control')) {
            modifiedResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        }

        return modifiedResponse;
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}