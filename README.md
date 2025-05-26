# 存储系统原理可视化平台 📚

[English](README_EN.md) | 中文

> 一个交互式的存储系统原理学习与可视化平台，帮助理解计算机存储系统的核心概念。

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)

## ✨ 特性

- 🎯 **交互式学习** - 通过可视化模拟理解抽象的存储系统概念
- 🔧 **参数可配置** - 支持自定义缓存大小、块大小、关联度等参数
- 📊 **实时可视化** - 动态展示缓存命中/缺失、地址转换过程
- 🎨 **精致UI设计** - 现代化界面设计，提升学习体验
- 📱 **响应式布局** - 支持多设备访问，随时随地学习

## 🚀 功能模块

### 1. 缓存模拟器 (Cache Simulator)

深入理解缓存工作原理的交互式模拟器：

- **多种映射方式**
  - 直接映射 (Direct-mapped)
  - 全相联 (Fully-associative)  
  - N-路组相联 (N-way Set-associative)

- **实时模拟功能**
  - 地址解析可视化 (Tag, Index, Offset)
  - 缓存命中/缺失状态显示
  - LRU 替换策略模拟
  - 逐步执行过程展示

- **参数配置**
  - 缓存总大小 (Cache Size)
  - 块大小 (Block Size)
  - 关联度 (Associativity)

### 2. 内存寻址模拟器 (Memory Addressing)

全面展示各种内存寻址方式的工作机制：

- **支持的寻址方式**
  - 直接寻址 (Direct Addressing)
  - 立即寻址 (Immediate Addressing)
  - 寄存器寻址 (Register Addressing)
  - 寄存器间接寻址 (Register Indirect)
  - 相对寻址 (Relative Addressing)
  - 基址变址寻址 (Base-Indexed)
  - 段式寻址 (Segmented Addressing)
  - 虚拟内存寻址 (Virtual Memory)

- **虚拟内存特性**
  - 页表可视化
  - 缺页中断模拟
  - 逻辑地址到物理地址转换
  - 页大小配置

## 🛠️ 技术栈

- **前端框架**: React 19.1.0 + TypeScript 5.8.3
- **构建工具**: Vite 6.3.5
- **样式方案**: CSS Modules + CSS Variables
- **代码规范**: ESLint + TypeScript ESLint

## 📦 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/zym9863/storage-system-principles-visualization-platform.git
cd storage-system-principles-visualization-platform

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

### 访问应用

开发服务器启动后，在浏览器中访问 `http://localhost:5173` 即可使用应用。

## 📂 项目结构

```
src/
├── App.tsx                    # 应用主组件
├── App.css                    # 应用主样式
├── main.tsx                   # 应用入口点
├── index.css                  # 全局样式与CSS变量
├── vite-env.d.ts             # Vite类型声明
├── assets/                    # 静态资源
└── components/               # 组件目录
    ├── CacheSimulator.tsx    # 缓存模拟器组件
    ├── CacheSimulator.css    # 缓存模拟器样式
    ├── MemoryAddressing.tsx  # 内存寻址组件
    └── MemoryAddressing.css  # 内存寻址样式
```

## 🎯 使用指南

### 缓存模拟器使用

1. **配置缓存参数**
   - 设置缓存总大小（推荐：1024字节）
   - 设置块大小（推荐：16字节）
   - 选择关联度（直接映射/全相联/N-路组相联）

2. **输入访问序列**
   - 在文本框中输入内存地址序列
   - 使用逗号分隔多个地址
   - 例如：`0, 16, 32, 48, 0, 64`

3. **运行模拟**
   - 点击"运行模拟"按钮
   - 观察缓存状态变化
   - 查看详细的执行步骤

### 内存寻址器使用

1. **选择寻址方式**
   - 从下拉菜单选择想要学习的寻址方式
   - 系统会显示相应的参数配置选项

2. **配置参数**
   - 根据所选寻址方式设置相关参数
   - 虚拟内存模式需要设置页大小等参数

3. **计算地址**
   - 输入逻辑地址或相关参数
   - 点击"计算有效地址"查看转换过程

## 🎨 设计理念

### 视觉设计
- **现代化渐变背景** - 营造科技感的学习氛围
- **卡片式布局** - 清晰的信息层次结构
- **动画过渡效果** - 提升交互体验
- **状态颜色编码** - 直观的视觉反馈

### 交互体验
- **渐进式学习** - 从简单到复杂的学习路径
- **即时反馈** - 实时显示计算结果和状态变化
- **错误提示** - 友好的错误处理和提示信息
- **响应式适配** - 适配不同设备和屏幕尺寸

## 🔧 开发指南

### 代码规范

项目采用严格的TypeScript和ESLint配置，确保代码质量：

```bash
# 运行代码检查
npm run lint

# 自动修复可修复的问题
npm run lint --fix
```

### 组件开发

- 使用函数式组件 + Hooks
- TypeScript接口定义组件Props
- CSS Modules实现样式隔离
- 遵循单一职责原则

### 样式规范

- 使用CSS Variables进行主题管理
- 采用BEM命名规范
- 响应式设计优先
- 性能优化的动画实现

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出改进建议！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🎓 教育价值

本平台专为计算机体系结构和操作系统课程设计，帮助学生：

- 理解缓存的层次结构和工作原理
- 掌握不同内存寻址方式的特点
- 学习虚拟内存管理机制
- 培养对存储系统性能优化的认识

---

<div align="center">

**让抽象的存储系统概念变得具体可见** 🚀

[项目主页](.) · [问题反馈](issues) · [功能建议](issues)

</div>
