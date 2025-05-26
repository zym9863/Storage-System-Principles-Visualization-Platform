import React, { useState } from 'react';
import CacheSimulator from './components/CacheSimulator';
import MemoryAddressing from './components/MemoryAddressing';
import './App.css'; // Keep existing App.css for basic app layout/reset if needed

function App() {
  const [activeComponent, setActiveComponent] = useState<'cache' | 'memory'>('cache');

  return (
    <div className="App">
      <header className="app-header">
        <h1>存储系统原理可视化平台</h1>
        <nav>
          <button
            className={activeComponent === 'cache' ? 'active' : ''}
            onClick={() => setActiveComponent('cache')}
          >
            缓存模拟
          </button>
          <button
            className={activeComponent === 'memory' ? 'active' : ''}
            onClick={() => setActiveComponent('memory')}
          >
            内存寻址
          </button>
        </nav>
      </header>
      <main className="app-main-content">
        {activeComponent === 'cache' && <CacheSimulator />}
        {activeComponent === 'memory' && <MemoryAddressing />}
      </main>
    </div>
  );
}

export default App;
