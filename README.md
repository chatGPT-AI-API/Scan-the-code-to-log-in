# 扫码登录系统

## 功能概述
提供基于二维码的网页扫码登录解决方案，包含前端展示和后端验证模块

## 技术栈
- 前端：HTML/CSS/JavaScript + QRCode生成库
- 后端：Node.js + Express

## 快速启动
```bash
# 安装依赖
npm install

# 启动后端服务
node backend/server.js

# 访问前端页面
http://localhost:3000
```

## 功能特性
✅ 实时二维码生成与刷新
✅ 扫码状态轮询验证
✅ 跨设备登录状态同步

## 配置说明
1. 修改`backend/server.js`中的端口配置
2. 调整前端二维码刷新间隔参数

## 项目结构
```
├── backend/        # 后端服务
│   └── server.js   # Express服务入口
├── frontend/       # 前端页面
│   └── index.html  # 登录页
└── package.json    # 依赖配置
```