# 7li7li导航站 v1.0

一个现代化的个人导航网站，完全基于配置文件驱动，支持多分类网站管理、搜索引擎切换、AI对话框、响应式布局等功能。

## ✨ 功能特点

- 🎨 **现代化设计** - 简洁美观的界面，支持背景图片和毛玻璃效果
- 📱 **响应式布局** - 完美适配桌面、平板、手机等各种设备
- 🔍 **多搜索引擎** - 支持百度、谷歌、必应等多个搜索引擎切换
- ⏰ **实时时钟** - 显示当前时间和日期
- 🤖 **AI对话框** - 支持嵌入AI助手，可拖拽、缩放的窗口化界面
- 📂 **分类管理** - 支持多个分类，每个分类可包含多个网站
- 🎯 **智能布局** - 每行最多5个卡片，少于5个时自动居中显示
- 🖼️ **背景图标** - 卡片右上角显示旋转的半透明背景图标
- 📝 **双行文字** - 支持网站名称双行显示，超出才使用省略号
- ⚙️ **配置驱动** - 所有内容通过 JSON 配置文件管理，无需修改代码
- 💾 **状态记忆** - 自动记住用户选择的标签页和搜索引擎
- 🚨 **错误提示** - 配置文件加载失败时显示友好的错误信息

## ⚠️ 重要说明

**本项目已升级为完全配置驱动架构**：
- ✅ 基础设置和网站内容通过配置文件管理
- ❌ 不再包含内置默认数据
- 🔧 配置文件是网站正常运行的必要条件
- 📋 提供完整的示例配置文件供参考

## 快速开始

### ⚠️ 重要提示

**首次使用必须创建配置文件**：本项目不包含 `config.json` 和 `content.json` 文件，需要从示例文件复制：

```bash
cp config.example.json config.json
cp content.example.json content.json
```

### 初始化配置文件

1. 复制示例配置文件：
   ```bash
   cp config.example.json config.json
   cp content.example.json content.json
   ```
2. 根据需要修改配置文件内容

### 方法一：HTTP 服务器运行（推荐）

1. 确保项目包含 `config.json` 和 `content.json` 配置文件
2. 启动 HTTP 服务器：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js
   npx serve .
   
   # 使用 PHP
   php -S localhost:8000
   ```
3. 在浏览器中访问 `http://localhost:8000`

### 方法二：直接打开（不推荐）

由于浏览器安全限制，直接打开 `index.html` 文件可能无法加载配置文件，会显示错误提示。

## 配置管理

### 📁 配置文件结构

项目使用两个配置文件：
- `config.json` - 基础设置（背景、搜索引擎、AI对话框、样式等）- 需要用户自定义
- `content.json` - 网站内容（分类和网站链接）- 需要用户自定义

**注意**：两个配置文件都需要从示例文件复制并自定义。

### 🤖 AI对话框配置

在 `config.json` 中可以配置AI对话框：

```json
{
  "aiChat": {
    "enabled": true,                           // 是否启用AI对话框
    "url": "https://chatgpt.com",              // AI网站URL
    "title": "AI对话",                         // 对话框标题
    "icon": "./icons/ai-icon.svg",             // 按钮图标路径
    "window": {
      "width": 1024,                          // 窗口宽度
      "height": 768,                          // 窗口高度
      "position": "left-center",              // 窗口位置
      "minWidth": 300,                        // 最小宽度
      "minHeight": 400                        // 最小高度
    }
  }
}
```

#### 窗口位置选项：
- `"left-center"` - 左侧居中（默认）
- `"right-center"` - 右侧居中
- `"center"` - 屏幕中央
- `"top-left"` - 左上角
- `"top-right"` - 右上角
- `"bottom-left"` - 左下角
- `"bottom-right"` - 右下角

#### 图标配置：
- 本地文件：`"./icons/ai-icon.svg"`
- 在线图片：`"https://example.com/icon.png"`
- 支持格式：SVG, PNG, JPG, ICO等

支持的AI网站示例：
- ChatGPT: `https://chatgpt.com`
- Claude: `https://claude.ai`
- 文心一言: `https://yiyan.baidu.com`
- 通义千问: `https://tongyi.aliyun.com`
- 自建AI服务: `https://your-ai-domain.com`

### 🎨 卡片样式特点

- **背景图标效果**：每个卡片右上角显示半透明的旋转背景图标
- **双行文字支持**：网站名称支持双行显示，超出两行才使用省略号
- **毛玻璃效果**：卡片背景采用半透明毛玻璃设计
- **悬停动画**：鼠标悬停时卡片上浮，背景图标放大
- **智能图标**：支持SVG/PNG图标，加载失败时显示首字母
### 📝 编辑配置文件

所有网站数据都存储在配置文件中，你可以：
- **创建新分类**: 在 `content.json` 中添加新的分类和网站列表
- **修改背景**: 更改 `config.json` 中的 `backgroundImage` 字段
- **删除网站**: 从配置文件中移除相应条目

### 🎨 添加新网站示例
在 `content.json` 中：
```json
{
  "label": "新网站",
  "link": "https://example.com",
  "icon": "./icons/example.svg"
}
```

### 📂 创建新分类示例
在 `content.json` 中：
```json
{
  "label": "新分类",
  "content": [
    {
      "label": "网站名称",
      "link": "https://example.com",
      "icon": "./icons/example.svg"
    }
  ]
}
```

详细配置说明请查看 [CONFIG.md](CONFIG.md)

## 功能说明

### 时钟功能
- 实时显示当前时间（24小时制）
- 显示完整的日期信息（年月日星期）
- 每秒自动更新

### 搜索功能
- 点击搜索框左侧图标切换搜索引擎
- 支持Google、百度、Bing三种搜索引擎
- 在搜索框中输入关键词，按回车键搜索

### AI对话框功能
- 点击左下角的"AI对话"按钮打开AI对话框
- 通过iframe嵌入外部AI网站（如ChatGPT、Claude等）
- 支持窗口拖拽移动和调整大小
- 可通过ESC键或关闭按钮关闭对话框
- 支持最大化/还原功能
- 可在配置文件中自定义AI网站URL、标题、图标和窗口样式

### 标签页切换
- 点击顶部标签按钮切换不同分类
- 支持键盘导航和触摸操作

### 响应式设计
- 桌面端：每行5个卡片，大图标显示
- 平板端：每行4个卡片，适中图标
- 手机端：每行2个卡片，适合触摸操作

## 自定义配置

### 方法一：编辑配置文件（推荐）
直接编辑 `config.json` 文件来添加、删除或修改网站：

```json
{
  "backgroundImage": "https://example.com/background.jpg",
  "webTitle": "我的导航站",
  "favicon": "./icons/favicon.ico",
  "content": [
    {
      "label": "分类名称",
      "content": [
        {
          "label": "网站名称",
          "link": "https://example.com",
          "icon": "./icons/example.svg"
        }
      ]
    }
  ]
}
```

### 方法二：修改JavaScript（不推荐）
如果需要更复杂的自定义，可以修改 `script.js` 中的相关代码。

## 图标管理

### 本地图标
- 将SVG图标文件放在 `icons/` 文件夹中
- 推荐尺寸：40×40px，方形带8px圆角
- 使用透明背景，图标自带颜色

### 外部图标
- 可以直接使用网站的favicon
- 支持PNG、ICO、SVG等格式

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 部署说明

### 静态托管（推荐）
可以部署到任何静态网站托管服务：
- GitHub Pages
- Netlify  
- Vercel
- 阿里云OSS
- 腾讯云COS

**注意**：确保 `config.json` 文件一起上传到服务器

### 本地开发
由于使用了Fetch API加载配置文件，必须通过HTTP服务器访问：
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js  
npx serve .

# 使用PHP
php -S localhost:8000
```

## 故障排除

### 配置文件加载失败
如果看到"配置文件错误"提示：
1. 检查 `config.json` 和 `content.json` 文件是否存在
2. 验证JSON格式是否正确（可使用在线JSON验证工具）
3. 确保使用HTTP服务器而非直接打开HTML文件
4. 检查文件编码是否为UTF-8
5. 如果是首次使用，请复制示例配置文件：
   ```bash
   cp config.example.json config.json
   cp content.example.json content.json
   ```

### 图标不显示
1. 检查图标路径是否正确
2. 确保图标文件存在于指定位置
3. 网络图标需要确保URL可访问

## 版本历史

### v1.0.0 (当前版本)
- 🎉 **完整功能发布** - 包含所有核心功能的稳定版本
- 🎨 **现代化界面** - 毛玻璃效果、渐变背景、圆角设计
- 🔄 **配置驱动架构** - 完全基于JSON配置文件，无内置数据
- 🤖 **AI对话框** - 窗口化AI助手，支持拖拽、缩放、最大化
- �️ **背景图标效果** - 卡片右上角旋转半透明背景图标
- 📝 **智能文字显示** - 支持双行文字，超出才使用省略号
- � **状态持久化** - 记住用户选择的标签页和搜索引擎
- 📱 **完美响应式** - 桌面、平板、手机全设备适配
- 🔍 **多搜索引擎** - 支持Google、百度、Bing等搜索引擎切换
- ⏰ **实时时钟** - 大字体时间显示，完整日期信息
- 🎯 **智能布局** - 每行5个卡片，不足时自动居中
- 🚨 **友好错误处理** - 配置文件问题时显示详细错误信息

## 许可证

MIT License