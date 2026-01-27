import React, { useState } from 'react';
import heroImage from '../assets/hero.png';

interface StartScreenProps {
    onStart: (name: string) => void;
}

const PRESETS = [
    "The Barking Lot", "Paws & Play", "Happy Tails", "Doggy Dayze",
    "Canine Castle", "Puppy Palace", "Wagging Tails", "Fetch & Friends",
    "Zoomies Zone", "K9 Kindergarden",
    // New Additions
    "Pawsome Resort", "Bark Avenue", "Tail Waggers", "Hound Heaven",
    "The Dog House", "Sit & Stay", "Ruff Riders", "Muttley Crew",
    "Snout & About", "Woof Pack", "Four Paws Club", "Yappy Days",
    "Good Boy Garden", "Wet Noses Inn", "Alpha Academy", "Zoomie Grounds",
    "Canine Cloud 9", "Pawradise", "The Great Bark", "Wagging Wonderland",
    // More New Additions
    "Pawfect Daycare", "The Leash Life", "Furry Friends Funhouse", "Barkingham Palace",
    "Pup-tastic Playtime", "The Daily Wag", "Happy Paws Haven", "Canine Clubhouse",
    "Dog's Best Day", "The Golden Leash", "Tail-Wagging Times", "Fur-ever Friends",
    "The Pampered Pooch", "K9 Kapers", "The Doggy Den", "Playful Pups Paradise",
    "Best in Show Daycare", "The Happy Hound", "Four-Legged Fun", "The Canine Corner"
];

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    const [name, setName] = useState(() => PRESETS[Math.floor(Math.random() * PRESETS.length)]);

    const handleRandomize = () => {
        setName(PRESETS[Math.floor(Math.random() * PRESETS.length)]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onStart(name.trim());
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '24px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '32px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center'
            }}>
                <img
                    src={heroImage}
                    alt="Dog Daycare"
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                />

                <h1 style={{
                    fontSize: '36px',
                    color: '#333',
                    marginBottom: '16px',
                    fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
                }}>
                    Welcome Boss! 🐾
                </h1>

                <p style={{ color: '#666', marginBottom: '24px', fontSize: '18px' }}>
                    Ready to open your dream daycare? Give it a name!
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Daycare Name"
                            style={{
                                flex: 1,
                                padding: '16px',
                                fontSize: '20px',
                                borderRadius: '12px',
                                border: '2px solid #ddd',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={handleRandomize}
                            style={{
                                padding: '16px',
                                fontSize: '24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: '#f0f0f0',
                                cursor: 'pointer'
                            }}
                            title="Randomize Name"
                        >
                            🎲
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        style={{
                            padding: '16px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: '#4CAF50',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: name.trim() ? 'pointer' : 'not-allowed',
                            opacity: name.trim() ? 1 : 0.6,
                            marginTop: '16px',
                            boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)'
                        }}
                    >
                        Open for Business! 🚀
                    </button>
                </form>
            </div>
        </div>
    );
};
