import { useState, useEffect } from 'react';

function LogoutTimer({ onTimeout }) {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    function resetTimeout() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setTimeoutId(setTimeout(onTimeout, 60000)); // 10 minutes
    }

    function clearTimer() {
      clearTimeout(timeoutId);
    }

    resetTimeout();

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('mousedown', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    window.addEventListener('scroll', resetTimeout);
    window.addEventListener('touchstart', resetTimeout);
    window.addEventListener('touchmove', resetTimeout);
    window.addEventListener('touchend', resetTimeout);

    return () => {
      clearTimer();
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('mousedown', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
      window.removeEventListener('scroll', resetTimeout);
      window.removeEventListener('touchstart', resetTimeout);
      window.removeEventListener('touchmove', resetTimeout);
      window.removeEventListener('touchend', resetTimeout);
    };
  }, [timeoutId, onTimeout]);

  return null;
}

export default LogoutTimer;