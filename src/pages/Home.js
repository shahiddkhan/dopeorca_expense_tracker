import React from 'react';
import SvgChart from '../components/SvgChart';

const CAT_META = {
  food:          { icon: '🍜', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)'   },
  transport:     { icon: '🚗', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'   },
  shopping:      { icon: '🛍️', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'   },
  bills:         { icon: '⚡', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)'   },
  entertainment: { icon: '🎬', color: '#EC4899', bg: 'rgba(236,72,153,0.1)'   },
  other:         { icon: '📦', color: '#6B7280', bg: 'rgba(107,114,128,0.1)'  },
};

const INCOME_DATA  = [28000, 35000, 30000, 42000, 38000, 45000, 40000, 50000];
const EXPENSE_DATA = [18000, 22000, 25000, 19000, 30000, 21000, 28000, 24000];

export default function Home({ expenses, income, onAdd, onIncome }) {
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const savings    = income - totalSpent;
  const savePct    = income ? Math.round((savings / income) * 100) : 0;

  // Category totals
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="logo-text">DOPE<span className="logo-dot">●</span>ORCA</div>
        <div className="header-avatar">D</div>
      </div>

      {/* Balance Hero */}
      <div className="balance-hero fade-up">
        <div className="bh-label">Total Balance</div>
        <div className="bh-amount">₹{income.toLocaleString('en-IN')}</div>
        <div className={`bh-change${savings < 0 ? ' neg' : ''}`}>
          {savings >= 0 ? '↗' : '↘'} ₹{Math.abs(savings).toLocaleString('en-IN')} {savings >= 0 ? 'saved' : 'over'}
        </div>
        <div className="bh-actions">
          <button className="bh-btn bh-btn-primary" onClick={onAdd}>+ Add Expense</button>
          <button className="bh-btn bh-btn-ghost"   onClick={onIncome}>Set Income</button>
        </div>
      </div>

      {/* Stat pills */}
      <div className="stat-row fade-up" style={{ animationDelay: '0.07s' }}>
        <div className="stat-pill-card orange-grad">
          <div className="spc-icon light">💰</div>
          <div className="spc-label light">Monthly Income</div>
          <div className="spc-value light">₹{(income/1000).toFixed(0)}k</div>
          <div className="spc-trend light">This month</div>
        </div>
        <div className="stat-pill-card white">
          <div className="spc-icon orange">💸</div>
          <div className="spc-label dark">Total Spent</div>
          <div className="spc-value dark">₹{(totalSpent/1000).toFixed(1)}k</div>
          <div className={`spc-trend ${savePct >= 0 ? 'emerald' : 'red'}`}>{savePct >= 0 ? `${savePct}% saved` : `${Math.abs(savePct)}% over`}</div>
        </div>
      </div>

      {/* Chart */}
      <SvgChart incomeData={INCOME_DATA} expenseData={EXPENSE_DATA} />

      {/* Recent Spends */}
      {expenses.length > 0 && (
        <>
          <div className="section-header fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-title">RECENT SPENDS</div>
          </div>
          <div className="expense-strip fade-up" style={{ animationDelay: '0.25s', paddingBottom: 16 }}>
            {expenses.slice(0, 5).map(exp => {
              const m = CAT_META[exp.category] || CAT_META.other;
              return (
                <div key={exp.id} className="exp-mini-card">
                  <div className="emc-icon" style={{ background: m.bg }}>{m.icon}</div>
                  <div className="emc-label">{exp.label}</div>
                  <div className="emc-amount">₹{exp.amount.toLocaleString('en-IN')}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Category Breakdown */}
      {Object.keys(catTotals).length > 0 && (
        <div className="tx-card-wrap fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>CATEGORY BREAKDOWN</div>
          {Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
            const m = CAT_META[cat] || CAT_META.other;
            const pct = income ? Math.min(100, (amt / income) * 100) : 0;
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{m.icon}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-h)', fontSize: 14, color: m.color }}>₹{amt.toLocaleString('en-IN')}</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-fill progress-stripe" style={{ width: `${pct}%`, background: m.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expenses.length === 0 && (
        <div className="empty-state">
          <div className="empty-emoji">🌱</div>
          <div className="empty-title">FRESH START</div>
          <div className="empty-sub">No expenses yet. Tap + Add Expense to begin tracking.</div>
        </div>
      )}
    </div>
  );
}
