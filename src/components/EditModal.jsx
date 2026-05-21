import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBadge from './CategoryBadge';
import useCategoryStore from '../store/useCategoryStore';

export default function EditModal({ record, onSave, onClose }) {
  const categories = useCategoryStore((s) => s.categories);
  const [amount, setAmount] = useState(record?.amount?.toString() || '');
  const [note, setNote] = useState(record?.note || '');
  const [categoryId, setCategoryId] = useState(record?.categoryId || 'other');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    onSave?.({
      ...record,
      amount: parsedAmount,
      note: note.trim() || null,
      categoryId,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(61,61,61,0.4)' }}
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="sticker-card w-full max-w-sm p-6"
        >
          <h3 className="text-lg font-bold mb-5" style={{ color: 'var(--ink)' }}>
            编辑记录
          </h3>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(61,61,61,0.5)' }}>
              金额
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                style={{ color: 'var(--coral)' }}
              >
                ¥
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-doodle pl-8"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Note */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(61,61,61,0.5)' }}>
              备注
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-doodle"
              placeholder="添加备注..."
            />
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(61,61,61,0.5)' }}>
              分类
            </label>
            <button
              onClick={() => setShowCategoryPicker((v) => !v)}
              className="flex items-center gap-2 w-full input-doodle text-left cursor-pointer"
            >
              {selectedCategory && <CategoryBadge category={selectedCategory} size="sm" showName={false} />}
              <span className="text-sm">{selectedCategory?.name || '选择分类'}</span>
            </button>

            <AnimatePresence>
              {showCategoryPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="grid grid-cols-4 gap-2 p-2 rounded-xl" style={{ backgroundColor: 'rgba(61,61,61,0.03)' }}>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryId(cat.id);
                          setShowCategoryPicker(false);
                        }}
                        className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-none cursor-pointer transition-all ${
                          categoryId === cat.id ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: cat.color + '30',
                          ringColor: categoryId === cat.id ? 'var(--coral)' : undefined,
                        }}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--ink)' }}>
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold border-none cursor-pointer transition-colors"
              style={{ backgroundColor: 'rgba(61,61,61,0.06)', color: 'var(--ink)' }}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex-1 text-sm"
            >
              保存
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
