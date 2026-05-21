import { motion } from 'framer-motion';

const sizeMap = {
  sm: { container: 24, text: 'text-[10px]', emoji: 'text-xs' },
  md: { container: 32, text: 'text-xs', emoji: 'text-sm' },
  lg: { container: 48, text: 'text-sm', emoji: 'text-lg' },
};

const tiltClasses = ['sticker-tilt-1', 'sticker-tilt-2', 'sticker-tilt-3', 'sticker-tilt-4'];

export default function CategoryBadge({ category, size = 'md', showName = true, className = '' }) {
  if (!category) return null;

  const s = sizeMap[size] || sizeMap.md;
  const tilt = tiltClasses[Math.abs(hashCode(category.id)) % tiltClasses.length];

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`${tilt} flex items-center justify-center rounded-full border-2 border-white doodle-shadow`}
        style={{
          width: s.container,
          height: s.container,
          backgroundColor: category.color || '#E8D47C',
          fontSize: s.container * 0.5,
        }}
      >
        {category.emoji || '✨'}
      </div>
      {showName && (
        <span className={`font-semibold ${s.text}`} style={{ color: 'var(--ink)' }}>
          {category.name}
        </span>
      )}
    </motion.div>
  );
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
