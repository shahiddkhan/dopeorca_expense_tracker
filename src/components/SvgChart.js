import React from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

// Smooth bezier path from points
function smoothPath(pts, w, h) {
  if (!pts.length) return '';
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - (p / 50000) * h);
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx1 = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cpx1} ${ys[i - 1]}, ${cpx1} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  return d;
}

export default function SvgChart({ incomeData, expenseData }) {
  const W = 320;
  const H = 120;

  const iPath = smoothPath(incomeData,  W, H);
  const ePath = smoothPath(expenseData, W, H);

  const gridLines = [10000, 20000, 30000, 40000, 50000];

  // node positions
  const iNodes = incomeData.map((v, i) => ({
    x: (i / (incomeData.length - 1)) * 100,
    y: 100 - (v / 50000) * 100,
  }));
  const eNodes = expenseData.map((v, i) => ({
    x: (i / (expenseData.length - 1)) * 100,
    y: 100 - (v / 50000) * 100,
  }));

  return (
    <div className="chart-card fade-up" style={{ animationDelay: '0.15s' }}>
      <div className="chart-header">
        <div>
          <div className="chart-title">INCOME vs EXPENSE</div>
          <div className="chart-sub">Monthly overview</div>
        </div>
        <div className="chart-legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: '#3B82F6' }} />Income</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: '#111827' }} />Expense</div>
        </div>
      </div>

      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* grid lines */}
          {gridLines.map((v, i) => {
            const y = H - (v / 50000) * H;
            return <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="#E5E7EB" strokeWidth="0.8" />;
          })}

          {/* income area fill */}
          <path d={`${iPath} L ${W} ${H} L 0 ${H} Z`} fill="rgba(59,130,246,0.06)" />
          {/* income line */}
          <path d={iPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* expense line */}
          <path d={ePath} fill="none" stroke="#18181B" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* nodes — income */}
        {iNodes.map((n, i) => (
          <div key={i} className="chart-node" style={{ left: `${n.x}%`, top: `${n.y}%`, background: '#3B82F6' }} />
        ))}
        {/* nodes — expense */}
        {eNodes.map((n, i) => (
          <div key={i} className="chart-node" style={{ left: `${n.x}%`, top: `${n.y}%`, background: '#18181B' }} />
        ))}
      </div>

      <div className="chart-x-labels">
        {MONTHS.map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}
