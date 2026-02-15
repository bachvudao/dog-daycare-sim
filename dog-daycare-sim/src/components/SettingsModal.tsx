import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, type Language } from '../translations';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isPlaying: boolean;
    onTogglePause: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isPlaying, onTogglePause }) => {
    const { language, setLanguage, t } = useLanguage();
    const [showLanguages, setShowLanguages] = useState(false);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '32px' }}>⚙️ {t('settings.title')}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ❌
                    </button>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '24px', color: '#555', marginBottom: '16px' }}>{t('settings.game_control')}</h3>
                    <button
                        onClick={onTogglePause}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: isPlaying ? '#ff9800' : '#4caf50',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: isPlaying ? '0 4px 0 #b36b00' : '0 4px 0 #2e7d32'
                        }}
                    >
                        {isPlaying ? `⏸️ ${t('settings.pause')}` : `▶️ ${t('settings.resume')}`}
                    </button>

                    {/* Language Selector Button */}
                    <button
                        onClick={() => setShowLanguages(!showLanguages)}
                        style={{
                            width: '100%',
                            marginTop: '16px',
                            padding: '16px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: '#2196f3',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: '0 4px 0 #0d47a1'
                        }}
                    >
                        🌐 {t('settings.language')}: {LANGUAGES[language]}
                    </button>

                    {/* Language List - Full Screen Overlay */}
                    {showLanguages && (
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            zIndex: 3000,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '24px',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '400px',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ margin: 0, fontSize: '24px' }}>Select Language</h3>
                                    <button onClick={() => setShowLanguages(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>❌</button>
                                </div>

                                {Object.entries(LANGUAGES).map(([code, name]) => (
                                    <button
                                        key={code}
                                        onClick={() => {
                                            setLanguage(code as Language);
                                            setShowLanguages(false);
                                        }}
                                        style={{
                                            padding: '16px',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            backgroundColor: language === code ? '#e3f2fd' : '#f5f5f5',
                                            border: language === code ? '2px solid #2196f3' : '2px solid transparent',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <h3 style={{ fontSize: '24px', color: '#555', marginBottom: '16px' }}>{t('settings.how_to_play')} 📖</h3>
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        lineHeight: '1.5',
                        color: '#444',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        <p><strong>{t('settings.goal')}</strong></p>
                        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            <li>{t('settings.care')}</li>
                            <li>{t('settings.workers')}</li>
                            <li>{t('settings.events')}</li>
                            <li>{t('settings.money')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
