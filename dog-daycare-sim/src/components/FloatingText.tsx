import React, { useEffect, useState } from 'react';

export interface FloatingTextItem {
    id: number;
    x: number;
    y: number;
    text: string;
    color: string;
}

interface FloatingTextProps {
    item: FloatingTextItem;
    onComplete: (id: number) => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ item, onComplete }) => {
    const [opacity, setOpacity] = useState(1);
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        // Animate up
        requestAnimationFrame(() => {
            setOffsetY(-50);
            setOpacity(0);
        });

        // Cleanup
        const timer = setTimeout(() => {
            onComplete(item.id);
        }, 1000); // 1s animation duration

        return () => clearTimeout(timer);
    }, [item.id, onComplete]);

    return (
        <div style={{
            position: 'absolute',
            top: item.y,
            left: item.x,
            transform: `translate(-50%, ${offsetY}px)`,
            color: item.color,
            fontSize: '20px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            opacity: opacity,
            transition: 'transform 1s ease-out, opacity 1s ease-in',
            zIndex: 1000,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
            {item.text}
        </div>
    );
};
