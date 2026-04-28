import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://crtbcqedyxfzdwtzfpgh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydGJjcWVkeXhmemR3dHpmcGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTQ1MzksImV4cCI6MjA5MjkzMDUzOX0.gDXr-Lu6w0DuYA-Ua2ShTL3MHU6XJMrPfVYTBr-O_WI'
);

// ── Expense fns ──
export async function fetchExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addExpense(exp) {
  const now = new Date();
  const row = {
    amount:   exp.amount,
    label:    exp.label,
    category: exp.category,
    date:     now.toISOString().split('T')[0],
    time:     now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
  const { data, error } = await supabase
    .from('expenses')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id) {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ── Income fns ──
export async function fetchIncome() {
  const { data, error } = await supabase
    .from('income')
    .select('amount')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data.amount;
}

export async function updateIncome(val) {
  const { data, error } = await supabase
    .from('income')
    .upsert({ id: 1, amount: val })
    .select()
    .single();
  if (error) throw error;
  return data.amount;
}

// ── Goals fns ──
export async function fetchGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addGoal(goal) {
  const row = {
    name:   goal.name,
    target: goal.target,
    saved:  0,
    months: goal.months,
  };
  const { data, error } = await supabase
    .from('goals')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGoal(id) {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateGoalSaved(id, amount) {
  const { data: current, error: fetchErr } = await supabase
    .from('goals')
    .select('saved, target')
    .eq('id', id)
    .single();
  if (fetchErr) throw fetchErr;

  const newSaved = Math.min(current.saved + amount, current.target);
  const { data, error } = await supabase
    .from('goals')
    .update({ saved: newSaved })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
