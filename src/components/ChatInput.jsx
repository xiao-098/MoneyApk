import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ChatInput({ onSend, placeholder = '输入金额和描述...' }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="sticky bottom-0 left-0 right-0 bg-white border-t px-4 py-3"
      style={{ borderColor: 'rgba(61,61,61,0.08)' }}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <input
          type="text"
          className="input-doodle flex-1"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex items-center justify-center w-11 h-11 rounded-full text-white flex-shrink-0 transition-opacity"
          style={{
            backgroundColor: 'var(--coral)',
            opacity: text.trim() ? 1 : 0.5,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
