const express = require('express');
const QRCode = require('qrcode');
const Redis = require('ioredis');

class MockRedis {
  constructor() {
    this.store = new Map();
    this.on = () => this;
  }
  async connect() { return this }
  async setEx(key, ttl, value) {
    this.store.set(key, value);
    setTimeout(() => this.store.delete(key), ttl * 1000);
  }
  async get(key) {
    return this.store.get(key);
  }
}
const WebSocket = require('ws');

const app = express();
const port = 3000;
const redisClient = process.env.NODE_ENV === 'production' 
  ? new Redis(6379, 'redis-server') 
  : new MockRedis();
const wss = new WebSocket.Server({ port: 8080 });

// Redis连接初始化
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

// 生成二维码接口
app.get('/api/qrcode', async (req, res) => {
  const token = Math.random().toString(36).substr(2);
  const qrData = JSON.stringify({ 
    type: 'login',
    token: token,
    expires: Date.now() + 300000 // 5分钟有效
  });

  await redisClient.setEx(token, 300, 'pending');
  
  QRCode.toDataURL(qrData, (err, url) => {
    res.json({ qrcode: url, token });
  });
});

// WebSocket实时状态推送
wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const { token } = JSON.parse(message);
    const status = await redisClient.get(token);
    ws.send(JSON.stringify({ status }));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});