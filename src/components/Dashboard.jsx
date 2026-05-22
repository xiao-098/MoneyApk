import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useRecordStore from '../store/useRecordStore';
import useCategoryStore from '../store/useCategoryStore';
import { getToday, getCurrentMonth, getLast7Days, getDayOfWeek, isToday, isThisWeek, isThisMonth } from '../utils/date';
import ReceiptModal from './ReceiptModal';

export default function Dashboard() {
  const [period, setPeriod] = useState('month');
  const [showReceipt, setShowReceipt] = useState(false);
  const { records } = useRecordStore();
  const { categories } = useCategoryStore();

  const getDate = (r) => r.record_date || r.date || '';
  const getCatId = (r) => r.category_id || r.categoryId;

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const d = getDate(r);
      if (period === 'day') return isToday(d);
      if (period === 'week') return isThisWeek(d);
      return isThisMonth(d);
    });
  }, [records, period]);

  const totalExpense = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + r.amount, 0);
  }, [filteredRecords]);

  const categoryData = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      const catId = getCatId(r);
      if (!map[catId]) map[catId] = 0;
      map[catId] += r.amount;
    });
    return Object.entries(map)
      .map(([id, value]) => {
        const cat = categories.find(c => c.id === id);
        return { name: cat?.name || '未知', value, color: cat?.color || '#E8D47C', emoji: cat?.emoji || '✨' };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredRecords, categories]);

  const trendData = useMemo(() => {
    const days = getLast7Days();
    return days.map(date => {
      const dayRecords = records.filter(r => getDate(r) === date);
      const total = dayRecords.reduce((sum, r) => sum + r.amount, 0);
      return { date: getDayOfWeek(date), amount: total, fullDate: date };
    });
  }, [records]);

  const dailyRecords = useMemo(() => {
    if (period !== 'day') return [];
    return filteredRecords;
  }, [filteredRecords, period]);

  const weeklyData = useMemo(() => {
    if (period !== 'week') return [];
    const dayMap = {};
    filteredRecords.forEach(r => {
      const day = getDayOfWeek(getDate(r));
      if (!dayMap[day]) dayMap[day] = 0;
      dayMap[day] += r.amount;
    });
    return Object.entries(dayMap).map(([day, amount]) => ({ day, amount }));
  }, [filteredRecords, period]);

  // Daily subtotals grouped by date for week/month views
  const dailySubtotals = useMemo(() => {
    if (period === 'day') return [];
    const dateMap = {};
    filteredRecords.forEach(r => {
      const d = getDate(r);
      if (!dateMap[d]) dateMap[d] = { date: d, total: 0, count: 0 };
      dateMap[d].total += r.amount;
      dateMap[d].count += 1;
    });
    return Object.values(dateMap).sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredRecords, period]);

  const lastMonthTotal = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    return records
      .filter(r => getDate(r).startsWith(lastMonthStr))
      .reduce((sum, r) => sum + r.amount, 0);
  }, [records]);

  const percentChange = useMemo(() => {
    if (lastMonthTotal === 0) return null;
    return ((totalExpense - lastMonthTotal) / lastMonthTotal * 100).toFixed(1);
  }, [totalExpense, lastMonthTotal]);

  return (
    <div className="p-4 pb-24 space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold font-hand">📊 消费看板</h1>
        <div className="flex gap-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
          {['day', 'week', 'month'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                period === p
                  ? 'bg-coral text-white'
                  : 'text-ink/60 hover:text-ink'
              }`}
              style={period === p ? { backgroundColor: 'var(--coral)' } : {}}
            >
              {{ day: '日', week: '周', month: '月' }[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Total expense card */}
      <div className="sticker-card p-5 text-center">
        <p className="text-sm text-ink/50 mb-1">
          {{ day: '今日', week: '本周', month: '本月' }[period]}总支出
        </p>
        <p className="text-3xl font-bold font-mono" style={{ color: 'var(--coral)' }}>
          -¥{totalExpense.toFixed(2)}
        </p>
        {percentChange !== null && (
          <p className={`text-sm mt-1 ${parseFloat(percentChange) <= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            较上月 {parseFloat(percentChange) <= 0 ? '↓' : '↑'}{Math.abs(percentChange)}%
            {parseFloat(percentChange) <= 0 && ' 🎉'}
          </p>
        )}
      </div>

      {/* Charts */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {/* Pie chart */}
          <div className="sticker-card p-4">
            <p className="text-xs text-ink/50 mb-2 font-medium">分类占比</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `¥${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trend chart */}
          <div className="sticker-card p-4">
            <p className="text-xs text-ink/50 mb-2 font-medium">7天趋势</p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip formatter={v => `¥${v.toFixed(2)}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--coral)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--coral)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {categoryData.length > 0 && (
        <div className="sticker-card p-4">
          <p className="text-xs text-ink/50 mb-3 font-medium">分类明细</p>
          <div className="space-y-2.5">
            {categoryData.map(item => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm flex-1">{item.name}</span>
                <span className="text-sm font-mono font-medium" style={{ color: 'var(--coral)' }}>-¥{item.value.toFixed(2)}</span>
                <span className="text-xs text-ink/40 w-12 text-right">
                  {((item.value / totalExpense) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily detail for day view */}
      {period === 'day' && dailyRecords.length > 0 && (
        <div className="sticker-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-ink/50 font-medium">今日明细</p>
            <button
              onClick={() => setShowReceipt(true)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(61,61,61,0.06)' }}
              title="查看小票"
            >
              <span className="text-sm">🧾</span>
            </button>
          </div>
          <div className="space-y-2">
            {dailyRecords.map(r => {
              const cat = categories.find(c => c.id === getCatId(r));
              const isIncome = (r.type || 'expense') === 'income';
              return (
                <div key={r.id} className="flex items-center gap-3 py-1.5">
                  <span className="text-lg">{cat?.emoji || '✨'}</span>
                  <span className="text-sm flex-1">{r.note || cat?.name}</span>
                  <span
                    className="text-sm font-mono font-medium"
                    style={{ color: isIncome ? 'var(--watercolor-green)' : 'var(--coral)' }}
                  >
                    {isIncome ? '+' : '-'}¥{r.amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setShowReceipt(true)}
            className="w-full mt-4 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'rgba(232,146,124,0.08)',
              color: 'var(--coral)',
              border: '1.5px dashed var(--coral)',
              cursor: 'pointer',
            }}
          >
            🧾 打印小票
          </button>
        </div>
      )}

      {/* Daily subtotals for week/month views */}
      {period !== 'day' && dailySubtotals.length > 0 && (
        <div className="sticker-card p-4">
          <p className="text-xs text-ink/50 mb-3 font-medium">
            {period === 'week' ? '每日小计' : '每日小计'}
          </p>
          <div className="space-y-2">
            {dailySubtotals.map(item => (
              <div key={item.date} className="flex items-center gap-3 py-1.5">
                <span className="text-xs w-16 text-ink/50">
                  {item.date.slice(5)}
                </span>
                <span className="text-xs text-ink/30 flex-1">
                  {getDayOfWeek(item.date)} · {item.count}笔
                </span>
                <span className="text-sm font-mono font-medium" style={{ color: 'var(--coral)' }}>
                  -¥{item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: '1px dashed rgba(61,61,61,0.1)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              合计
            </span>
            <span className="text-lg font-bold font-mono" style={{ color: 'var(--coral)' }}>
              -¥{totalExpense.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          date={getToday()}
          records={dailyRecords}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* Weekly bar view */}
      {period === 'week' && weeklyData.length > 0 && (
        <div className="sticker-card p-4">
          <p className="text-xs text-ink/50 mb-3 font-medium">本周分布</p>
          <div className="space-y-2">
            {weeklyData.map(item => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="text-xs w-8 text-ink/50">{item.day}</span>
                <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((item.amount / Math.max(...weeklyData.map(w => w.amount))) * 100, 100)}%`,
                      backgroundColor: 'var(--coral)',
                      opacity: 0.7
                    }}
                  />
                </div>
                <span className="text-xs font-mono w-16 text-right" style={{ color: 'var(--coral)' }}>-¥{item.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12 text-ink/30">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm">还没有记录哦，去记一笔吧~</p>
        </div>
      )}
    </div>
  );
}
