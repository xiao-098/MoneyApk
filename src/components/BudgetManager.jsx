import { useState, useMemo } from 'react';
import useBudgetStore from '../store/useBudgetStore';
import useRecordStore from '../store/useRecordStore';
import useCategoryStore from '../store/useCategoryStore';
import { getCurrentMonth } from '../utils/date';

export default function BudgetManager() {
  const currentMonth = getCurrentMonth();
  const { budgets, setBudget } = useBudgetStore();
  const { records } = useRecordStore();
  const { categories } = useCategoryStore();
  const [editingCategory, setEditingCategory] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const monthBudgets = useMemo(() => {
    return budgets.filter(b => b.month === currentMonth);
  }, [budgets, currentMonth]);

  const totalBudget = useMemo(() => {
    return monthBudgets.reduce((sum, b) => sum + b.monthly_limit, 0);
  }, [monthBudgets]);

  const monthRecords = useMemo(() => {
    return records.filter(r => (r.record_date || r.date || '').startsWith(currentMonth));
  }, [records, currentMonth]);

  const totalSpent = useMemo(() => {
    return monthRecords.reduce((sum, r) => sum + r.amount, 0);
  }, [monthRecords]);

  const categorySpend = useMemo(() => {
    const map = {};
    monthRecords.forEach(r => {
      const catId = r.category_id || r.categoryId;
      if (!map[catId]) map[catId] = 0;
      map[catId] += r.amount;
    });
    return map;
  }, [monthRecords]);

  const handleSave = (categoryId) => {
    const limit = parseFloat(inputValue);
    if (limit > 0) {
      setBudget(categoryId, currentMonth, limit, 'local-user');
    }
    setEditingCategory(null);
    setInputValue('');
  };

  const totalPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="p-4 pb-24 space-y-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold font-hand mb-2">💰 预算管理</h1>

      {/* Total budget card */}
      <div className="sticker-card p-5">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-sm text-ink/50">本月总预算</span>
          <span className="text-2xl font-bold font-mono" style={{ color: 'var(--coral)' }}>
            ¥{totalBudget.toFixed(0)}
          </span>
        </div>
        <div className="progress-bar mb-2">
          <div
            className="progress-bar-fill"
            style={{
              width: `${totalPercent}%`,
              backgroundColor: totalPercent > 90 ? '#e74c3c' : totalPercent > 70 ? '#f39c12' : 'var(--coral)'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-ink/40">
          <span>已花 ¥{totalSpent.toFixed(0)}</span>
          <span>
            {totalBudget > 0
              ? (totalRemaining >= 0 ? `剩余 ¥${totalRemaining.toFixed(0)}` : `超支 ¥${Math.abs(totalRemaining).toFixed(0)}`)
              : '未设置预算'
            }
          </span>
        </div>
      </div>

      {/* Category budgets */}
      <div className="space-y-3">
        {categories.map(cat => {
          const budget = monthBudgets.find(b => b.category_id === cat.id);
          const spent = categorySpend[cat.id] || 0;
          const limit = budget?.monthly_limit || 0;
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isOver = spent > limit && limit > 0;
          const isNear = percent > 75 && limit > 0;
          const isEditing = editingCategory === cat.id;

          return (
            <div key={cat.id} className="sticker-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-sm font-medium flex-1">{cat.name}</span>
                {budget ? (
                  <span className="text-xs font-mono text-ink/50">
                    ¥{spent.toFixed(0)} / ¥{limit.toFixed(0)}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setEditingCategory(cat.id);
                      setInputValue('');
                    }}
                    className="text-xs px-2 py-1 rounded-full border border-dashed transition-colors"
                    style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }}
                  >
                    + 设置预算
                  </button>
                )}
              </div>

              {budget && (
                <>
                  <div className="progress-bar mb-1">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: isOver ? '#e74c3c' : isNear ? '#f39c12' : cat.color
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-ink/40">
                    <span>{percent.toFixed(0)}%</span>
                    {isOver && <span className="text-red-400 font-medium">⚠️ 已超支</span>}
                    {isNear && !isOver && <span className="text-amber-500">快超了</span>}
                    <button
                      onClick={() => {
                        setEditingCategory(cat.id);
                        setInputValue(limit.toString());
                      }}
                      className="text-ink/30 hover:text-ink/60"
                    >
                      编辑
                    </button>
                  </div>
                </>
              )}

              {isEditing && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="输入月预算金额"
                    className="input-doodle text-sm flex-1"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleSave(cat.id)}
                  />
                  <button
                    onClick={() => handleSave(cat.id)}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => { setEditingCategory(null); setInputValue(''); }}
                    className="text-sm px-3 py-2 text-ink/40 hover:text-ink/70"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
