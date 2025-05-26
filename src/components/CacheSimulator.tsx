import React, { useState } from 'react';
import './CacheSimulator.css'; // For styling

interface CacheConfig {
  cacheSize: number; // in bytes
  blockSize: number; // in bytes
  associativity: 'direct-mapped' | 'fully-associative' | number; // N-way associative
}

interface CacheLine {
  tag: number | null;
  data: string[]; // Representing data blocks
  isValid: boolean;
  isDirty: boolean;
  lruCounter: number; // For LRU replacement policy
}

const CacheSimulator: React.FC = () => {
  const [config, setConfig] = useState<CacheConfig>({
    cacheSize: 1024,
    blockSize: 16,
    associativity: 'direct-mapped',
  });
  const [memoryAddresses, setMemoryAddresses] = useState<string>('');
  const [cache, setCache] = useState<CacheLine[]>([]);
  const [simulationSteps, setSimulationSteps] = useState<any[]>([]); // To store step-by-step visualization data

  // Derived cache parameters
  const numCacheLines = config.cacheSize / config.blockSize;
  const numSets = typeof config.associativity === 'number' ? numCacheLines / config.associativity : numCacheLines;
  const linesPerSet = typeof config.associativity === 'number' ? config.associativity : (config.associativity === 'fully-associative' ? numCacheLines : 1);

  // Initialize cache
  React.useEffect(() => {
    const initialCache: CacheLine[] = Array.from({ length: numCacheLines }, () => ({
      tag: null,
      data: Array.from({ length: config.blockSize / 4 }, () => '00'), // Assuming 4-byte words for data representation
      isValid: false,
      isDirty: false,
      lruCounter: 0,
    }));
    setCache(initialCache);
    setSimulationSteps([]);
  }, [config.cacheSize, config.blockSize, config.associativity, numCacheLines]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: name === 'associativity' && (value === 'direct-mapped' || value === 'fully-associative') ? value : Number(value),
    }));
  };

  const parseAddress = (address: number) => {
    const offsetBits = Math.log2(config.blockSize);
    const indexBits = Math.log2(numSets);
    const tagBits = 32 - offsetBits - indexBits; // Assuming 32-bit addresses for simplicity

    const offset = address & ((1 << offsetBits) - 1);
    const index = (address >> offsetBits) & ((1 << indexBits) - 1);
    const tag = address >> (offsetBits + indexBits);

    return { tag, index, offset, offsetBits, indexBits, tagBits };
  };

  const runSimulation = () => {
    let currentCache = JSON.parse(JSON.stringify(cache)) as CacheLine[];
    const addresses = memoryAddresses.split(',').map(addr => parseInt(addr.trim(), 10)).filter(addr => !isNaN(addr));
    const newSimulationSteps: any[] = [];
    let lruCounterGlobal = 0; // Global LRU counter for tie-breaking in fully associative

    addresses.forEach((address, accessIndex) => {
      const { tag, index, offset, offsetBits, indexBits, tagBits } = parseAddress(address);
      let hit = false;
      let replacedLineIndex: number | null = null;
      let originalLine: CacheLine | null = null;

      newSimulationSteps.push({
        type: 'access',
        address,
        parsedAddress: { tag, index, offset, offsetBits, indexBits, tagBits },
        cacheBefore: JSON.parse(JSON.stringify(currentCache)),
        highlightedLine: null,
        hit: false,
        replacementDetails: null,
        lruCounter: lruCounterGlobal,
      });

      const startLine = index * linesPerSet;
      const endLine = startLine + linesPerSet;
      const setLines = currentCache.slice(startLine, endLine);

      // Check for hit
      for (let i = 0; i < setLines.length; i++) {
        const lineIndex = startLine + i;
        if (setLines[i].isValid && setLines[i].tag === tag) {
          hit = true;
          currentCache[lineIndex].lruCounter = lruCounterGlobal++; // Update LRU on hit
          newSimulationSteps[newSimulationSteps.length - 1].hit = true;
          newSimulationSteps[newSimulationSteps.length - 1].highlightedLine = lineIndex;
          break;
        }
      }

      if (!hit) {
        // Cache miss
        // Find a line to replace
        let lineToReplaceIndex: number | null = null;
        let lowestLruCounter = Infinity;
        let firstInvalidLineIndex: number | null = null;

        for (let i = 0; i < setLines.length; i++) {
          const lineIndex = startLine + i;
          if (!setLines[i].isValid) {
            firstInvalidLineIndex = lineIndex;
            break;
          }
          if (setLines[i].lruCounter < lowestLruCounter) {
            lowestLruCounter = setLines[i].lruCounter;
            lineToReplaceIndex = lineIndex;
          }
        }

        replacedLineIndex = firstInvalidLineIndex !== null ? firstInvalidLineIndex : lineToReplaceIndex;
        originalLine = JSON.parse(JSON.stringify(currentCache[replacedLineIndex!])); // Store original for visualization

        // Simulate data fetch from main memory
        currentCache[replacedLineIndex!] = {
          tag,
          data: Array.from({ length: config.blockSize / 4 }, () => `D${address % 10}`), // Placeholder data
          isValid: true,
          isDirty: false, // Assuming read miss, so not dirty on load
          lruCounter: lruCounterGlobal++,
        };

        newSimulationSteps[newSimulationSteps.length - 1].replacementDetails = {
          replacedLineIndex: replacedLineIndex,
          originalLine: originalLine,
          fetchedData: currentCache[replacedLineIndex!].data,
        };
        newSimulationSteps[newSimulationSteps.length - 1].highlightedLine = replacedLineIndex;
      }
      newSimulationSteps[newSimulationSteps.length - 1].cacheAfter = JSON.parse(JSON.stringify(currentCache));
    });

    setSimulationSteps(newSimulationSteps);
    setCache(currentCache); // Update the main cache state with the final state
  };

  return (
    <div className="cache-simulator-container">
      <h2>交互式缓存工作原理模拟</h2>

      <div className="config-section">
        <h3>缓存参数设置</h3>
        <label>
          缓存总大小 (字节):
          <input
            type="number"
            name="cacheSize"
            value={config.cacheSize}
            onChange={handleConfigChange}
            min="16"
            step="16"
          />
        </label>
        <label>
          块大小 (字节):
          <input
            type="number"
            name="blockSize"
            value={config.blockSize}
            onChange={handleConfigChange}
            min="4"
            step="4"
          />
        </label>
        <label>
          关联度:
          <select name="associativity" value={config.associativity} onChange={handleConfigChange}>
            <option value="direct-mapped">直接映射</option>
            <option value="fully-associative">全相联</option>
            {[2, 4, 8, 16].map(val => ( // Example N-way options
              <option key={val} value={val}>{val}-路组相联</option>
            ))}
          </select>
        </label>
      </div>

      <div className="address-input-section">
        <h3>内存访问地址序列 (逗号分隔)</h3>
        <textarea
          value={memoryAddresses}
          onChange={(e) => setMemoryAddresses(e.target.value)}
          placeholder="例如: 0, 16, 32, 48, 0, 64"
          rows={5}
        />
        <button onClick={runSimulation}>运行模拟</button>
      </div>

      <div className="cache-visualization-section">
        <h3>缓存状态可视化</h3>
        <div className="cache-grid">
          {cache.map((line, index) => (
            <div key={index} className={`cache-line ${!line.isValid ? 'invalid' : ''}`}>
              <div className="cache-line-index">Line {index}</div>
              <div className="cache-line-tag">Tag: {line.tag !== null ? line.tag : '-'}</div>
              <div className="cache-line-data">Data: [{line.data.join(', ')}]</div>
              <div className="cache-line-status">Valid: {line.isValid ? '✓' : '✗'}</div>
              <div className="cache-line-lru">LRU: {line.lruCounter}</div>
            </div>
          ))}
        </div>

        <div className="simulation-steps-log">
          <h4>模拟步骤</h4>
          {simulationSteps.map((step, index) => (
            <div key={index} className={`simulation-step ${step.hit ? 'hit' : 'miss'}`}>
              <p>
                访问地址: <strong>{step.address}</strong>
                <span className={`status ${step.hit ? 'hit-text' : 'miss-text'}`}>
                  ({step.hit ? '命中' : '缺失'})
                </span>
              </p>
              <p>解析地址: Tag={step.parsedAddress.tag}, Index={step.parsedAddress.index}, Offset={step.parsedAddress.offset}</p>
              {step.replacementDetails && (
                <p className="replacement-info">
                  替换行: {step.replacementDetails.replacedLineIndex}
                  {step.replacementDetails.originalLine.isValid && ` (原Tag: ${step.replacementDetails.originalLine.tag})`}
                </p>
              )}
              <p>当前高亮缓存行: {step.highlightedLine !== null ? step.highlightedLine : '无'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CacheSimulator;
