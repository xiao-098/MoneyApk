import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSavingsStore from '../store/useSavingsStore';
import { getToday } from '../utils/date';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function SavingsGoal() {
  const { goals, addGoal, deleteGoal, depositToGoal, getActiveGoals } = useSavingsStore();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState('');
  const [depositId, setDepositId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const activeGoals = useMemo(() => getActiveGoals(), [goals]);

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const handleCreateGoal = () => {
    const numAmount = parseFloat(targetAmount);
    if (!name.trim() || !numAmount || numAmount <= 0) return;

    addGoal({
      name: name.trim(),
      targetAmount: numAmount,
      startDate,
      endDate: endDate || null,
    });

    setName('');
    setTargetAmount('');
    setStartDate(getToday());
    setEndDate('');
    setShowForm(false);
  };

  const handleDeposit = (goalId) => {
    const numAmount = parseFloat(depositAmount);
    if (!numAmount || numAmount <= 0) return;

    depositToGoal(goalId, numAmount);
    setDepositId(null);
    setDepositAmount('');
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', color: 'var(--watercolor-green)' };
      case 'expired':
        return { text: '已过期', color: 'var(--ink)' };
      default:
        return { text: '进行中', color: 'var(--coral)' };
    }
  };

  return (
    <div className="p-4 pb-24 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold font-hand">🐷 存钱目标</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm py-2 px-4"
        >
          {showForm ? '取消' : '+ 新目标'}
        </button>
      </div>

      {/* Create goal form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="sticker-card p-5 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
              创建存钱目标
            </h3>

            <div>
              <label className="text-xs text-ink/50 font-medium mb-1.5 block">
                用来干嘛
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：买新手机、旅行基金..."
                className="input-doodle text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-ink/50 font-medium mb-1.5 block">
                目标金额
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base font-bold pointer-events-none" style={{ color: 'rgba(61,61,61,0.4)' }}>
                  ¥
                </span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-doodle pl-12 text-sm font-mono"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-ink/50 font-medium mb-1.5 block">
                  开始日期
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-doodle text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-ink/50 font-medium mb-1.5 block">
                  截止日期 (可选)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-doodle text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleCreateGoal}
              className="btn-primary w-full text-sm py-2.5"
              disabled={!name.trim() || !parseFloat(targetAmount)}
              style={{
                opacity: name.trim() && parseFloat(targetAmount) ? 1 : 0.5,
              }}
            >
              创建目标
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals list */}
      <AnimatePresence>
        {activeGoals.length === 0 && !showForm ? (
          <motion.div
            className="text-center py-16 text-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-5xl mb-4">🐷</p>
            <p className="text-sm">还没有存钱目标哦</p>
            <p className="text-xs mt-1">设定一个目标，开始攒钱吧~</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {activeGoals.map((goal) => {
              const progress = getProgress(goal.current_amount, goal.target_amount);
              const daysLeft = getDaysRemaining(goal.end_date);
              const status = statusLabel(goal.status);
              const isDepositing = depositId === goal.id;

              return (
                <motion.div
                  key={goal.id}
                  className="sticker-card p-5"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  {/* Goal header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-bold" style={{ color: 'var(--ink)' }}>
                        {goal.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${status.color}18`,
                            color: status.color,
                          }}
                        >
                          {status.text}
                        </span>
                        {daysLeft !== null && goal.status === 'active' && (
                          <span className="text-xs text-ink/40">
                            还剩 {daysLeft} 天
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-ink/20 hover:text-red-400 transition-colors text-sm"
                    >
                      删除
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progress}%`,
                          backgroundColor:
                            goal.status === 'completed'
                              ? 'var(--watercolor-green)'
                              : 'var(--coral)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Amount info */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono" style={{ color: 'var(--ink)' }}>
                      <span className="font-bold" style={{ color: 'var(--coral)' }}>
                        ¥{(goal.current_amount || 0).toFixed(0)}
                      </span>
                      <span className="text-ink/30"> / ¥{goal.target_amount.toFixed(0)}</span>
                    </span>
                    <span className="text-xs font-mono text-ink/40">
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  {/* Deposit action */}
                  {goal.status === 'active' && (
                    <>
                      {isDepositing ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="存入金额"
                            className="input-doodle text-sm flex-1"
                            min="0"
                            step="0.01"
                            autoFocus
                          />
                          <button
                            onClick={() => handleDeposit(goal.id)}
                            className="btn-primary text-sm py-2 px-4"
                          >
                            存入
                          </button>
                          <button
                            onClick={() => {
                              setDepositId(null);
                              setDepositAmount('');
                            }}
                            className="text-sm px-3 py-2 text-ink/40 hover:text-ink/70"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDepositId(goal.id)}
                          className="w-full py-2 rounded-full text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: 'rgba(126,184,166,0.1)',
                            color: 'var(--watercolor-green)',
                            border: '1.5px dashed var(--watercolor-green)',
                            cursor: 'pointer',
                          }}
                        >
                          💰 存一笔
                        </button>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
