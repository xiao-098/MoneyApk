import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import CategoryPicker from './CategoryPicker';
import StickerAnimal from './StickerAnimal';
import { parseInput } from '../utils/parser';
import useRecordStore from '../store/useRecordStore';
import useBudgetStore from '../store/useBudgetStore';
import useCategoryStore from '../store/useCategoryStore';
import { getToday, getCurrentMonth } from '../utils/date';

const INITIAL_MESSAGE = {
  id: 'init',
  type: 'bot',
  text: '你好呀！今天花了多少，告诉我就好~ 💬',
};

export default function ChatView() {
  const addRecord = useRecordStore((s) => s.addRecord);
  const records = useRecordStore((s) => s.records);
  const budgets = useBudgetStore((s) => s.budgets);
  const categories = useCategoryStore((s) => s.categories);

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [showPicker, setShowPicker] = useState(false);
  const [pendingParsed, setPendingParsed] = useState(null);
  const scrollRef = useRef(null);

  const todayStats = useMemo(() => {
    const today = getToday();
    const todayRecords = records.filter((r) => (r.record_date || r.date) === today);
    const total = todayRecords.reduce((sum, r) => sum + r.amount, 0);
    const catCount = {};
    todayRecords.forEach((r) => {
      const cid = r.category_id || r.categoryId;
      catCount[cid] = (catCount[cid] || 0) + r.amount;
    });
    const topCatId = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topCat = categories.find((c) => c.id === topCatId);
    return { total, count: todayRecords.length, topCat, recentRecords: todayRecords.slice(0, 5) };
  }, [records, categories]);

  const categoryBar = useMemo(() => {
    if (todayStats.recentRecords.length === 0) return [];
    const catAmounts = {};
    todayStats.recentRecords.forEach((r) => {
      const cid = r.category_id || r.categoryId;
      catAmounts[cid] = (catAmounts[cid] || 0) + r.amount;
    });
    return Object.entries(catAmounts)
      .map(([id, amount]) => {
        const cat = categories.find((c) => c.id === id);
        return { id, amount, color: cat?.color || '#E8D47C', name: cat?.name || '' };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [todayStats, categories]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showPicker, scrollToBottom]);

  const checkBudgetWarning = (categoryId) => {
    const currentMonth = getCurrentMonth();
    const budget = budgets.find(
      (b) => b.category_id === categoryId && b.month === currentMonth
    );
    if (!budget) return null;

    const monthRecords = records.filter(
      (r) => (r.category_id || r.categoryId) === categoryId && (r.record_date || r.date || '').startsWith(currentMonth)
    );
    const spent = monthRecords.reduce((sum, r) => sum + r.amount, 0);
    const percent = (spent / budget.monthly_limit) * 100;
    const catName = categories.find((c) => c.id === categoryId)?.name || '';

    if (percent >= 100) return `⚠️ ${catName}这个月已经超预算了！`;
    if (percent >= 80) return `注意哦，${catName}这个月快到预算上限了 🐾`;
    return null;
  };

  const handleSend = async (text) => {
    const parsed = parseInput(text);

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', text },
    ]);

    if (!parsed) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: '嗯...没看懂金额呢，试试像 "午餐 35" 这样告诉我~',
        },
      ]);
      return;
    }

    if (parsed.category) {
      const record = await addRecord({
        amount: parsed.amount,
        note: parsed.note,
        categoryId: parsed.category.id,
      });

      const budgetWarning = checkBudgetWarning(parsed.category.id);
      const confirmText =
        budgetWarning ||
        `记好啦！${parsed.category.emoji} ${parsed.category.name} ¥${parsed.amount.toFixed(2)} 已记录~`;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: confirmText,
          record,
        },
      ]);
    } else {
      setPendingParsed({ amount: parsed.amount, note: parsed.note });
      setShowPicker(true);
    }
  };

  const handleCategorySelect = async (category) => {
    if (!pendingParsed) return;

    const record = await addRecord({
      amount: pendingParsed.amount,
      note: pendingParsed.note,
      categoryId: category.id,
    });

    const budgetWarning = checkBudgetWarning(category.id);
    const confirmText =
      budgetWarning ||
      `记好啦！${category.emoji} ${category.name} ¥${pendingParsed.amount.toFixed(2)} 已记录~`;

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: confirmText,
        record,
      },
    ]);

    setPendingParsed(null);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto relative">
      {/* Header — 手账风 */}
      <div
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b px-4 py-3"
        style={{ borderColor: 'rgba(61,61,61,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div className="sticker-tilt-2">
            <StickerAnimal animal="bear" size={36} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-hand" style={{ color: 'var(--ink)' }}>
              小熊记账助手
            </h1>
            <p className="text-xs" style={{ color: 'rgba(61,61,61,0.45)' }}>
              随时告诉我你的花销~
            </p>
          </div>
        </div>
      </div>

      {/* Today summary card — 手账风 */}
      <div className="px-4 pt-3 pb-1">
        <motion.div
          className="journal-card p-4"
          style={{ transform: 'rotate(-0.5deg)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-hand" style={{ color: 'rgba(61,61,61,0.45)' }}>今日消费</p>
              <p className="text-2xl font-bold font-mono mt-0.5" style={{ color: 'var(--coral)' }}>
                ¥{todayStats.total.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'rgba(61,61,61,0.45)' }}>
                {todayStats.count} 笔记录
              </p>
              {todayStats.topCat && (
                <p className="text-xs mt-1" style={{ color: 'rgba(61,61,61,0.5)' }}>
                  {todayStats.topCat.emoji} {todayStats.topCat.name}最多
                </p>
              )}
            </div>
          </div>

          {/* Mini category color bar */}
          {categoryBar.length > 0 && (
            <div className="mt-3">
              <div className="category-bar-track">
                {categoryBar.map((seg) => (
                  <div
                    key={seg.id}
                    className="category-bar-fill"
                    style={{
                      width: `${(seg.amount / todayStats.total) * 100}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                {categoryBar.slice(0, 4).map((seg) => (
                  <span key={seg.id} className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(61,61,61,0.45)' }}>
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                    {seg.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent records as mini chips */}
          {todayStats.recentRecords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px dashed rgba(61,61,61,0.1)' }}>
              {todayStats.recentRecords.map((r) => {
                const cat = categories.find((c) => c.id === (r.category_id || r.categoryId));
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                    style={{ backgroundColor: `${cat?.color || '#E8D47C'}20`, color: 'var(--ink)' }}
                  >
                    <span>{cat?.emoji || '✨'}</span>
                    <span className="font-medium">{r.note || cat?.name}</span>
                    <span className="font-mono font-bold" style={{ color: 'var(--coral)' }}>
                      ¥{Number(r.amount).toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {todayStats.count === 0 && (
            <p className="text-xs mt-2" style={{ color: 'rgba(61,61,61,0.3)' }}>
              还没有消费记录，告诉我你今天花了多少吧~
            </p>
          )}
        </motion.div>
      </div>

      {/* Chat messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-2 pb-4">
        {/* Empty state — 大小熊 + 手写引导 */}
        {messages.length === 1 && todayStats.count === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-10 px-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div style={{ animation: 'floatBear 3s ease-in-out infinite' }}>
              <StickerAnimal animal="bear" size={80} />
            </div>
            <p className="font-hand text-lg mt-4" style={{ color: 'var(--ink)' }}>
              今天还没有消费哦~
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(61,61,61,0.35)' }}>
              告诉小熊你花了什么，帮你记下来
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubble type={msg.type} record={msg.record}>
                {msg.text}
              </ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>

        {showPicker && pendingParsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryPicker
              onSelect={handleCategorySelect}
              categories={categories}
            />
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 z-40" style={{ paddingBottom: '56px' }}>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
