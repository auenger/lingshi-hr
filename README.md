# 领视招聘官网

> 领智云（领视）招聘官方网站 - 展示实习生、校园招聘、社会招聘岗位信息

## 项目介绍

这是一个现代化的招聘官网项目，为领智云（领视）提供在线招聘信息展示和简历投递服务。

- **响应式设计**：适配桌面和移动设备
- **三大招聘类型**：实习生、校园招聘、社会招聘
- **在线投递**：支持简历在线投递功能
- **可视化编辑器**：提供岗位数据的可视化管理

## 项目结构

```
LYHR/
├── index.html          # 主页面
├── editor.html         # 岗位数据编辑器
├── script.js           # 主页 JavaScript
├── style.css           # 样式文件
├── data/               # 岗位数据
│   ├── intern.json     # 实习生岗位
│   ├── campus.json     # 校园招聘岗位
│   ├── social.json     # 社会招聘岗位
│   └── categories.json # 分类配置
└── resource/           # 图片资源
    ├── logo.png
    ├── ico.png
    └── image.png
```

## 功能特性

### 主页 (index.html)
- 岗位分类展示（实习生/校园招聘/社会招聘）
- 岗位详情弹窗
- 在线简历投递表单
- 公司介绍和联系方式

### 岗位编辑器 (editor.html)
- 三大分类独立管理
- 岗位增删改查
- 自动保存到浏览器缓存
- JSON 数据导出功能
- 岗位详情编辑（职责、要求等）

## 快速开始

### 方式一：直接打开

直接在浏览器中打开 `index.html` 即可访问。

### 方式二：本地服务器

推荐使用本地服务器运行：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 或使用 PHP
php -S localhost:8000
```

然后访问 http://localhost:8000

## 岗位数据管理

1. 打开 `editor.html`
2. 选择要编辑的分类（实习生/校园招聘/社会招聘）
3. 上传对应的 JSON 文件或直接编辑已有数据
4. 所有修改会自动保存到浏览器缓存
5. 编辑完成后点击"导出保存 JSON"下载文件
6. 将下载的文件替换 `data/` 目录下的对应文件

## 数据格式

岗位数据采用 JSON 格式：

```json
{
  "category": "Intern",
  "jobs": [
    {
      "id": "job-001",
      "title": "岗位名称",
      "location": "上海",
      "type": "全职",
      "experience": "1年以上",
      "tags": ["标签1", "标签2"],
      "snippet": "岗位简述",
      "detail": {
        "responsibilities": ["职责1", "职责2"],
        "requirements": ["要求1", "要求2"]
      }
    }
  ]
}
```

## 技术栈

- **前端框架**：纯 HTML/CSS/JavaScript
- **图标库**：Font Awesome
- **字体**：Noto Sans SC（Google Fonts）
- **数据存储**：JSON 文件 + LocalStorage（编辑器）

## 联系方式

- **邮箱**：xkben@lingshi.com
- **地址**：上海市浦东新区耀元路58号环球都会广场2号楼6、7层

## 许可证

Copyright © 2024 领智云. All Rights Reserved.
