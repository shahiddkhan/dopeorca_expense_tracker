import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles/components.css';

import BottomNav       from './components/BottomNav';
import AddExpenseSheet from './components/AddExpenseSheet';
import Toast           from './components/Toast';
import Home            from './pages/Home';
import History         from './pages/History';
import Goals           from './pages/Goals';
import Insights        from './pages/Insights';

import {
  fetchExpenses, addExpense, deleteExpense,
  fetchIncome,   updateIncome,
  fetchGoals,    addGoal,    deleteGoal,
} from './data/store';

export default function App() {
  const [tab,       setTab]       = useState('home');
  const [expenses,  setExpenses]  = useState([]);
  const [income,    setIncome]    = useState(0);
  const [goals,     setGoals]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showAdd,   setShowAdd]   = useState(false);
  const [showInc,   setShowInc]   = useState(false);
  const [incAmt,    setIncAmt]    = useState('');
  const [busy,      setBusy]      = useState(false);
  const [notif,     setNotif]     = useState(null);
  const toastRef = useRef(null);

  useEffect(() => {
    Promise.all([fetchExpenses(), fetchIncome(), fetchGoals()]).then(([exp, inc, gls]) => {
      setExpenses(exp);
      setIncome(inc);
      setGoals(gls);
      setLoading(false);
    });
  }, []);

  // Escape key closes any open sheet
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setShowAdd(false);
        setShowInc(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toast = useCallback((msg, type = 'ok') => {
    setNotif({ msg, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setNotif(null), 2800);
  }, []);

  async function handleAddExpense(data) {
    const now = new Date();
    const optimistic = {
      id:       `opt-${Date.now()}`,
      amount:   data.amount,
      label:    data.label,
      category: data.category,
      date:     now.toISOString().split('T')[0],
      time:     now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic: show instantly, close sheet immediately
    setExpenses(p => [optimistic, ...p]);
    setShowAdd(false);
    toast('Expense logged ✓');

    try {
      const saved = await addExpense(data);
      // Replace optimistic entry with real DB row
      setExpenses(p => p.map(e => e.id === optimistic.id ? saved : e));
    } catch {
      // Rollback on failure
      setExpenses(p => p.filter(e => e.id !== optimistic.id));
      toast('Failed to save — try again', 'err');
    }
  }

  async function handleDeleteExpense(id) {
    await deleteExpense(id);
    setExpenses(p => p.filter(e => e.id !== id));
    toast('Removed', 'warn');
  }

  async function handleSaveIncome() {
    const v = parseFloat(incAmt);
    if (!v || v <= 0) return toast('Enter a valid amount', 'err');
    setBusy(true);
    await updateIncome(v);
    setIncome(v);
    setShowInc(false);
    setIncAmt('');
    toast('Income updated ✓');
    setBusy(false);
  }

  async function handleAddGoal(data) {
    const g = await addGoal(data);
    setGoals(p => [...p, g]);
    toast('Goal created ✓');
  }

  async function handleDeleteGoal(id) {
    await deleteGoal(id);
    setGoals(p => p.filter(g => g.id !== id));
    toast('Goal removed', 'warn');
  }

  if (loading) return (
    <div className="loader-screen">
      <div className="loader-ring" />
      <div className="loader-label">DOPEORCA</div>
    </div>
  );

  return (
    <div className="app-shell">
      <Toast notif={notif} />

      {showAdd && (
        <AddExpenseSheet
          onClose={() => setShowAdd(false)}
          onSave={handleAddExpense}
          busy={busy}
        />
      )}

      {showInc && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowInc(false)} />
          <div className="bottom-sheet">
            <button className="sheet-close-btn" onClick={() => setShowInc(false)} aria-label="Close">✕</button>
            <div className="sheet-handle" />
            <div className="sheet-title">SET INCOME</div>
            <div className="sheet-sub">Your monthly take-home salary</div>
            <div className="amount-disp">
              <div className="amount-disp-label">Monthly Income</div>
              <div className={`amount-disp-val${incAmt ? ' has-val' : ''}`}>
                {incAmt ? `₹${parseFloat(incAmt).toLocaleString('en-IN')}` : <span style={{ color: '#D1D5DB' }}>₹0</span>}
              </div>
            </div>
            <div className="numpad-grid">
              {['1','2','3','4','5','6','7','8','9','.','0','del'].map(k => (
                <button key={k} className={`num-btn${k === 'del' ? ' del' : ''}`} onClick={() => {
                  if (k === 'del') { setIncAmt(p => p.slice(0, -1)); return; }
                  if (k === '.' && incAmt.includes('.')) return;
                  if (incAmt.replace('.', '').length >= 8) return;
                  setIncAmt(p => p + k);
                }}>
                  {k === 'del' ? '⌫' : k}
                </button>
              ))}
            </div>
            <button className="confirm-btn" onClick={handleSaveIncome} disabled={!incAmt || busy}>
              {busy ? 'SAVING...' : 'CONFIRM'}
            </button>
          </div>
        </>
      )}

      {tab === 'home' && (
        <Home
          expenses={expenses}
          income={income}
          onAdd={() => setShowAdd(true)}
          onIncome={() => { setIncAmt(income ? String(income) : ''); setShowInc(true); }}
        />
      )}
      {tab === 'history' && (
        <History expenses={expenses} onDelete={handleDeleteExpense} />
      )}
      {tab === 'goals' && (
        <Goals goals={goals} onAdd={handleAddGoal} onDelete={handleDeleteGoal} />
      )}
      {tab === 'insights' && (
        <Insights expenses={expenses} income={income} />
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
