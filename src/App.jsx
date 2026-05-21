import { useState } from 'react';
import Layout from './components/Layout';
import ChatView from './components/ChatView';
import Dashboard from './components/Dashboard';
import BudgetManager from './components/BudgetManager';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'chat' && <ChatView />}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'budget' && <BudgetManager />}
    </Layout>
  );
}

export default App;
