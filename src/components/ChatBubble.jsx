import { motion } from 'framer-motion';
import CategoryBadge from './CategoryBadge';
import StickerAnimal from './StickerAnimal';
import useCategoryStore from '../store/useCategoryStore';

const bubbleVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function ChatBubble({ type = 'bot', children, record }) {
  const getCategoryById = useCategoryStore((s) => s.getCategoryById);
  const isBot = type === 'bot';

  return (
    <motion.div
      className={`flex ${isBot ? 'justify-start items-end' : 'justify-end'} mb-3 px-4`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {isBot && (
        <div className="bot-avatar-ring mr-1.5 mb-0.5">
          <StickerAnimal animal="bear" size={20} />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isBot ? 'chat-bubble-bot' : 'chat-bubble-user'
        }`}
      >
        {record && (
          <RecordCard record={record} getCategoryById={getCategoryById} />
        )}
        {children && (
          <div className={`text-sm leading-relaxed ${isBot ? '' : 'text-white'}`}>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RecordCard({ record, getCategoryById }) {
  const category = getCategoryById(record.category_id || record.categoryId);
  const isIncome = (record.type || 'expense') === 'income';

  return (
    <div className="flex items-center gap-3 py-1">
      {category && <CategoryBadge category={category} size="sm" showName={false} />}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
          {record.note || category?.name || '未分类'}
        </div>
      </div>
      <div
        className="text-sm font-bold whitespace-nowrap"
        style={{ color: isIncome ? 'var(--watercolor-green)' : 'var(--coral)' }}
      >
        {isIncome ? '+' : '-'}¥{Number(record.amount).toFixed(2)}
      </div>
    </div>
  );
}
