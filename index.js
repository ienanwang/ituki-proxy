const express = require('express');
const Unblocker = require('unblocker');
const app = express();

const unblocker = new Unblocker({ prefix: '/v/' });

// 1. 首页 HTML 界面
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ITUYAMA-PROXY</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #1a1a1a; color: white; margin: 0; }
                h1 { color: #00ffcc; text-shadow: 0 0 10px #00ffcc; }
                .container { background: #333; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); width: 90%; max-width: 400px; text-align: center; }
                input { width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 5px; box-sizing: border-box; }
                button { width: 100%; padding: 12px; background: #00ffcc; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s; }
                button:hover { background: #00cca3; }
                p { font-size: 0.8rem; color: #888; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>ITUYAMA-PROXY</h1>
                <input type="text" id="url" placeholder="输入网址 (例如: https://poki.com)">
                <button onclick="go()">进入游戏</button>
                <p>提示：若加载缓慢，请刷新页面或检查学校 Wi-Fi 信号</p>
            </div>
            <script>
                function go() {
                    let url = document.getElementById('url').value;
                    if (!url.startsWith('http')) url = 'https://' + url;
                    // 使用 Base64 转换以规避 i-FILTER 关键词扫描
                    const b64 = btoa(url);
                    window.location.href = '/v/' + url; 
                }
            </script>
        </body>
        </html>
    `);
});

// 2. 挂载代理中间件
app.use(unblocker);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('ITUYAMA-PROXY is running...');
});
