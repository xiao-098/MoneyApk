import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRecordStore from '../store/useRecordStore';
import useCategoryStore from '../store/useCategoryStore';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const receiptVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
};

export default function ReceiptModal({ date, records: propRecords, onClose }) {
  const storeRecords = useRecordStore((s) => s.records);
  const getCategoryById = useCategoryStore((s) => s.getCategoryById);

  const dayRecords = useMemo(() => {
    if (propRecords && propRecords.length > 0) return propRecords;
    return storeRecords.filter((r) => (r.record_date || r.date) === date);
  }, [propRecords, storeRecords, date]);

  const total = useMemo(() => {
    return dayRecords.reduce((sum, r) => sum + r.amount, 0);
  }, [dayRecords]);

  const formattedDate = useMemo(() => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }, [date]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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

        {/* Receipt */}
        <motion.div
          className="relative w-full max-w-xs bg-white rounded-lg overflow-hidden print:shadow-none"
          style={{
            border: '2px dashed rgba(61,61,61,0.2)',
            maxHeight: '80vh',
          }}
          variants={receiptVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 70px)' }}>
            {/* Store name */}
            <div className="text-center mb-4">
              <p className="text-2xl mb-1">🐻</p>
              <p className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
                小熊记账
              </p>
              <p className="text-xs text-ink/40 mt-1">电子小票</p>
            </div>

            {/* Date */}
            <div className="text-center mb-4">
              <p className="text-sm text-ink/60">{formattedDate}</p>
            </div>

            {/* Dashed separator */}
            <div
              className="border-t border-dashed mb-4"
              style={{ borderColor: 'rgba(61,61,61,0.2)' }}
            />

            {/* Record list */}
            <div className="space-y-3 mb-4">
              {dayRecords.length === 0 ? (
                <p className="text-center text-sm text-ink/30 py-4">暂无记录</p>
              ) : (
                dayRecords.map((r) => {
                  const cat = getCategoryById(r.category_id || r.categoryId);
                  const isIncome = (r.type || 'expense') === 'income';
                  return (
                    <div key={r.id} className="flex items-center gap-2">
                      <span className="text-base">{cat?.emoji || '✨'}</span>
                      <span className="text-sm flex-1 truncate" style={{ color: 'var(--ink)' }}>
                        {r.note || cat?.name || '未分类'}
                      </span>
                      <span
                        className="text-sm font-mono font-semibold whitespace-nowrap"
                        style={{ color: isIncome ? 'var(--watercolor-green)' : 'var(--coral)' }}
                      >
                        {isIncome ? '+' : '-'}¥{Number(r.amount).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Dashed separator */}
            <div
              className="border-t border-dashed mb-4"
              style={{ borderColor: 'rgba(61,61,61,0.2)' }}
            />

            {/* Total */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                合计
              </span>
              <span
                className="text-2xl font-bold font-mono"
                style={{ color: 'var(--coral)' }}
              >
                -¥{total.toFixed(2)}
              </span>
            </div>

            {/* Item count */}
            <p className="text-center text-xs text-ink/30 mt-4">
              共 {dayRecords.length} 笔记录
            </p>
            <p className="text-center text-xs text-ink/20 mt-1">
              --- 感谢使用小熊记账 ---
            </p>
          </div>

          {/* Action buttons */}
          <div
            className="flex gap-3 p-4 border-t print:hidden"
            style={{ borderColor: 'rgba(61,61,61,0.08)' }}
          >
            <button
              onClick={handlePrint}
              className="btn-primary flex-1 text-sm py-2.5"
            >
              打印
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-sm py-2.5 rounded-full font-bold transition-colors"
              style={{
                backgroundColor: 'rgba(61,61,61,0.06)',
                color: 'var(--ink)',
              }}
            >
              关闭
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
