import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TutorialOverlayProps {
    onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
    const { t, language, setLanguage } = useLanguage();
    const [step, setStep] = useState(0);

    const STEPS = [
        {
            title: 'tutorial.welcome.title',
            desc: 'tutorial.welcome.desc',
            icon: '👋'
        },
        {
            title: 'tutorial.needs.title',
            desc: 'tutorial.needs.desc',
            icon: '📊'
        },
        {
            title: 'tutorial.actions.title',
            desc: 'tutorial.actions.desc',
            icon: '⚡'
        },
        {
            title: 'tutorial.money.title',
            desc: 'tutorial.money.desc',
            icon: '💰'
        }
    ];

    const currentStep = STEPS[step];

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '32px',
                width: '90%',
                maxWidth: '500px',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative'
            }}>
                {/* Language Toggle */}
                <button
                    onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        fontSize: '32px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    title="Switch Language"
                >
                    {language === 'en' ? '🇻🇳' : '🇺🇸'}
                </button>

                <div style={{ fontSize: '80px', marginBottom: '24px' }}>
                    {currentStep.icon}
                </div>
                <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#333' }}>
                    {t(currentStep.title)}
                </h2>
                <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#666', marginBottom: '32px' }}>
                    {t(currentStep.desc)}
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    {step > 0 && (
                        <button
                            onClick={handlePrev}
                            style={{
                                padding: '12px 24px',
                                fontSize: '18px',
                                borderRadius: '12px',
                                border: '2px solid #ddd',
                                background: 'white',
                                color: '#666',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('tutorial.prev')}
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        style={{
                            padding: '12px 32px',
                            fontSize: '18px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#2196f3',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 0 #1976d2',
                            flex: 1
                        }}
                    >
                        {step === STEPS.length - 1 ? t('tutorial.finish') : t('tutorial.next')}
                    </button>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {STEPS.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: idx === step ? '#2196f3' : '#ddd',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
