import { useState, useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { useLanguage } from './contexts/LanguageContext';
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
  const { t } = useLanguage();
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
      minHeight: '100vh', // Allow growing beyond viewport
      // backgroundColor: '#ccf2ff', // Removed to show body background
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
          {daycareName || t('app.title')} 🐶
        </h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            <span style={{ color: '#2e7d32', marginRight: '16px' }}>💰 ${money.toLocaleString()}</span>
            <span>{t('app.dogs')}: {dogs.length}/{maxDogs}</span>
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
            🛒 {t('app.shop')}
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
              if (window.confirm(t('app.reset.confirm'))) {
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
            🔄 {t('app.reset')}
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
                // For floating text: use page coordinates (rect + scroll)
                const x = rect.left + rect.width / 2 + window.scrollX;
                const y = rect.top + window.scrollY;

                if (action === 'FEED') {
                  spawnText(x, y - 20, t('floating.yummy'), '#ffab91');
                  spawnText(x + 50, y - 40, `-$${feedCost}`, '#ef5350');
                } else if (action === 'PLAY') {
                  spawnText(x, y - 20, t('floating.fun'), '#81d4fa');
                } else if (action === 'SLEEP') {
                  spawnText(x, y - 20, t('floating.zzz'), '#a5d6a7');
                }
              }
            }}
            feedCost={feedCost}
            assignedWorker={workers.find(w => w.id === dog.workerId)}
            onPayout={(amount, rect) => {
              // Confetti needs VIEWPORT coordinates (0-1 range relative to window)
              // Floating text needs PAGE coordinates (pixels relative to document)

              const xViewport = rect.left + rect.width / 2;
              const yViewport = rect.top + rect.height / 2;

              const xPage = xViewport + window.scrollX;
              const yPage = rect.top + window.scrollY; // Top of card for text

              triggerExplosion(xViewport, yViewport);
              spawnText(xPage, yPage - 50, `+$${amount}`, '#ffd700');
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
