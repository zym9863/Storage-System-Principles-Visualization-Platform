# Storage System Principles Visualization Platform 📚

English | [中文](README.md)

> An interactive learning and visualization platform for storage system principles, helping to understand core concepts of computer storage systems.

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)

## ✨ Features

- 🎯 **Interactive Learning** - Understand abstract storage system concepts through visual simulation
- 🔧 **Configurable Parameters** - Support custom cache size, block size, associativity and other parameters
- 📊 **Real-time Visualization** - Dynamic display of cache hit/miss and address translation processes
- 🎨 **Refined UI Design** - Modern interface design to enhance learning experience
- 📱 **Responsive Layout** - Support multi-device access for learning anytime, anywhere

## 🚀 Functional Modules

### 1. Cache Simulator

An interactive simulator for in-depth understanding of cache working principles:

- **Multiple Mapping Methods**
  - Direct-mapped
  - Fully-associative  
  - N-way Set-associative

- **Real-time Simulation Features**
  - Address parsing visualization (Tag, Index, Offset)
  - Cache hit/miss status display
  - LRU replacement policy simulation
  - Step-by-step execution process display

- **Parameter Configuration**
  - Cache Size
  - Block Size
  - Associativity

### 2. Memory Addressing Simulator

Comprehensive demonstration of various memory addressing mechanisms:

- **Supported Addressing Modes**
  - Direct Addressing
  - Immediate Addressing
  - Register Addressing
  - Register Indirect Addressing
  - Relative Addressing
  - Base-Indexed Addressing
  - Segmented Addressing
  - Virtual Memory Addressing

- **Virtual Memory Features**
  - Page table visualization
  - Page fault simulation
  - Logical to physical address translation
  - Page size configuration

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Styling Solution**: CSS Modules + CSS Variables
- **Code Standards**: ESLint + TypeScript ESLint

## 📦 Quick Start

### Requirements

- Node.js >= 16.0.0
- npm >= 7.0.0

### Installation & Running

```bash
# Clone the project
git clone https://github.com/zym9863/storage-system-principles-visualization-platform.git
cd storage-system-principles-visualization-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Code linting
npm run lint
```

### Accessing the Application

After starting the development server, visit `http://localhost:5173` in your browser to use the application.

## 📂 Project Structure

```
src/
├── App.tsx                    # Main application component
├── App.css                    # Main application styles
├── main.tsx                   # Application entry point
├── index.css                  # Global styles and CSS variables
├── vite-env.d.ts             # Vite type declarations
├── assets/                    # Static assets
└── components/               # Components directory
    ├── CacheSimulator.tsx    # Cache simulator component
    ├── CacheSimulator.css    # Cache simulator styles
    ├── MemoryAddressing.tsx  # Memory addressing component
    └── MemoryAddressing.css  # Memory addressing styles
```

## 🎯 Usage Guide

### Cache Simulator Usage

1. **Configure Cache Parameters**
   - Set total cache size (recommended: 1024 bytes)
   - Set block size (recommended: 16 bytes)
   - Choose associativity (direct-mapped/fully-associative/N-way set-associative)

2. **Input Access Sequence**
   - Enter memory address sequence in the text box
   - Use commas to separate multiple addresses
   - Example: `0, 16, 32, 48, 0, 64`

3. **Run Simulation**
   - Click "Run Simulation" button
   - Observe cache state changes
   - View detailed execution steps

### Memory Addressing Usage

1. **Select Addressing Mode**
   - Choose the addressing mode you want to learn from the dropdown menu
   - The system will display corresponding parameter configuration options

2. **Configure Parameters**
   - Set relevant parameters according to the selected addressing mode
   - Virtual memory mode requires setting page size and other parameters

3. **Calculate Address**
   - Input logical address or related parameters
   - Click "Calculate Effective Address" to view the translation process

## 🎨 Design Philosophy

### Visual Design
- **Modern Gradient Background** - Create a tech-savvy learning atmosphere
- **Card-based Layout** - Clear information hierarchy
- **Animation Transitions** - Enhance interactive experience
- **Status Color Coding** - Intuitive visual feedback

### Interactive Experience
- **Progressive Learning** - Learning path from simple to complex
- **Instant Feedback** - Real-time display of calculation results and state changes
- **Error Prompts** - Friendly error handling and prompt information
- **Responsive Adaptation** - Adapt to different devices and screen sizes

## 🔧 Development Guide

### Code Standards

The project adopts strict TypeScript and ESLint configuration to ensure code quality:

```bash
# Run code linting
npm run lint

# Auto-fix fixable issues
npm run lint --fix
```

### Component Development

- Use functional components + Hooks
- Define component Props with TypeScript interfaces
- Implement style isolation with CSS Modules
- Follow single responsibility principle

### Style Standards

- Use CSS Variables for theme management
- Adopt BEM naming convention
- Responsive design first
- Performance-optimized animation implementation

## 🤝 Contributing

Welcome to contribute code, report issues, or suggest improvements!

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🎓 Educational Value

This platform is designed specifically for computer architecture and operating systems courses to help students:

- Understand cache hierarchy and working principles
- Master the characteristics of different memory addressing modes
- Learn virtual memory management mechanisms
- Develop awareness of storage system performance optimization

---

<div align="center">

**Making abstract storage system concepts concrete and visible** 🚀

[Project Home](.) · [Issue Reports](issues) · [Feature Requests](issues)

</div>
