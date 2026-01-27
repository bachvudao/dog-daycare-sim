import { useState, useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { DogCard } from './components/DogCard';
import { Shop } from './components/Shop';
import { AddSlotCard } from './components/AddSlotCard';
import { FloatingText, type FloatingTextItem } from './components/FloatingText';
import confetti from 'canvas-confetti';

import { StartScreen } from './components/StartScreen';
import { EventBanner } from './components/EventBanner';
import { SettingsModal } from './components/SettingsModal';

function App() {
  const {
    dogs, money, interact, upgrades, buyUpgrade, maxDogs, buySlot, feedCost,
    workers, hireWorker, hasStarted, daycareName, startGame, resetGame, activeEvent,
    isPlaying, setIsPlaying
  } = useGameLogic();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  const slotCost = 500 * maxDogs;

  const spawnText = useCallback((x: number, y: number, text: string, color: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
  }, []);

  const triggerExplosion = useCallback((x: number, y: number) => {
    const xNorm = x / window.innerWidth;
    const yNorm = y / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: xNorm, y: yNorm },
      colors: ['#FFD700', '#FFA500', '#32CD32'] // Gold/Green themes
    });
  }, []);

  const handleTextComplete = useCallback((id: number) => {
    setFloatingTexts(prev => prev.filter(item => item.id !== id));
  }, []);

  if (!hasStarted) {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ccf2ff', // Sky blue
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px'
    }}>
      {/* Floating Texts Overlay */}
      {floatingTexts.map(item => (
        <FloatingText key={item.id} item={item} onComplete={handleTextComplete} />
      ))}

      {/* HUD */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '16px',
        marginBottom: '32px',
        backdropFilter: 'blur(4px)'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#333', margin: 0 }}>
          {daycareName || 'Dog Daycare Tycoon'} 🐶
        </h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            <span style={{ color: '#2e7d32', marginRight: '16px' }}>💰 ${money.toLocaleString()}</span>
            <span>Dogs: {dogs.length}/{maxDogs}</span>
          </div>
          <button
            onClick={() => setIsShopOpen(true)}
            style={{
              backgroundColor: '#ff9800',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #b36b00',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🛒 Shop
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            style={{
              backgroundColor: '#607d8b',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #455a64',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Settings & Help"
          >
            ⚙️
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to start a new game? Current progress will be lost!")) {
                resetGame();
              }
            }}
            style={{
              backgroundColor: '#f44336', // Red
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #d32f2f',
              fontSize: '14px' // Slightly smaller
            }}
            title="Start New Game"
          >
            🔄 Reset
          </button>
        </div>
      </header>

      {/* Event Banner */}
      {activeEvent && <EventBanner event={activeEvent} />}

      {/* Game Area */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        justifyContent: 'center',
        paddingTop: '20px'
      }}>
        {dogs.map(dog => (
          <DogCard
            key={dog.id}
            dog={dog}
            onInteract={(action, e) => {
              interact(dog.id, action);
              // Visual Effects logic
              if (e) {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top;

                if (action === 'FEED') {
                  spawnText(x, y - 20, 'Yummy!', '#ffab91');
                  spawnText(x + 50, y - 40, `-$${feedCost}`, '#ef5350');
                } else if (action === 'PLAY') {
                  spawnText(x, y - 20, 'Fun!', '#81d4fa');
                } else if (action === 'SLEEP') {
                  spawnText(x, y - 20, 'Zzz...', '#a5d6a7');
                }
              }
            }}
            feedCost={feedCost}
            assignedWorker={workers.find(w => w.id === dog.workerId)}
            onPayout={(amount, rect) => {
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              triggerExplosion(x, y);
              spawnText(x, y - 50, `+$${amount}`, '#ffd700');
            }}
          />
        ))}

        {/* Add Slot Card */}
        <AddSlotCard
          cost={slotCost}
          canAfford={money >= slotCost}
          onBuy={buySlot}
        />
      </div>

      {/* Footer / Ground */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        backgroundColor: '#a8d575',
        zIndex: -1,
        borderTop: '8px solid #8cb660'
      }} />

      {/* Shop Modal */}
      {isShopOpen && (
        <Shop
          money={money}
          upgrades={upgrades}
          buyUpgrade={buyUpgrade}
          onClose={() => setIsShopOpen(false)}
          hireWorker={hireWorker}
          workers={workers}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isPlaying={isPlaying}
        onTogglePause={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}

export default App;
