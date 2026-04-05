import { useState } from 'react';
import { Shield, Gamepad2 } from 'lucide-react';
import Proxy from './components/Proxy';
import Games from './components/Games';

type Tab = 'proxy' | 'games';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('proxy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChikingGod1
                </h1>
                <p className="text-sm text-gray-500">Proxy & Games</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('proxy')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'proxy'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Shield className="w-5 h-5" />
                Proxy
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'games'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
                Games
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'proxy' && <Proxy />}
        {activeTab === 'games' && <Games />}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            ChikingGod1 Proxy & Games - Access the web freely and play games
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
