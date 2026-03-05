const express = require('express');
const Unblocker = require('unblocker');
const app = express();

const unblocker = new Unblocker({ 
    prefix: '/v/',
    // 关键：处理 Poki 的子资源请求
    requestMiddleware: [
        (data) => {
            // 1. 强制伪装成日文浏览器，防止弹出中文提示
            data.headers['accept-language'] = 'ja-JP,ja;q=0.9';
            // 2. 伪装 User-Agent 为普通 ChromeOS 设备
            data.headers['user-agent'] = 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            
            // 3. 这里的逻辑可以尝试处理被 Base64 过的 URL (可选)
            try {
                if (!data.url.startsWith('http')) {
                    const decoded = Buffer.from(data.url, 'base64').toString();
                    if (decoded.startsWith('http')) data.url = decoded;
                }
            } catch(e) {}
        }
    ]
});

app.use(unblocker);

// 首页逻辑（建议修改标题伪装成学习网页）
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Drive - Google</title> <style>
                body { background: #1a1a1a; color: #444; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .box { background: #222; padding: 20px; border-radius: 8px; text-align: center; }
                input { padding: 10px; width: 250px; border-radius: 4px; border: 1px solid #444; background: #000; color: #fff; }
                button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="box">
                <input type="text" id="target" placeholder="https://poki.jp">
                <button onclick="launch()">Start</button>
            </div>
            <script>
                function launch() {
                    let url = document.getElementById('target').value || 'https://poki.jp';
                    if (!url.startsWith('http')) url = 'https://' + url;
                    // 跳转到代理路径
                    window.location.href = '/v/' + url;
                }
            </script>
        </body>
        </html>
    `);
});

const port = process.env.PORT || 8080;
app.listen(port);
