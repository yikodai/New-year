// 导入必要的模块
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// 创建Express应用
const app = express();

// 设置端口
const PORT = process.env.PORT || 3000;

// 配置中间件
app.use(bodyParser.json()); // 解析JSON请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码的请求体

// 配置静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data', 'blessings.json');

// API路由：获取所有祝福
app.get('/api/blessings', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('读取数据文件失败:', err);
            res.status(500).json({ success: false, message: '读取数据失败' });
            return;
        }
        
        try {
            const blessings = JSON.parse(data);
            res.json({ success: true, blessings: blessings });
        } catch (parseErr) {
            console.error('解析JSON失败:', parseErr);
            res.status(500).json({ success: false, message: '数据格式错误' });
        }
    });
});

// API路由：提交新祝福
app.post('/api/blessings', (req, res) => {
    const newBlessing = req.body;
    
    // 验证数据
    if (!newBlessing.name || !newBlessing.content) {
        return res.status(400).json({ success: false, message: '缺少必要字段' });
    }
    
    if (newBlessing.name.length > 20) {
        return res.status(400).json({ success: false, message: '名字不能超过20个字符' });
    }
    
    if (newBlessing.content.length > 200) {
        return res.status(400).json({ success: false, message: '祝福内容不能超过200个字符' });
    }
    
    // 读取现有数据
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('读取数据文件失败:', err);
            return res.status(500).json({ success: false, message: '服务器错误' });
        }
        
        let blessings;
        try {
            blessings = JSON.parse(data);
        } catch (parseErr) {
            console.error('解析JSON失败:', parseErr);
            blessings = [];
        }
        
        // 添加新祝福
        blessings.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // 生成唯一ID
            name: newBlessing.name,
            content: newBlessing.content,
            timestamp: newBlessing.timestamp || new Date().toISOString()
        });
        
        // 写入文件
        fs.writeFile(DATA_FILE, JSON.stringify(blessings, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('写入数据文件失败:', writeErr);
                return res.status(500).json({ success: false, message: '保存祝福失败' });
            }
            
            res.json({ success: true, message: '祝福提交成功' });
        });
    });
});

// 视频页面路由（处理YouTube嵌入）
app.get('/videos/:videoId', (req, res) => {
    const videoId = req.params.videoId;
    res.json({ success: true, videoUrl: `https://www.youtube.com/embed/${videoId}` });
});

// 主页面路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 其他页面路由（确保刷新页面时能正确加载）
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.path === '/' ? 'index.html' : req.path));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🎉 跨年祝福网站服务器已启动！`);
    console.log(`📦 数据文件路径: ${DATA_FILE}`);
    console.log(`🌐 访问地址: http://localhost:${PORT}`);
    console.log(`📝 写祝福: http://localhost:${PORT}/write.html`);
    console.log(`👀 看祝福: http://localhost:${PORT}/view.html`);
    console.log(`🎬 看视频: http://localhost:${PORT}/video.html`);
    console.log(`\n按 Ctrl+C 停止服务器`);
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
});