
import React, { useEffect, useRef } from 'react';

export default function Cursor() {
    const cursorDotRef = useRef(null);
    const cursorOutlineRef = useRef(null);

    useEffect(() => {
        const cursorDot = cursorDotRef.current;
        const cursorOutline = cursorOutlineRef.current;

        const moveCursor = (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 1000, fill: "forwards" });
        };

        window.addEventListener("mousemove", moveCursor);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <>
            <div ref={cursorDotRef} className="cursor-dot cursor"></div>
            <div ref={cursorOutlineRef} className="cursor-outline cursor"></div>
        </>
    );
}