import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import CategoryPicker from './CategoryPicker';
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

  const handleSend = (text) => {
    const parsed = parseInput(text);

    // Always show user message
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
      // Category found — save directly
      const record = addRecord({
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
      // No category — show picker
      setPendingParsed({ amount: parsed.amount, note: parsed.note });
      setShowPicker(true);
    }
  };

  const handleCategorySelect = (category) => {
    if (!pendingParsed) return;

    const record = addRecord({
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
      {/* Header */}
      <div
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b px-4 py-3"
        style={{ borderColor: 'rgba(61,61,61,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: 'var(--watercolor-yellow)', opacity: 0.8 }}
          >
            🐻
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
              小熊记账助手
            </h1>
            <p className="text-xs" style={{ color: 'rgba(61,61,61,0.4)' }}>
              随时告诉我你的花销~
            </p>
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-4 pb-4">
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

        {/* Category picker — shown inline when no category matched */}
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

      {/* Input bar — fixed above bottom nav */}
      <div className="sticky bottom-0 z-40" style={{ paddingBottom: '56px' }}>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
