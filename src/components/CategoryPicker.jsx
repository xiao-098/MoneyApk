import { motion } from 'framer-motion';
import useCategoryStore from '../store/useCategoryStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function CategoryPicker({ onSelect, categories: categoriesProp }) {
  const storeCategories = useCategoryStore((s) => s.categories);
  const categories = categoriesProp || storeCategories;

  // Filter out 'other' and sort by sortOrder
  const sorted = categories
    .filter((c) => c.id !== 'other')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="px-4 pb-3">
      {/* Bot prompt */}
      <div className="flex justify-start mb-3 px-1">
        <div className="chat-bubble-bot px-4 py-3 text-sm" style={{ color: 'var(--ink)' }}>
          这笔花在什么地方呀？点一下~
        </div>
      </div>

      {/* Category grid */}
      <motion.div
        className="grid grid-cols-3 gap-2.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sorted.map((cat) => (
          <motion.button
            key={cat.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect?.(cat)}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-none cursor-pointer transition-shadow"
            style={{
              backgroundColor: cat.color + '25',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white doodle-shadow"
              style={{ backgroundColor: cat.color, fontSize: '1.5rem' }}
            >
              {cat.emoji}
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
              {cat.name}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
