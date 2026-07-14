import React, { useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#';

export function MatrixText({ text, duration = 0.75, delay = 0, className = '' }) {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timeoutId;
    let intervalId;

    const startAnimation = () => {
      setStarted(true);
      let iteration = 0;
      // 30ms per frame
      const frameRate = 30;
      const totalIterations = (duration * 1000) / frameRate;

      intervalId = setInterval(() => {
        setDisplayText(() =>
          text.split('').map((char, index) => {
            // Keep spaces as spaces
            if (char === ' ') return ' ';
            // Reveal actual character if we've passed its position in the animation
            if (index < (iteration / totalIterations) * text.length) {
              return char;
            }
            // Otherwise, show a random matrix character
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );

        if (iteration >= totalIterations) {
          clearInterval(intervalId);
          setDisplayText(text);
        }
        iteration++;
      }, frameRate);
    };

    if (delay > 0) {
      timeoutId = setTimeout(startAnimation, delay * 1000);
    } else {
      startAnimation();
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, duration, delay]);

  // Before delay finishes, render nothing or invisible spaces to maintain layout
  if (!started && delay > 0) {
    return <span className={className} style={{ opacity: 0 }}>{text}</span>;
  }

  return <span className={className}>{displayText}</span>;
}
