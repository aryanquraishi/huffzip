import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../../hooks/useTheme';

export default function HuffmanTree({ treeData = [], events = [] }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const { isDark } = useTheme();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(300, rect.width), height: Math.max(250, Math.min(500, rect.height || 400)) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const treeCompleteEvent = events.find(e => e.type === 'TREE_COMPLETE');
  const allTreeNodes = treeCompleteEvent?.tree_data || treeData;

  useEffect(() => {
    if (!svgRef.current || allTreeNodes.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const { width, height } = dimensions;
    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const nodeMap = {};
    allTreeNodes.forEach(n => { nodeMap[n.id] = { ...n, children: [] }; });
    allTreeNodes.forEach(n => {
      const node = nodeMap[n.id];
      if (n.left != null && nodeMap[n.left]) node.children.push(nodeMap[n.left]);
      if (n.right != null && nodeMap[n.right]) node.children.push(nodeMap[n.right]);
    });

    const internalNodes = allTreeNodes.filter(n => !n.is_leaf);
    let root = internalNodes.length > 0 ? nodeMap[internalNodes[internalNodes.length - 1].id] : nodeMap[allTreeNodes[0]?.id];
    if (!root) return;

    const hierarchy = d3.hierarchy(root, d => d.children.length > 0 ? d.children : null);
    d3.tree().size([innerW, innerH])(hierarchy);
    const g = svg.append('g');
    const zoom = d3.zoom().scaleExtent([0.3, 3]).on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(margin.left, margin.top));

    const lineColor = isDark ? 'rgba(96,165,250,0.25)' : 'rgba(37,99,235,0.2)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    g.selectAll('.link').data(hierarchy.links()).join('line')
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      .attr('stroke', lineColor).attr('stroke-width', 1.5)
      .attr('opacity', 0).transition().duration(400).delay((d, i) => i * 3).attr('opacity', 1);

    g.selectAll('.edge-label').data(hierarchy.links()).join('text')
      .attr('x', d => (d.source.x + d.target.x) / 2).attr('y', d => (d.source.y + d.target.y) / 2 - 4)
      .attr('text-anchor', 'middle').attr('fill', textColor).attr('font-size', '10px').attr('font-family', 'var(--font-mono)')
      .text(d => d.source.data.children[0] === d.target.data ? '0' : '1');

    const nodes = g.selectAll('.node').data(hierarchy.descendants()).join('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    nodes.append('circle')
      .attr('r', d => d.data.is_leaf ? 8 : 6)
      .attr('fill', d => {
        if (d.depth === 0) return '#16a34a';
        if (d.data.is_leaf) return '#2563eb';
        return isDark ? '#475569' : '#94a3b8';
      })
      .attr('stroke', isDark ? '#1e293b' : '#ffffff').attr('stroke-width', 2)
      .attr('opacity', 0).transition().duration(300).delay((d, i) => i * 3).attr('opacity', 1);

    const totalNodes = hierarchy.descendants().length;
    if (totalNodes < 80) {
      nodes.filter(d => d.data.is_leaf).append('text')
        .attr('dy', -14).attr('text-anchor', 'middle').attr('fill', textColor)
        .attr('font-size', totalNodes < 30 ? '11px' : '9px').attr('font-family', 'var(--font-mono)')
        .text(d => d.data.char ? `'${d.data.char}'` : d.data.freq);
    }
    if (totalNodes < 40) {
      nodes.append('text').attr('dy', 18).attr('text-anchor', 'middle').attr('fill', textColor)
        .attr('font-size', '8px').attr('font-family', 'var(--font-mono)').text(d => d.data.freq);
    }
  }, [allTreeNodes, dimensions, isDark]);

  const treeBg = isDark ? '#0f172a' : '#f1f5f9';

  return (
    <div ref={containerRef} className="surface rounded-xl overflow-hidden relative h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
        <h3 className="text-base font-semibold text-on-bg">Huffman Tree</h3>
        {allTreeNodes.length > 0 && (
          <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: isDark ? 'rgba(96,165,250,0.1)' : 'rgba(37,99,235,0.08)', color: isDark ? '#60a5fa' : '#2563eb' }}>
            Building
          </span>
        )}
      </div>
      <div className="flex-1 relative" style={{ background: treeBg, minHeight: '200px' }}>
        {allTreeNodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-muted-c mb-2 block" style={{ fontSize: '40px' }}>park</span>
              <p className="text-sm text-muted-c">Huffman tree will appear here</p>
            </div>
          </div>
        ) : (
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full" />
        )}
      </div>
      {allTreeNodes.length > 0 && (
        <div className="px-4 py-2 border-t text-xs text-muted-c" style={{ borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
          Active Node: {allTreeNodes[allTreeNodes.length-1]?.freq || 0} (Frequency)
        </div>
      )}
    </div>
  );
}
