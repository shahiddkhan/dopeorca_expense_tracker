import React from 'react';

function getRating(pct) {
  if (pct >= 40) return { label: 'ELITE SAVER', className: 'good', color: '#10B981', border: '#10B981' };
  if (pct >= 20) return { label: 'SOLID TRACK', className: 'ok',   color: '#F59E0B', border: '#F59E0B' };
  return           { label: 'NEEDS WORK',  className: 'bad',  color: '#EF4444', border: '#EF4444' };
}

function getInsights(expenses, income, savings, savePct) {
  if (!income || expenses.length === 0) return [];
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const top = Object.entries(catTotals).sort((a,b)=>b[1]-a[1])[0];
  const out = [];

  if (savePct >= 40) out.push({ icon:'🏆', color:'#10B981', bg:'rgba(16,185,129,0.08)', border:'#10B981', title:'Elite Savings Tier', body:'You are saving over 40% of your income. Compound interest is your best friend right now.' });
  else if (savePct >= 20) out.push({ icon:'📈', color:'#3B82F6', bg:'rgba(59,130,246,0.07)', border:'#3B82F6', title:'On the Right Track', body:`Saving ${savePct}% is above average. Push to 30% to unlock serious wealth building.` });
  else if (savings < 0) out.push({ icon:'🚨', color:'#EF4444', bg:'rgba(239,68,68,0.07)', border:'#EF4444', title:'Over Budget Alert', body:'You spent more than you earned this month. Identify the biggest category and cut back first.' });
  else out.push({ icon:'⚠️', color:'#F59E0B', bg:'rgba(245,158,11,0.07)', border:'#F59E0B', title:'Room to Improve', body:'Saving under 20% limits your future options. Small daily cuts compound into big yearly savings.' });

  if (top) {
    const pct = Math.round((top[1]/income)*100);
    out.push({ icon:'🔍', color:'#8B5CF6', bg:'rgba(139,92,246,0.07)', border:'#8B5CF6', title:`Top Spend: ${top[0].toUpperCase()}`, body:`${top[0].charAt(0).toUpperCase()+top[0].slice(1)} takes ${pct}% of your income (₹${top[1].toLocaleString('en-IN')}). Is every rupee intentional?` });
  }

  out.push({ icon:'💡', color:'#FF6B35', bg:'rgba(255,107,53,0.07)', border:'#FF6B35', title:'50/30/20 Framework', body:'50% needs · 30% wants · 20% savings. Apply this to your ₹' + income.toLocaleString('en-IN') + ' income: save at least ₹' + Math.round(income*0.2).toLocaleString('en-IN') + '/mo.' });

  if (expenses.length >= 10) out.push({ icon:'🔥', color:'#EC4899', bg:'rgba(236,72,153,0.07)', border:'#EC4899', title:'Tracking Champion', body:`${expenses.length} transactions recorded. Consistent tracking is proven to reduce spending by 15–20%.` });

  return out;
}

export default function Insights({ expenses, income }) {
  const totalSpent = expenses.reduce((s,e) => s+e.amount, 0);
  const savings    = income - totalSpent;
  const savePct    = income ? Math.round((savings / income) * 100) : 0;
  const rating     = getRating(savePct);
  const cards      = getInsights(expenses, income, savings, savePct);

  return (
    <div>
      <div className="page-header">
        <div className="logo-text">INSIGHTS</div>
        <div style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font-b)', fontStyle: 'italic' }}>AI-powered</div>
      </div>

      {/* Hero rate card */}
      <div className="insight-hero fade-up">
        <div className="ih-rate-label">SAVINGS RATE</div>
        <div className={`ih-rate ${rating.className}`}>{savePct}%</div>
        <div style={{ display:'inline-block', background:'rgba(255,255,255,0.08)', border:`1px solid ${rating.color}40`, borderRadius:999, padding:'4px 12px', fontSize:11, fontWeight:700, color:rating.color, letterSpacing:'0.1em', marginBottom:16 }}>
          {rating.label}
        </div>
        <div className="ih-desc">
          {savings >= 0
            ? `You kept ₹${savings.toLocaleString('en-IN')} from your ₹${income.toLocaleString('en-IN')} income this month.`
            : `You overspent by ₹${Math.abs(savings).toLocaleString('en-IN')} this month. Time to reset.`}
        </div>

        {/* Mini progress */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:11, color:'rgba(255,255,255,0.4)' }}>
            <span>₹0</span><span>₹{income.toLocaleString('en-IN')}</span>
          </div>
          <div className="progress-wrap" style={{ background:'rgba(255,255,255,0.1)', border:'none' }}>
            <div className="progress-fill progress-stripe" style={{ width:`${Math.max(0,Math.min(100,(totalSpent/income)*100))}%`, background:'var(--red)' }} />
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:6 }}>
            Spent ₹{totalSpent.toLocaleString('en-IN')} of ₹{income.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🧠</div>
          <div className="empty-title">NOT ENOUGH DATA</div>
          <div className="empty-sub">Set your income and log some expenses to get personalized insights.</div>
        </div>
      ) : (
        <div className="insight-cards-wrap">
          {cards.map((c, i) => (
            <div key={i} className="insight-card fade-up" style={{ background:c.bg, borderLeftColor:c.border, animationDelay:`${i*0.08}s` }}>
              <div className="insight-icon-box" style={{ background:c.color+'18' }}>{c.icon}</div>
              <div>
                <div className="insight-text-title" style={{ color:c.color }}>{c.title}</div>
                <div className="insight-text-body">{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
