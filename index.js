const express = require('express');
const Unblocker = require('unblocker');
const app = express();

// 1. 配置 Unblocker 
const unblocker = new Unblocker({ 
    prefix: '/v/',
    // 这里的中间件可以拦截并修改请求头
    requestMiddleware: [
        (data) => {
            // 强制伪装浏览器语言为日文
            data.headers['accept-language'] = 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7';
            // 伪装 User-Agent，看起来更像普通的 ChromeOS 访问
            data.headers['user-agent'] = 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        }
    ]
});

app.use(unblocker);

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ITUYAMA-PROXY</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #1a1a1a; color: white; margin: 0; }
                .container { background: #333; padding: 2rem; border-radius: 10px; width: 90%; max-width: 400px; text-align: center; }
                input { width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 5px; }
                button { width: 100%; padding: 12px; background: #00ffcc; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>ITUYAMA-PROXY</h1>
                <input type="text" id="url" placeholder="输入网址...">
                <button onclick="go()">START</button>
            </div>
            <script>
                function go() {
                    let val = document.getElementById('url').value || 'poki.com';
                    if (!val.startsWith('http')) val = 'https://' + val;
                    
                    // 强制在 URL 后面加上日文参数
                    let targetUrl = new URL(val);
                    targetUrl.searchParams.set('setLocale', 'ja-JP'); 
                    
                    // 关键：跳转时不要在地址栏暴露出 "poki.com"
                    // 如果 unblocker 支持处理经过编码的 URL，建议在此处进行 Base64 转换
                    window.location.href = '/v/' + targetUrl.href; 
                }
            </script>
        </body>
        </html>
    `);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Proxy Ready'));
