# 配置文件说明

## 概述
`config.json` 是导航网站的配置文件，用于管理网站的背景图片、搜索引擎、样式设置和所有导航链接。

## 文件结构

```json
{
  "backgroundImage": "背景图片URL",
  "webTitle": "网站标题",
  "settings": {
    "timeSeconds": true,
    "brightness": 80,
    "blur": 0,
    "fontColor": "#ffffff",
    "searchRadius": 50,
    "clockAreaHeight": 245,
    "linkOpen": "_blank",
    "cardStyle": {
      "widthNum": 160,
      "heightNum": 64,
      "radius": 16,
      "gap": 20,
      "boxShadow": "0 4px 16px rgba(0, 0, 0, 0.1)"
    }
  },
  "searchEngines": [
    {
      "label": "搜索引擎名称",
      "link": "搜索URL",
      "icon": "图标路径",
      "use": true
    }
  ],
  "content": [
    {
      "label": "分类名称",
      "content": [
        {
          "label": "网站名称",
          "link": "网站链接",
          "icon": "图标路径或URL"
        }
      ]
    }
  ]
}
```

## 字段说明

### 顶层配置
- **backgroundImage**: 网站背景图片的URL地址
- **webTitle**: 网站标题，显示在浏览器标签页

### 设置选项 (settings)
- **timeSeconds**: 是否显示时间的秒数 (true/false)
- **brightness**: 背景亮度 (0-100)
- **blur**: 背景模糊度 (0-10)
- **fontColor**: 字体颜色 (十六进制颜色代码)
- **searchRadius**: 搜索框圆角大小 (像素)
- **clockAreaHeight**: 时钟区域高度 (像素)
- **linkOpen**: 链接打开方式 ("_blank" 新窗口, "_self" 当前窗口)

### 卡片样式 (cardStyle)
- **widthNum**: 卡片宽度 (像素，推荐160)
- **heightNum**: 卡片高度 (像素，推荐64)
- **radius**: 卡片圆角大小 (像素)
- **gap**: 卡片间距 (像素)
- **boxShadow**: 卡片阴影效果 (CSS阴影语法)

### 搜索引擎配置 (searchEngines)
- **label**: 搜索引擎显示名称
- **link**: 搜索URL，查询参数会自动添加到末尾
- **icon**: 搜索引擎图标路径
- **use**: 是否启用该搜索引擎 (true/false)

### 分类配置 (content)
- **label**: 分类标签名称，显示在导航栏中
- **content**: 该分类下的网站列表数组

### 网站配置
- **label**: 网站显示名称
- **link**: 网站链接地址
- **icon**: 网站图标路径（可以是本地路径或外部URL）

## 如何添加新网站

### 1. 添加到现有分类
在对应分类的 `content` 数组中添加新的网站对象：

```json
{
  "label": "新网站名称",
  "link": "https://example.com",
  "icon": "./icons/example.svg"
}
```

### 2. 创建新分类
在 `content` 数组中添加新的分类对象：

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

## 图标管理

### 本地图标
- 将图标文件放在 `icons/` 文件夹中
- 推荐使用 SVG 格式，尺寸 40x40px
- 使用相对路径：`"./icons/filename.svg"`

### 外部图标
- 直接使用完整的URL地址
- 例如：`"https://example.com/favicon.ico"`

### 图标设计规范
- 尺寸：40x40px（桌面端）
- 格式：SVG 推荐，PNG/ICO 也可以
- 样式：方形带圆角（8px圆角）
- 背景：透明背景，图标自带颜色

## 背景图片

### 更换背景
修改 `backgroundImage` 字段的值：

```json
{
  "backgroundImage": "https://example.com/background.jpg"
}
```

### 推荐规格
- 分辨率：1920x1080 或更高
- 格式：JPG, PNG, WebP
- 大小：建议小于 2MB

## 配置示例

### 修改网站样式
```json
{
  "settings": {
    "brightness": 90,
    "blur": 2,
    "fontColor": "#ffffff",
    "cardStyle": {
      "widthNum": 180,
      "heightNum": 70,
      "radius": 20,
      "gap": 25
    }
  }
}
```

### 添加新搜索引擎
```json
{
  "searchEngines": [
    {
      "label": "DuckDuckGo",
      "link": "https://duckduckgo.com/?q=",
      "icon": "./icons/duckduckgo.svg",
      "use": true
    }
  ]
}
```

### 添加新的AI工具
```json
{
  "label": "ChatGPT",
  "link": "https://chat.openai.com",
  "icon": "./icons/chatgpt.svg"
}
```

### 添加新的开发工具分类
```json
{
  "label": "开发工具",
  "content": [
    {
      "label": "VS Code",
      "link": "https://code.visualstudio.com",
      "icon": "./icons/vscode.svg"
    },
    {
      "label": "Postman",
      "link": "https://www.postman.com",
      "icon": "./icons/postman.svg"
    }
  ]
}
```

## 当前配置包含的分类

1. **常用** - 7li7li导航站、博客站、Gmail等常用网站
2. **AI** - ChatGPT、Claude、文心一言等AI工具和平台
3. **搜索** - 各类专业搜索引擎和搜索工具
4. **社交** - 小红书、微博、V2EX等社交媒体和技术论坛
5. **购物** - 淘宝、京东、什么值得买等电商和购物网站
6. **视频** - B站、YouTube、Netflix等视频播放和娱乐平台
7. **编程** - GitHub、CSDN、掘金等开发工具和技术社区
8. **工具** - 在线压缩、PDF处理、二维码生成等实用工具
9. **设计** - 图标库、设计资源、在线设计工具
10. **软件** - 各类软件下载站和资源网站
11. **服务** - 云服务商、VPS提供商、部署平台
12. **VPS管理** - 个人VPS服务和管理工具
13. **阿里云服务** - 阿里云上部署的各种服务和应用
14. **服务器管理** - 本地服务器和NAS相关服务

## 注意事项

1. **JSON格式**: 确保配置文件是有效的JSON格式
2. **编码**: 使用UTF-8编码保存文件
3. **路径**: 图标路径区分大小写
4. **备份**: 修改前建议备份原配置文件
5. **测试**: 修改后刷新页面测试效果
6. **卡片布局**: 每行最多显示5个卡片，少于5个时自动居中
7. **搜索引擎**: 查询参数会自动添加到搜索URL末尾

## 常见问题

### Q: 图标不显示怎么办？
A: 检查图标路径是否正确，确保文件存在，或使用网络图标URL

### Q: 如何删除网站？
A: 从对应分类的 `content` 数组中删除相应的网站对象

### Q: 如何调整网站顺序？
A: 在配置文件中调整网站对象在数组中的位置

### Q: 配置文件格式错误怎么办？
A: 使用JSON验证工具检查格式，或查看浏览器控制台的错误信息

### Q: 如何修改卡片样式？
A: 修改 `settings.cardStyle` 中的相关参数

### Q: 如何添加新的搜索引擎？
A: 在 `searchEngines` 数组中添加新的搜索引擎对象

### Q: 时钟不显示秒数怎么办？
A: 将 `settings.timeSeconds` 设置为 `true`

## 在线JSON验证工具
- [JSONLint](https://jsonlint.com/)
- [JSON Formatter](https://jsonformatter.curiousconcept.com/)