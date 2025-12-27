// 倒计时功能实现
function initCountdown() {
    // 设置目标时间为2026年1月1日00:00:00
    const targetDate = new Date('2026-01-01T00:00:00').getTime();
    
    // 获取DOM元素
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // 更新倒计时函数
    function updateCountdown() {
        // 获取当前时间
        const now = new Date().getTime();
        
        // 计算剩余时间
        const distance = targetDate - now;
        
        // 时间计算
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // 更新DOM元素
        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
        
        // 如果倒计时结束
        if (distance < 0) {
            clearInterval(interval);
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            document.querySelector('h1').textContent = '新年快乐！';
        }
    }
    
    // 初始调用一次
    updateCountdown();
    
    // 每秒更新一次
    const interval = setInterval(updateCountdown, 1000);
}

// 音乐控制功能实现
function initMusicControl() {
    const audio = document.getElementById('backgroundMusic');
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = document.getElementById('musicIcon');
    const musicFileName = '神女劈观.m4a';
    const storageKey = `music_position_${musicFileName}`;
    
    // 从localStorage恢复播放位置
    function restorePlayPosition() {
        const savedPosition = localStorage.getItem(storageKey);
        if (savedPosition) {
            audio.currentTime = parseFloat(savedPosition);
        }
    }
    
    // 保存播放位置到localStorage
    function savePlayPosition() {
        localStorage.setItem(storageKey, audio.currentTime.toString());
    }
    
    // 尝试自动播放音乐
    function tryAutoPlay() {
        // 先恢复播放位置
        restorePlayPosition();
        
        audio.play().catch(error => {
            console.log('自动播放失败，等待用户交互后手动播放:', error);
            musicIcon.textContent = '🔊';
        });
    }
    
    // 点击按钮控制音乐播放/暂停
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            // 恢复播放位置
            restorePlayPosition();
            
            audio.play().then(() => {
                musicIcon.textContent = '🔊';
            }).catch(error => {
                console.log('播放失败:', error);
            });
        } else {
            // 暂停前保存播放位置
            savePlayPosition();
            audio.pause();
            musicIcon.textContent = '🔇';
        }
    });
    
    // 页面加载时尝试自动播放
    document.addEventListener('DOMContentLoaded', () => {
        // 现代浏览器要求用户交互后才能播放音频，所以我们尝试播放
        tryAutoPlay();
        
        // 如果自动播放失败，添加点击事件监听器，用户点击页面任意位置时播放
        document.addEventListener('click', () => {
            if (audio.paused) {
                tryAutoPlay();
            }
        }, { once: true });
    });
    
    // 音乐播放结束时清除保存的位置
    audio.addEventListener('ended', () => {
        localStorage.removeItem(storageKey);
    });
}

// 页面加载完成后初始化功能
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initMusicControl();
});