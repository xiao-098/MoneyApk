import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBadge from './CategoryBadge';
import useCategoryStore from '../store/useCategoryStore';
import { formatTime } from '../utils/date';

export default function RecordItem({ record, onEdit, onDelete }) {
  const getCategoryById = useCategoryStore((s) => s.getCategoryById);
  const [showActions, setShowActions] = useState(false);
  const category = getCategoryById(record.categoryId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="sticker-card px-4 py-3 mb-2"
    >
      <div className="flex items-center gap-3">
        {category && <CategoryBadge category={category} size="md" showName={false} />}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
            {record.note || category?.name || '未分类'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(61,61,61,0.45)' }}>
            {category?.name} &middot; {formatTime(record.createdAt || record.time)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold whitespace-nowrap" style={{ color: 'var(--coral)' }}>
            -¥{Number(record.amount).toFixed(2)}
          </span>
          <button
            onClick={() => setShowActions((v) => !v)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: 'rgba(61,61,61,0.3)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pt-3 mt-3 border-t" style={{ borderColor: 'rgba(61,61,61,0.06)' }}>
              <button
                onClick={() => {
                  setShowActions(false);
                  onEdit?.(record);
                }}
                className="flex-1 text-xs font-semibold py-1.5 rounded-full border-none cursor-pointer transition-colors"
                style={{ backgroundColor: 'rgba(122,174,212,0.15)', color: 'var(--sky-blue)' }}
              >
                编辑
              </button>
              <button
                onClick={() => {
                  setShowActions(false);
                  onDelete?.(record.id);
                }}
                className="flex-1 text-xs font-semibold py-1.5 rounded-full border-none cursor-pointer transition-colors"
                style={{ backgroundColor: 'rgba(232,146,124,0.15)', color: 'var(--coral)' }}
              >
                删除
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
