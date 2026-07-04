document.addEventListener('DOMContentLoaded', function() {
    const inputUrl = document.getElementById('inputUrl');
    const convertBtn = document.getElementById('convertBtn');
    const resultCard = document.getElementById('resultCard');
    const previewImg = document.getElementById('previewImg');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const goBtn = document.getElementById('goBtn');

    let currentNewUrl = '';

    // 核心替换逻辑
    function convertUrl(url) {
        const currentOrigin = window.location.origin;
        return url.replace('https://i.pximg.net/', currentOrigin + '/');
    }

    function handleConvert() {
        const originalUrl = inputUrl.value.trim();
        
        if (!originalUrl.includes('i.pximg.net')) {
            alert('请确保输入包含 i.pximg.net 的链接');
            return;
        }

        currentNewUrl = convertUrl(originalUrl);
        
        previewImg.src = currentNewUrl;
        resultCard.hidden = false; // 使用 hidden 属性替代 style.display
        copyText.textContent = '复制链接';

        // 更新浏览器 URL，利于搜索引擎抓取独立页面
        const urlParams = new URLSearchParams();
        urlParams.set('img', originalUrl);
        window.history.pushState({url: currentNewUrl}, '', '?' + urlParams.toString());
    }

    // 页面加载时检查 URL 参数，支持直接通过链接访问
    function checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const imgParam = params.get('img');
        if (imgParam && imgParam.includes('i.pximg.net')) {
            inputUrl.value = imgParam;
            handleConvert();
        }
    }

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentNewUrl).then(() => {
            copyText.textContent = '已复制！';
            setTimeout(() => copyText.textContent = '复制链接', 2000);
        }).catch(() => {
            alert('复制失败，请手动复制');
        });
    });

    goBtn.addEventListener('click', () => {
        window.open(currentNewUrl, '_blank', 'noopener,noreferrer');
    });

    convertBtn.addEventListener('click', handleConvert);
    inputUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConvert();
    });

    // 初始化检查
    checkUrlParams();
});