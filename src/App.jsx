import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ChatView from './components/ChatView';
import Dashboard from './components/Dashboard';
import BudgetManager from './components/BudgetManager';
import SavingsGoal from './components/SavingsGoal';
import AddRecordModal from './components/AddRecordModal';
import useRecordStore from './store/useRecordStore';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const addRecord = useRecordStore((s) => s.addRecord);

  const handleSaveRecord = (record) => {
    addRecord(record);
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'chat' && <ChatView />}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'budget' && <BudgetManager />}
      {activeTab === 'savings' && <SavingsGoal />}

      {/* Floating Action Button on chat page */}
      {activeTab === 'chat' && (
        <button
          onClick={() => setShowAddRecord(true)}
          className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{
            backgroundColor: 'var(--coral)',
            bottom: '80px',
            right: '20px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Add Record Modal */}
      <AnimatePresence>
        {showAddRecord && (
          <AddRecordModal
            onClose={() => setShowAddRecord(false)}
            onSave={handleSaveRecord}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
