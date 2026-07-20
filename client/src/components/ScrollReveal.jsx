import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children with a scroll-triggered fade + slide animation.
 * Animates in when scrolling down into view, and out when scrolling out.
 */
export default function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `transform 0.65s ease ${delay}ms, opacity 0.65s ease ${delay}ms`,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
