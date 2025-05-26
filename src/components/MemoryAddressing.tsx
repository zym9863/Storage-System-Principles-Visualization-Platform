import React, { useState } from 'react';
import './MemoryAddressing.css';

interface AddressingMode {
  name: string;
  description: string;
}

interface AddressingConfig {
  mode: string;
  baseAddress: number;
  offset: number;
  segmentRegister: number;
  indexRegister: number;
  scaleFactor: number;
  logicalAddressBits: number;
  physicalAddressBits: number;
  pageSize: number; // For virtual memory
}

interface PageTableEntry {
  valid: boolean;
  frameNumber: number | null;
}

const MemoryAddressing: React.FC = () => {
  const [config, setConfig] = useState<AddressingConfig>({
    mode: 'direct',
    baseAddress: 0,
    offset: 0,
    segmentRegister: 0,
    indexRegister: 0,
    scaleFactor: 1,
    logicalAddressBits: 16, // Default for logical address
    physicalAddressBits: 20, // Default for physical address
    pageSize: 4096, // Default page size for virtual memory
  });
  const [inputAddress, setInputAddress] = useState<number | string>('');
  const [effectiveAddress, setEffectiveAddress] = useState<number | null>(null);
  const [conversionSteps, setConversionSteps] = useState<string[]>([]);
  const [pageTable, setPageTable] = useState<PageTableEntry[]>([]);
  const [pageFault, setPageFault] = useState<boolean>(false);
  const [highlightedPageTableEntry, setHighlightedPageTableEntry] = useState<number | null>(null);

  const addressingModes: AddressingMode[] = [
    { name: 'direct', description: '直接寻址: 有效地址 = 地址字段' },
    { name: 'immediate', description: '立即寻址: 操作数即为地址字段中的值' },
    { name: 'register', description: '寄存器寻址: 操作数在寄存器中' },
    { name: 'register-indirect', description: '寄存器间接寻址: 有效地址在寄存器中' },
    { name: 'relative', description: '相对寻址: 有效地址 = PC + 地址字段' },
    { name: 'base-indexed', description: '基址变址寻址: 有效地址 = 基地址寄存器 + 变址寄存器' },
    { name: 'segmented-offset', description: '段式寻址 (简化): 有效地址 = 段寄存器 * 16 + 偏移量' },
    { name: 'virtual-memory', description: '虚拟内存寻址 (简化): 逻辑地址 -> 物理地址, 模拟缺页' },
  ];

  // Initialize page table for virtual memory
  React.useEffect(() => {
    const numLogicalPages = 2 ** config.logicalAddressBits / config.pageSize;
    const initialPageTable: PageTableEntry[] = Array.from({ length: numLogicalPages }, (_, i) => ({
      valid: Math.random() > 0.7, // Simulate some pages being in memory
      frameNumber: Math.floor(Math.random() * (2 ** (config.physicalAddressBits - Math.log2(config.pageSize)))),
    }));
    setPageTable(initialPageTable);
  }, [config.logicalAddressBits, config.physicalAddressBits, config.pageSize]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: name === 'mode' ? value : Number(value),
    }));
    setEffectiveAddress(null);
    setConversionSteps([]);
    setPageFault(false);
    setHighlightedPageTableEntry(null);
  };

  const calculateEffectiveAddress = () => {
    let ea: number | null = null;
    const steps: string[] = [];
    const addr = Number(inputAddress);

    if (isNaN(addr) && config.mode !== 'register') {
      steps.push("输入地址无效，请确保输入的是数字。");
      setConversionSteps(steps);
      setEffectiveAddress(null);
      setPageFault(false);
      setHighlightedPageTableEntry(null);
      return;
    }

    steps.push(`选择寻址方式: ${addressingModes.find(m => m.name === config.mode)?.description}`);

    switch (config.mode) {
      case 'direct':
        ea = addr;
        steps.push(`有效地址 (EA) = 地址字段 = ${addr}`);
        break;
      case 'immediate':
        ea = addr; // For immediate, the address is the value itself
        steps.push(`操作数 = 地址字段 = ${addr} (无有效地址计算，此值为操作数)`);
        break;
      case 'register':
        // Assuming register value is directly provided in inputAddress or a config field
        ea = addr; // Here, addr is assumed to be the register value itself
        steps.push(`有效地址 (EA) = 寄存器内容 = ${addr}`);
        break;
      case 'register-indirect':
        ea = addr; // Here, addr is assumed to be the content of the register pointing to EA
        steps.push(`有效地址 (EA) = (寄存器内容) = (${addr}) = ${addr}`);
        break;
      case 'relative':
        // PC (Program Counter) is usually current instruction address + fixed offset
        // For simplicity, let's assume PC is a base address here
        const pc = 1000; // Placeholder PC value
        ea = pc + addr;
        steps.push(`PC (程序计数器) = ${pc}`);
        steps.push(`有效地址 (EA) = PC + 地址字段 = ${pc} + ${addr} = ${ea}`);
        break;
      case 'base-indexed':
        ea = config.baseAddress + config.indexRegister;
        steps.push(`基地址寄存器 (Base) = ${config.baseAddress}`);
        steps.push(`变址寄存器 (Index) = ${config.indexRegister}`);
        steps.push(`有效地址 (EA) = Base + Index = ${config.baseAddress} + ${config.indexRegister} = ${ea}`);
        break;
      case 'segmented-offset':
        ea = config.segmentRegister * 16 + addr; // Common segment * 16 (shift 4 bits) + offset
        steps.push(`段寄存器 (Segment) = ${config.segmentRegister}`);
        steps.push(`偏移量 (Offset) = ${addr}`);
        steps.push(`有效地址 (EA) = Segment * 16 + Offset = ${config.segmentRegister} * 16 + ${addr} = ${ea}`);
        break;
      case 'virtual-memory':
        setPageFault(false);
        setHighlightedPageTableEntry(null);
        const logicalAddress = addr;
        steps.push(`逻辑地址 (Logical Address) = ${logicalAddress}`);

        const pageOffsetBits = Math.log2(config.pageSize);
        const pageNumberBits = config.logicalAddressBits - pageOffsetBits;

        if (pageOffsetBits % 1 !== 0 || config.pageSize === 0) {
            steps.push("错误: 页大小必须是2的幂次方，并且不能为0。");
            setEffectiveAddress(null);
            setConversionSteps(steps);
            return;
        }

        const pageNumber = logicalAddress >> pageOffsetBits;
        const offsetInPage = logicalAddress & ((1 << pageOffsetBits) - 1);

        steps.push(`页大小 (Page Size) = ${config.pageSize} 字节`);
        steps.push(`页内偏移位数 = ${pageOffsetBits} 位`);
        steps.push(`页号位数 = ${pageNumberBits} 位`);
        steps.push(`从逻辑地址 ${logicalAddress} 中提取:`);
        steps.push(`  页号 (Page Number) = ${pageNumber} (十进制)`);
        steps.push(`  页内偏移 (Offset in Page) = ${offsetInPage} (十进制)`);

        if (pageNumber >= pageTable.length) {
          steps.push(`错误: 页号 ${pageNumber} 超出页表范围 (${pageTable.length} 页)。`);
          setEffectiveAddress(null);
          setConversionSteps(steps);
          setPageFault(true);
          return;
        }

        const pte = pageTable[pageNumber];
        setHighlightedPageTableEntry(pageNumber);
        steps.push(`查找页表项 (PTE) for 页号 ${pageNumber}:`);

        if (pte.valid) {
          steps.push(`  PTE 有效位 (Valid Bit) = 1 (页在内存中)`);
          const frameNumber = pte.frameNumber!;
          ea = (frameNumber << pageOffsetBits) | offsetInPage;
          steps.push(`  页框号 (Frame Number) = ${frameNumber}`);
          steps.push(`物理地址 (Physical Address) = 页框号 << 页内偏移位数 | 页内偏移`);
          steps.push(`物理地址 (Physical Address) = ${frameNumber} << ${pageOffsetBits} | ${offsetInPage} = ${ea}`);
        } else {
          steps.push(`  PTE 有效位 (Valid Bit) = 0 (页不在内存中)`);
          steps.push(`发生缺页中断 (Page Fault)! 需要从磁盘加载页到内存。`);
          setPageFault(true);
          ea = null; // No physical address calculated yet
        }
        break;
      default:
        steps.push("请选择一种寻址方式。");
        ea = null;
    }
    setConversionSteps(steps);
    setEffectiveAddress(ea);
  };

  return (
    <div className="memory-addressing-container">
      <h2>内存地址寻址与转换可视化</h2>

      <div className="config-section">
        <h3>寻址方式选择与参数设置</h3>
        <label>
          寻址方式:
          <select name="mode" value={config.mode} onChange={handleConfigChange}>
            {addressingModes.map(mode => (
              <option key={mode.name} value={mode.name}>{mode.description}</option>
            ))}
          </select>
        </label>

        {config.mode !== 'immediate' && config.mode !== 'register' && (
          <label>
            输入地址/操作数:
            <input
              type="number"
              value={inputAddress}
              onChange={(e) => setInputAddress(Number(e.target.value))}
              placeholder="例如: 100, 20"
            />
          </label>
        )}

        {config.mode === 'base-indexed' && (
          <>
            <label>
              基地址寄存器:
              <input type="number" name="baseAddress" value={config.baseAddress} onChange={handleConfigChange} />
            </label>
            <label>
              变址寄存器:
              <input type="number" name="indexRegister" value={config.indexRegister} onChange={handleConfigChange} />
            </label>
          </>
        )}

        {config.mode === 'segmented-offset' && (
          <label>
            段寄存器 (乘以16):
            <input type="number" name="segmentRegister" value={config.segmentRegister} onChange={handleConfigChange} />
          </label>
        )}

        {config.mode === 'virtual-memory' && (
          <>
            <label>
              逻辑地址位数:
              <input type="number" name="logicalAddressBits" value={config.logicalAddressBits} onChange={handleConfigChange} min="8" max="32" />
            </label>
            <label>
              物理地址位数:
              <input type="number" name="physicalAddressBits" value={config.physicalAddressBits} onChange={handleConfigChange} min="8" max="32" />
            </label>
            <label>
              页大小 (字节, 2的幂):
              <input type="number" name="pageSize" value={config.pageSize} onChange={handleConfigChange} min="64" step="64" />
            </label>
          </>
        )}

        <button onClick={calculateEffectiveAddress}>计算有效地址</button>
      </div>

      <div className="visualization-section">
        <h3>计算过程与结果</h3>
        <div className="steps-log">
          {conversionSteps.map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
        {effectiveAddress !== null && (
          <p className="result">
            最终有效地址 / 物理地址: <strong>{effectiveAddress}</strong>
          </p>
        )}
        {config.mode === 'virtual-memory' && (
          <>
            <div className="page-table-visualization">
              <h4>页表 (简化)</h4>
              <div className="page-table-grid">
                {pageTable.map((pte, index) => (
                  <div
                    key={index}
                    className={`page-table-entry ${pte.valid ? 'valid' : 'invalid'} ${highlightedPageTableEntry === index ? 'highlighted' : ''}`}
                  >
                    <div>页号: {index}</div>
                    <div>有效: {pte.valid ? '是' : '否'}</div>
                    {pte.valid && <div>页框号: {pte.frameNumber}</div>}
                  </div>
                ))}
              </div>
            </div>
            {pageFault && <p className="page-fault-message">发生缺页中断!</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default MemoryAddressing;
