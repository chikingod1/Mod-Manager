import { useState } from 'react';
import { Gamepad2, Play, ArrowLeft } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
}

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const games: Game[] = [
    {
      id: '1',
      name: '2048',
      description: 'Classic puzzle game. Combine tiles to reach 2048!',
      url: 'https://play2048.co/',
      thumbnail: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Puzzle',
    },
    {
      id: '2',
      name: 'Tetris',
      description: 'The timeless block-stacking game.',
      url: 'https://tetris.com/play-tetris',
      thumbnail: 'https://images.pexels.com/photos/1438094/pexels-photo-1438094.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Arcade',
    },
    {
      id: '3',
      name: 'Chess',
      description: 'Play chess online against the computer.',
      url: 'https://www.chess.com/play/computer',
      thumbnail: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Strategy',
    },
    {
      id: '4',
      name: 'Pac-Man',
      description: 'The classic arcade maze game.',
      url: 'https://www.google.com/search?q=pacman',
      thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Arcade',
    },
    {
      id: '5',
      name: 'Solitaire',
      description: 'Classic card game solitaire.',
      url: 'https://www.solitr.com/',
      thumbnail: 'https://images.pexels.com/photos/8111855/pexels-photo-8111855.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Card',
    },
    {
      id: '6',
      name: 'Snake',
      description: 'Guide the snake and eat the food.',
      url: 'https://www.google.com/search?q=snake+game',
      thumbnail: 'https://images.pexels.com/photos/1293269/pexels-photo-1293269.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Arcade',
    },
  ];

  if (selectedGame) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 text-gray-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6" />
              <div>
                <h3 className="text-xl font-bold">{selectedGame.name}</h3>
                <p className="text-sm text-purple-100">{selectedGame.description}</p>
              </div>
            </div>
          </div>
          <div className="relative" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
            <iframe
              src={selectedGame.url}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              title={selectedGame.name}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Game Collection</h2>
        </div>
        <p className="text-purple-100">
          Take a break and enjoy classic games. All games are ready to play instantly!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedGame(game)}
          >
            <div className="h-48 overflow-hidden bg-gray-200">
              <img
                src={game.thumbnail}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800">{game.name}</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                  {game.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{game.description}</p>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
