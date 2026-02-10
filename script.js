// 网站数据 - 从配置文件加载
let websiteData = {};

class NavigationSite {
    constructor() {
        this.data = {};
        this.currentTab = 0;
        this.currentSearchEngine = 'google';
        this.searchEngines = {}; // 将从配置文件加载
        this.init();
    }

    async init() {
        try {
            // 加载配置文件
            await this.loadConfig();
            console.log('配置文件加载成功');
        } catch (error) {
            console.error('配置文件加载失败:', error.message);
            // 显示错误信息给用户
            this.showError('配置文件加载失败，请检查 config.json 和 content.json 文件是否存在且格式正确。');
            return;
        }
        
        this.initClock();
        this.renderTabs();
        this.renderSites();
        this.bindEvents();
        this.initAiChat();
        
        // 恢复上次选中的标签页
        this.restoreActiveTab();
        
        this.updateBackground();
        this.updateFavicon();
        this.updateTitle();
    }

    async loadConfig() {
        try {
            // 添加时间戳防止缓存
            const timestamp = new Date().getTime();
            
            // 同时加载基础配置和内容配置
            const [configResponse, contentResponse] = await Promise.all([
                fetch(`./config.json?t=${timestamp}`),
                fetch(`./content.json?t=${timestamp}`)
            ]);
            
            if (!configResponse.ok) {
                throw new Error(`配置文件加载失败! status: ${configResponse.status}`);
            }
            if (!contentResponse.ok) {
                throw new Error(`内容文件加载失败! status: ${contentResponse.status}`);
            }
            
            const config = await configResponse.json();
            const content = await contentResponse.json();
            
            // 合并配置
            this.data = {
                ...config,
                content: content
            };
            
            // 加载搜索引擎配置
            this.loadSearchEngines();
        } catch (error) {
            console.error('加载配置文件失败:', error);
            throw error;
        }
    }

    // 加载搜索引擎配置
    loadSearchEngines() {
        if (this.data.searchEngines && Array.isArray(this.data.searchEngines)) {
            this.searchEngines = {};
            this.data.searchEngines.forEach((engine, index) => {
                // 只加载启用的搜索引擎
                if (engine.use !== false) {
                    const key = engine.label.toLowerCase().replace(/\s+/g, '');
                    this.searchEngines[key] = {
                        name: engine.label,
                        url: engine.link,
                        icon: engine.icon
                    };
                    
                    // 设置第一个启用的搜索引擎为默认
                    if (Object.keys(this.searchEngines).length === 1) {
                        this.currentSearchEngine = key;
                    }
                }
            });
        } else {
            // 如果配置文件中没有搜索引擎配置，使用默认配置
            this.searchEngines = {
                google: {
                    name: 'Google',
                    url: 'https://www.google.com/search?q=',
                    icon: './icons/google.svg'
                },
                baidu: {
                    name: '百度',
                    url: 'https://www.baidu.com/s?wd=',
                    icon: './icons/baidu.svg'
                },
                bing: {
                    name: 'Bing',
                    url: 'https://www.bing.com/search?q=',
                    icon: './icons/bing.svg'
                }
            };
            this.currentSearchEngine = 'google';
        }
        
        // 渲染搜索引擎下拉菜单
        this.renderSearchEngines();
    }

    // 渲染搜索引擎下拉菜单
    renderSearchEngines() {
        const searchEnginesDropdown = document.getElementById('searchEngines');
        if (searchEnginesDropdown) {
            searchEnginesDropdown.innerHTML = Object.keys(this.searchEngines).map(key => {
                const engine = this.searchEngines[key];
                return `
                    <div class="search-engine-option" data-engine="${key}">
                        <img src="${engine.icon}" alt="${engine.name}">
                        <span>${engine.name}</span>
                    </div>
                `;
            }).join('');
        }
        
        // 恢复上次选择的搜索引擎
        this.restoreSearchEngine();
    }

    // 恢复上次选择的搜索引擎
    restoreSearchEngine() {
        const savedEngine = localStorage.getItem('currentSearchEngine');
        let engineKey = this.currentSearchEngine; // 使用默认搜索引擎
        
        if (savedEngine && this.searchEngines[savedEngine]) {
            engineKey = savedEngine;
        }
        
        this.setSearchEngine(engineKey);
    }

    // 初始化AI对话框
    initAiChat() {
        const aiChatTrigger = document.getElementById('aiChatTrigger');
        const aiChatConfig = this.data.aiChat;
        
        // 检查是否启用AI对话框
        if (!aiChatConfig || !aiChatConfig.enabled) {
            if (aiChatTrigger) {
                aiChatTrigger.classList.remove('show');
            }
            return;
        }
        
        // 显示AI对话框按钮
        if (aiChatTrigger) {
            aiChatTrigger.classList.add('show');
        }
        
        // 设置AI对话框标题
        const aiChatHeader = document.querySelector('.ai-chat-header h3');
        if (aiChatHeader && aiChatConfig.title) {
            aiChatHeader.textContent = aiChatConfig.title;
        }
        
        // 设置按钮标题
        const aiChatTriggerSpan = aiChatTrigger.querySelector('span');
        if (aiChatTriggerSpan && aiChatConfig.title) {
            aiChatTriggerSpan.textContent = aiChatConfig.title;
        }
        
        // 设置按钮图标
        this.setAiChatIcon(aiChatConfig);
        
        // 应用窗口配置
        this.applyWindowConfig(aiChatConfig);
        
        // 绑定AI对话框事件
        this.bindAiChatEvents();
    }

    // 设置AI对话框按钮图标
    setAiChatIcon(aiChatConfig) {
        const aiChatIcon = document.getElementById('aiChatIcon');
        if (!aiChatIcon) return;
        
        const iconPath = aiChatConfig.icon;
        
        if (iconPath) {
            // 使用配置的图标路径
            aiChatIcon.innerHTML = `<img src="${iconPath}" alt="AI对话" onerror="this.style.display='none'">`;
        } else {
            // 如果没有配置图标，隐藏图标容器
            aiChatIcon.style.display = 'none';
        }
    }

    // 应用窗口配置
    applyWindowConfig(aiChatConfig) {
        const aiChatContainer = document.getElementById('aiChatContainer');
        if (!aiChatContainer) return;
        
        // 默认窗口配置
        const defaultConfig = {
            width: 1024,
            height: 768,
            position: 'left-center',
            minWidth: 300,
            minHeight: 400
        };
        
        // 合并用户配置
        const windowConfig = { ...defaultConfig, ...(aiChatConfig.window || {}) };
        
        // 计算实际尺寸（不超过屏幕90%）
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        const width = Math.min(windowConfig.width, maxWidth);
        const height = Math.min(windowConfig.height, maxHeight);
        
        // 设置尺寸
        aiChatContainer.style.width = width + 'px';
        aiChatContainer.style.height = height + 'px';
        aiChatContainer.style.minWidth = windowConfig.minWidth + 'px';
        aiChatContainer.style.minHeight = windowConfig.minHeight + 'px';
        aiChatContainer.style.maxWidth = maxWidth + 'px';
        aiChatContainer.style.maxHeight = maxHeight + 'px';
        
        // 设置位置
        this.setWindowPosition(aiChatContainer, windowConfig.position, width, height);
    }

    // 设置窗口位置
    setWindowPosition(container, position, width, height) {
        const margin = 20;
        
        switch (position) {
            case 'left-center':
                container.style.left = margin + 'px';
                container.style.top = '50%';
                container.style.transform = 'translateY(-50%)';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
                break;
            case 'right-center':
                container.style.right = margin + 'px';
                container.style.top = '50%';
                container.style.transform = 'translateY(-50%)';
                container.style.left = 'auto';
                container.style.bottom = 'auto';
                break;
            case 'center':
                container.style.left = '50%';
                container.style.top = '50%';
                container.style.transform = 'translate(-50%, -50%)';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
                break;
            case 'top-left':
                container.style.left = margin + 'px';
                container.style.top = margin + 'px';
                container.style.transform = 'none';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
                break;
            case 'top-right':
                container.style.right = margin + 'px';
                container.style.top = margin + 'px';
                container.style.transform = 'none';
                container.style.left = 'auto';
                container.style.bottom = 'auto';
                break;
            case 'bottom-left':
                container.style.left = margin + 'px';
                container.style.bottom = margin + 'px';
                container.style.transform = 'none';
                container.style.right = 'auto';
                container.style.top = 'auto';
                break;
            case 'bottom-right':
                container.style.right = margin + 'px';
                container.style.bottom = margin + 'px';
                container.style.transform = 'none';
                container.style.left = 'auto';
                container.style.top = 'auto';
                break;
            default:
                // 默认左侧居中
                container.style.left = margin + 'px';
                container.style.top = '50%';
                container.style.transform = 'translateY(-50%)';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
        }
    }

    // 绑定AI对话框事件
    bindAiChatEvents() {
        const aiChatTrigger = document.getElementById('aiChatTrigger');
        const aiChatModal = document.getElementById('aiChatModal');
        const aiChatContainer = document.getElementById('aiChatContainer');
        const aiChatClose = document.getElementById('aiChatClose');
        const aiChatMaximize = document.getElementById('aiChatMaximize');
        const aiChatFrame = document.getElementById('aiChatFrame');
        const aiChatHeader = document.querySelector('.ai-chat-header');
        
        if (!aiChatTrigger || !aiChatModal || !aiChatContainer) {
            return;
        }
        
        let isMaximized = false;
        let isDragging = false;
        let isResizing = false;
        let dragOffset = { x: 0, y: 0 };
        let resizeStartSize = { width: 0, height: 0 };
        let resizeStartPos = { x: 0, y: 0 };
        
        // 拖拽处理函数
        const handleMouseMove = (e) => {
            if (isDragging && !isMaximized) {
                e.preventDefault();
                
                const x = e.clientX - dragOffset.x;
                const y = e.clientY - dragOffset.y;
                
                // 限制拖拽范围
                const maxX = window.innerWidth - aiChatContainer.offsetWidth;
                const maxY = window.innerHeight - aiChatContainer.offsetHeight;
                
                const constrainedX = Math.max(0, Math.min(x, maxX));
                const constrainedY = Math.max(0, Math.min(y, maxY));
                
                aiChatContainer.style.left = constrainedX + 'px';
                aiChatContainer.style.top = constrainedY + 'px';
                aiChatContainer.style.right = 'auto';
                aiChatContainer.style.bottom = 'auto';
                aiChatContainer.style.transform = 'none';
            } else if (isResizing && !isMaximized) {
                e.preventDefault();
                
                const deltaX = e.clientX - resizeStartPos.x;
                const deltaY = e.clientY - resizeStartPos.y;
                
                const newWidth = Math.max(300, resizeStartSize.width + deltaX);
                const newHeight = Math.max(400, resizeStartSize.height + deltaY);
                
                // 限制最大尺寸
                const maxWidth = window.innerWidth * 0.9;
                const maxHeight = window.innerHeight * 0.9;
                
                const constrainedWidth = Math.min(newWidth, maxWidth);
                const constrainedHeight = Math.min(newHeight, maxHeight);
                
                aiChatContainer.style.width = constrainedWidth + 'px';
                aiChatContainer.style.height = constrainedHeight + 'px';
            }
        };
        
        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                aiChatContainer.style.transition = '';
                if (aiChatHeader) {
                    aiChatHeader.style.cursor = 'move';
                }
                document.body.style.userSelect = '';
            }
            
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
            
            // 移除事件监听器
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        // 打开AI对话框
        aiChatTrigger.addEventListener('click', () => {
            const aiChatConfig = this.data.aiChat;
            if (aiChatConfig && aiChatConfig.url) {
                // 设置iframe源地址
                aiChatFrame.src = aiChatConfig.url;
                // 显示模态窗口
                aiChatModal.classList.add('show');
                // 重置窗口状态
                aiChatContainer.classList.remove('maximized');
                isMaximized = false;
                isDragging = false; // 确保拖拽状态重置
                isResizing = false; // 确保缩放状态重置
                
                // 重置按钮状态
                if (aiChatMaximize) {
                    aiChatMaximize.textContent = '□';
                    aiChatMaximize.title = '最大化';
                }
                
                // 重新应用窗口配置
                this.applyWindowConfig(aiChatConfig);
            }
        });
        
        // 关闭AI对话框
        const closeAiChat = () => {
            aiChatModal.classList.remove('show');
            // 清理所有状态
            isDragging = false;
            isResizing = false;
            if (aiChatHeader) {
                aiChatHeader.style.cursor = 'move';
            }
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            // 移除可能残留的事件监听器
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            // 清空iframe源地址以停止加载
            setTimeout(() => {
                if (!aiChatModal.classList.contains('show')) {
                    aiChatFrame.src = '';
                }
            }, 300);
        };
        
        // 最大化/还原
        if (aiChatMaximize) {
            aiChatMaximize.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                isMaximized = !isMaximized;
                if (isMaximized) {
                    aiChatContainer.classList.add('maximized');
                    aiChatMaximize.textContent = '❐';
                    aiChatMaximize.title = '还原';
                } else {
                    aiChatContainer.classList.remove('maximized');
                    aiChatMaximize.textContent = '□';
                    aiChatMaximize.title = '最大化';
                    // 重新应用窗口配置
                    this.applyWindowConfig(this.data.aiChat);
                }
            });
        }
        
        // 点击关闭按钮
        if (aiChatClose) {
            aiChatClose.addEventListener('click', closeAiChat);
        }
        
        // 拖拽功能
        if (aiChatHeader) {
            aiChatHeader.addEventListener('mousedown', (e) => {
                // 只有点击标题栏空白区域才能拖拽，避免点击按钮时触发
                if (e.target !== aiChatHeader && e.target.tagName !== 'H3') {
                    return;
                }
                
                if (isMaximized) return;
                
                isDragging = true;
                const rect = aiChatContainer.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
                
                aiChatContainer.style.transition = 'none';
                aiChatHeader.style.cursor = 'grabbing';
                
                // 防止文本选择
                e.preventDefault();
                document.body.style.userSelect = 'none';
                
                // 添加事件监听器
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });
        }
        
        // 拖拽缩放功能
        const resizeHandle = document.querySelector('.ai-chat-resize-handle');
        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', (e) => {
                if (isMaximized) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                isResizing = true;
                const rect = aiChatContainer.getBoundingClientRect();
                resizeStartSize.width = rect.width;
                resizeStartSize.height = rect.height;
                resizeStartPos.x = e.clientX;
                resizeStartPos.y = e.clientY;
                
                document.body.style.cursor = 'se-resize';
                document.body.style.userSelect = 'none';
                
                // 添加事件监听器
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });
        }
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && aiChatModal.classList.contains('show')) {
                closeAiChat();
            }
        });
        
        // 双击标题栏最大化/还原
        if (aiChatHeader) {
            aiChatHeader.addEventListener('dblclick', (e) => {
                // 只有双击标题栏空白区域才触发
                if (e.target === aiChatHeader || e.target.tagName === 'H3') {
                    if (aiChatMaximize) {
                        aiChatMaximize.click();
                    }
                }
            });
        }
    }

    // 显示错误信息
    showError(message) {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                color: white;
                text-align: center;
                padding: 20px;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    max-width: 600px;
                ">
                    <h1 style="font-size: 2rem; margin-bottom: 20px;">⚠️ 配置文件错误</h1>
                    <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">${message}</p>
                    <p style="font-size: 1rem; opacity: 0.8;">
                        请确保 config.json 文件存在于网站根目录，并且格式正确。<br>
                        如果通过 file:// 协议访问，请使用 HTTP 服务器运行此网站。
                    </p>
                </div>
            </div>
        `;
    }

    // 初始化时钟
    initClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
        const dateStr = now.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
        
        document.getElementById('currentTime').textContent = timeStr;
        document.getElementById('currentDate').textContent = dateStr;
    }

    // 更新背景图片
    updateBackground() {
        const backgroundElement = document.querySelector('.background-image');
        if (this.data.backgroundImage) {
            backgroundElement.style.backgroundImage = `url('${this.data.backgroundImage}')`;
        }
    }

    // 更新网站图标
    updateFavicon() {
        if (this.data.favicon) {
            // 查找现有的favicon链接
            let faviconLink = document.querySelector('link[rel="icon"]') || 
                             document.querySelector('link[rel="shortcut icon"]');
            
            if (faviconLink) {
                // 更新现有的favicon
                faviconLink.href = this.data.favicon;
            } else {
                // 创建新的favicon链接
                faviconLink = document.createElement('link');
                faviconLink.rel = 'icon';
                faviconLink.href = this.data.favicon;
                document.head.appendChild(faviconLink);
            }
        }
    }

    // 更新网站标题
    updateTitle() {
        if (this.data.webTitle) {
            document.title = this.data.webTitle;
        }
    }

    renderTabs() {
        const tabButtons = document.getElementById('tabButtons');
        tabButtons.innerHTML = this.data.content.map((tab, index) => 
            `<button class="tab-button" data-tab="${index}">${tab.label}</button>`
        ).join('');
    }

    renderSites() {
        const sitesContainer = document.getElementById('sitesContainer');
        // 只显示当前标签页的内容，不再有搜索过滤功能
        const currentTabData = this.data.content[this.currentTab];
        sitesContainer.innerHTML = this.renderSiteCards(currentTabData.content);
    }

    renderSiteCards(sites) {
        return sites.map(site => {
            const iconHTML = this.getIconHTML(site.icon, site.label);
            const backgroundIconHTML = this.getBackgroundIconHTML(site.icon, site.label);
            return `
                <a href="${site.link}" class="site-card" target="_blank" rel="noopener noreferrer">
                    ${backgroundIconHTML}
                    <div class="site-card-content">
                        ${iconHTML}
                        <div class="site-title">${site.label}</div>
                    </div>
                </a>
            `;
        }).join('');
    }

    getIconHTML(iconUrl, label) {
        if (!iconUrl || iconUrl.includes('icon_error.svg')) {
            return `<div class="site-icon error">${label.charAt(0)}</div>`;
        }
        
        return `<img src="${iconUrl}" alt="${label}" class="site-icon" onerror="this.outerHTML='<div class=\\'site-icon error\\'>${label.charAt(0)}</div>'">`;
    }

    getBackgroundIconHTML(iconUrl, label) {
        if (!iconUrl || iconUrl.includes('icon_error.svg')) {
            return `<div class="site-card-bg-icon">${label.charAt(0)}</div>`;
        }
        
        return `<div class="site-card-bg-icon"><img src="${iconUrl}" alt="" onerror="this.parentElement.innerHTML='${label.charAt(0)}'"></div>`;
    }

    bindEvents() {
        // 标签页切换
        document.getElementById('tabButtons').addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                const tabIndex = parseInt(e.target.dataset.tab);
                this.setActiveTab(tabIndex);
            }
        });

        // 搜索引擎选择器
        const searchEngineSelector = document.getElementById('searchEngine');
        const searchEnginesDropdown = document.getElementById('searchEngines');
        
        if (searchEngineSelector && searchEnginesDropdown) {
            searchEngineSelector.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                searchEnginesDropdown.classList.toggle('show');
                searchEngineSelector.classList.toggle('active');
            });

            // 搜索引擎选项点击
            searchEnginesDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const option = e.target.closest('.search-engine-option');
                if (option) {
                    const engine = option.dataset.engine;
                    this.setSearchEngine(engine);
                    searchEnginesDropdown.classList.remove('show');
                    searchEngineSelector.classList.remove('active');
                }
            });

            // 点击其他地方关闭下拉菜单
            document.addEventListener('click', (e) => {
                const searchContainer = document.querySelector('.search-container');
                if (!searchContainer.contains(e.target)) {
                    searchEnginesDropdown.classList.remove('show');
                    searchEngineSelector.classList.remove('active');
                }
            });
        }

        // 搜索功能 - 使用搜索引擎搜索
        const searchInput = document.getElementById('searchInput');
        
        // 搜索提交 - 回车键搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (query) {
            const searchUrl = this.searchEngines[this.currentSearchEngine].url + encodeURIComponent(query);
            window.open(searchUrl, '_blank');
            // 可选：清空搜索框
            // searchInput.value = '';
        }
    }

    setSearchEngine(engine) {
        if (this.searchEngines[engine]) {
            this.currentSearchEngine = engine;
            
            // 保存当前选中的搜索引擎到localStorage
            localStorage.setItem('currentSearchEngine', engine);
            
            const engineData = this.searchEngines[engine];
            const searchIcon = document.getElementById('searchIcon');
            
            if (searchIcon) {
                searchIcon.src = engineData.icon;
                searchIcon.alt = engineData.name;
            }
            
            // 更新搜索框占位符
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.placeholder = `使用 ${engineData.name} 搜索...`;
            }
        }
    }

    // 恢复上次选中的标签页
    restoreActiveTab() {
        const savedTab = localStorage.getItem('activeTab');
        let tabIndex = 0; // 默认选中第一个标签页
        
        if (savedTab !== null) {
            const parsedTab = parseInt(savedTab);
            // 验证保存的标签页索引是否有效
            if (!isNaN(parsedTab) && parsedTab >= 0 && parsedTab < this.data.content.length) {
                tabIndex = parsedTab;
            }
        }
        
        this.setActiveTab(tabIndex);
    }

    setActiveTab(index) {
        this.currentTab = index;
        
        // 保存当前选中的标签页到localStorage
        localStorage.setItem('activeTab', index.toString());
        
        // 更新标签按钮状态
        document.querySelectorAll('.tab-button').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        
        // 重新渲染网站
        this.renderSites();
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredData = null;
            this.renderSites();
            return;
        }

        // 搜索所有标签页的内容
        const results = [];
        this.data.content.forEach((tab) => {
            const matchedSites = tab.content.filter(site => 
                site.label.toLowerCase().includes(query.toLowerCase())
            );
            
            if (matchedSites.length > 0) {
                results.push({
                    ...tab,
                    content: matchedSites
                });
            }
        });

        this.filteredData = results;
        this.renderSites();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new NavigationSite();
});