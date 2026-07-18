import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';
  clickMode?: 'once' | 'toggle';
}

const wrapperStyle: React.CSSProperties = { display: 'inline-block', whiteSpace: 'pre-wrap' };
const srStyle: React.CSSProperties = {
  position: 'absolute', width: '1px', height: '1px',
  padding: 0, margin: '-1px', overflow: 'hidden',
  clip: 'rect(0,0,0,0)', border: 0,
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
}: DecryptedTextProps) {
  const [displayText, setDisplayText]     = useState(text);
  const [isAnimating, setIsAnimating]     = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>());
  const [hasAnimated, setHasAnimated]     = useState(false);
  const [isDecrypted, setIsDecrypted]     = useState(animateOn !== 'click');
  const [direction, setDirection]         = useState<'forward' | 'reverse'>('forward');

  const containerRef  = useRef<HTMLSpanElement>(null);
  const orderRef      = useRef<number[]>([]);
  const pointerRef    = useRef(0);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableChars = useMemo(() =>
    useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(c => c !== ' ')
      : characters.split(''),
    [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback((orig: string, revealed: Set<number>) =>
    orig.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (revealed.has(i)) return orig[i];
      return availableChars[Math.floor(Math.random() * availableChars.length)];
    }).join(''),
    [availableChars]);

  const computeOrder = useCallback((len: number): number[] => {
    const order: number[] = [];
    if (len <= 0) return order;
    if (revealDirection === 'start') { for (let i = 0; i < len; i++) order.push(i); return order; }
    if (revealDirection === 'end')   { for (let i = len - 1; i >= 0; i--) order.push(i); return order; }
    const mid = Math.floor(len / 2);
    let off = 0;
    while (order.length < len) {
      const idx = off % 2 === 0 ? mid + off / 2 : mid - Math.ceil(off / 2);
      if (idx >= 0 && idx < len) order.push(idx);
      off++;
    }
    return order.slice(0, len);
  }, [revealDirection]);

  const fillAll = useCallback(() => {
    const s = new Set<number>();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandom = useCallback((set: Set<number>, count: number) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) arr.splice(Math.floor(Math.random() * arr.length), 1);
    return new Set(arr);
  }, []);

  const encryptInstantly = useCallback(() => {
    const empty = new Set<number>();
    setRevealedIndices(empty);
    setDisplayText(shuffleText(text, empty));
    setIsDecrypted(false);
  }, [text, shuffleText]);

  const triggerDecrypt = useCallback(() => {
    if (sequential) { orderRef.current = computeOrder(text.length); pointerRef.current = 0; setRevealedIndices(new Set()); }
    else { setRevealedIndices(new Set()); }
    setDirection('forward');
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length]);

  const triggerReverse = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      const all = fillAll();
      setRevealedIndices(all);
      setDisplayText(shuffleText(text, all));
    } else {
      const all = fillAll();
      setRevealedIndices(all);
      setDisplayText(shuffleText(text, all));
    }
    setDirection('reverse');
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAll, shuffleText, text]);

  useEffect(() => {
    if (!isAnimating) return;
    let iter = 0;

    const getNext = (revealed: Set<number>) => {
      const len = text.length;
      if (revealDirection === 'start') return revealed.size;
      if (revealDirection === 'end') return len - 1 - revealed.size;
      const mid = Math.floor(len / 2);
      const off = Math.floor(revealed.size / 2);
      const idx = revealed.size % 2 === 0 ? mid + off : mid - off - 1;
      if (idx >= 0 && idx < len && !revealed.has(idx)) return idx;
      for (let i = 0; i < len; i++) if (!revealed.has(i)) return i;
      return 0;
    };

    intervalRef.current = setInterval(() => {
      setRevealedIndices(prev => {
        if (sequential) {
          if (direction === 'forward') {
            if (prev.size < text.length) {
              const next = new Set(prev); next.add(getNext(prev));
              setDisplayText(shuffleText(text, next)); return next;
            } else { clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(true); return prev; }
          }
          if (direction === 'reverse') {
            if (pointerRef.current < orderRef.current.length) {
              const next = new Set(prev); next.delete(orderRef.current[pointerRef.current++]);
              setDisplayText(shuffleText(text, next));
              if (next.size === 0) { clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(false); }
              return next;
            } else { clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(false); return prev; }
          }
        } else {
          if (direction === 'forward') {
            setDisplayText(shuffleText(text, prev)); iter++;
            if (iter >= maxIterations) { clearInterval(intervalRef.current!); setIsAnimating(false); setDisplayText(text); setIsDecrypted(true); }
            return prev;
          }
          if (direction === 'reverse') {
            const cur = prev.size === 0 ? fillAll() : prev;
            const cnt = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
            const next = removeRandom(cur, cnt);
            setDisplayText(shuffleText(text, next)); iter++;
            if (next.size === 0 || iter >= maxIterations) {
              clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(false);
              setDisplayText(shuffleText(text, new Set())); return new Set();
            }
            return next;
          }
        }
        return prev;
      });
    }, speed);

    return () => clearInterval(intervalRef.current!);
  }, [isAnimating, text, speed, maxIterations, sequential, revealDirection, shuffleText, direction, fillAll, removeRandom]);

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;
    setRevealedIndices(new Set()); setIsDecrypted(false); setDisplayText(text);
    setDirection('forward'); setIsAnimating(true);
  }, [isAnimating, text]);

  const resetToPlain = useCallback(() => {
    clearInterval(intervalRef.current!);
    setIsAnimating(false); setRevealedIndices(new Set()); setDisplayText(text);
    setIsDecrypted(true); setDirection('forward');
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && !hasAnimated) { triggerDecrypt(); setHasAnimated(true); } });
    }, { threshold: 0.1 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => { if (containerRef.current) obs.unobserve(containerRef.current); };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  useEffect(() => {
    if (animateOn === 'click') encryptInstantly();
    else { setDisplayText(text); setIsDecrypted(true); }
    setRevealedIndices(new Set()); setDirection('forward');
  }, [animateOn, text, encryptInstantly]);

  const handleClick = () => {
    if (animateOn !== 'click') return;
    if (clickMode === 'once') { if (!isDecrypted) { setDirection('forward'); triggerDecrypt(); } return; }
    if (isDecrypted) triggerReverse(); else { setDirection('forward'); triggerDecrypt(); }
  };

  const animateProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlain }
      : animateOn === 'click'
        ? { onClick: handleClick }
        : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={wrapperStyle} {...animateProps}>
      <span style={srStyle}>{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, i) => {
          const revealed = revealedIndices.has(i) || (!isAnimating && isDecrypted);
          return (
            <span key={i} className={revealed ? className : encryptedClassName}>{char}</span>
          );
        })}
      </span>
    </motion.span>
  );
}
