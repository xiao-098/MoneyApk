import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCategoryStore from '../store/useCategoryStore';
import { getToday } from '../utils/date';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
};

export default function AddRecordModal({ onClose, onSave }) {
  const { categories } = useCategoryStore();

  const [recordType, setRecordType] = useState('expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getToday());

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const catType = c.type || 'expense';
      return catType === recordType;
    });
  }, [categories, recordType]);

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;
    if (!selectedCategoryId) return;

    onSave({
      amount: numAmount,
      category_id: selectedCategoryId,
      note: note.trim() || null,
      record_date: date,
      type: recordType,
    });

    // Reset form
    setAmount('');
    setNote('');
    setSelectedCategoryId(null);
    onClose();
  };

  const canSave = parseFloat(amount) > 0 && selectedCategoryId;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-t-3xl overflow-hidden"
          style={{ maxHeight: '90vh' }}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: 'rgba(61,61,61,0.15)' }}
            />
          </div>

          <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
                手动记账
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(61,61,61,0.06)' }}
              >
                <span className="text-ink/40 text-lg">&times;</span>
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2 mb-5">
              {[
                { key: 'expense', label: '支出', emoji: '💸' },
                { key: 'income', label: '收入', emoji: '💰' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setRecordType(t.key);
                    setSelectedCategoryId(null);
                  }}
                  className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all"
                  style={{
                    backgroundColor:
                      recordType === t.key ? 'var(--coral)' : 'rgba(61,61,61,0.04)',
                    color: recordType === t.key ? 'white' : 'var(--ink)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            {/* Amount input */}
            <div className="mb-5">
              <label className="text-xs text-ink/50 font-medium mb-2 block">
                金额
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-doodle flex-1 text-lg font-mono font-bold"
                  min="0"
                  step="0.01"
                  autoFocus
                />
                <span
                  className="text-lg font-bold flex-shrink-0"
                  style={{ color: 'rgba(61,61,61,0.5)' }}
                >
                  元
                </span>
              </div>
            </div>

            {/* Category grid */}
            <div className="mb-5">
              <label className="text-xs text-ink/50 font-medium mb-2 block">
                分类
              </label>
              <div className="grid grid-cols-4 gap-2">
                {filteredCategories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: isSelected ? `${cat.color}22` : 'rgba(61,61,61,0.03)',
                        border: isSelected
                          ? `2px solid ${cat.color}`
                          : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: isSelected ? cat.color : 'var(--ink)' }}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note input */}
            <div className="mb-5">
              <label className="text-xs text-ink/50 font-medium mb-2 block">
                备注 (可选)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="写点什么..."
                className="input-doodle text-sm"
              />
            </div>

            {/* Date picker */}
            <div className="mb-6">
              <label className="text-xs text-ink/50 font-medium mb-2 block">
                日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-doodle text-sm"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full text-sm font-bold transition-colors"
                style={{
                  backgroundColor: 'rgba(61,61,61,0.06)',
                  color: 'var(--ink)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="btn-primary flex-1 text-sm py-3"
                style={{
                  opacity: canSave ? 1 : 0.5,
                  cursor: canSave ? 'pointer' : 'not-allowed',
                }}
              >
                保存
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
