import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

/**
 * StickerEffect - Fires a confetti burst when `active` turns true.
 * Colours match the StickerAnimal watercolor palette.
 *
 * Props:
 *   active  - boolean, triggers the burst on true
 *   origin  - { x, y } normalised coords (0-1) for burst origin (default center)
 *   spread  - number, confetti spread angle (default 80)
 *   count   - number of particles (default 60)
 */

const STICKER_COLORS = [
  '#E8C87C', // bear - watercolor yellow
  '#7CAED4', // rabbit - sky blue
  '#F0B8B8', // cat - coral pink
  '#9B8EC4', // fox - lavender
  '#A8D8C8', // dog - mint green
  '#B8B0A8', // panda - warm gray
  '#C88B9E', // pig - rose gray
  '#F5E6C8', // duck - cream yellow
  '#E8B8A0', // deer - peach orange
  '#A8D0E8', // penguin - ice blue
  '#D4A57C', // hamster - caramel brown
  '#E8D47C', // star - gold
];

function StickerEffect({ active, origin, spread = 80, count = 60 }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      firedRef.current = false;
      return;
    }

    // Only fire once per active=true transition
    if (firedRef.current) return;
    firedRef.current = true;

    const defaults = {
      origin: origin ?? { x: 0.5, y: 0.5 },
      colors: STICKER_COLORS,
      spread,
      startVelocity: 30,
      gravity: 0.8,
      scalar: 1.1,
      drift: 0,
      ticks: 120,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    };

    // Fire two bursts for a fuller effect
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.6),
      angle: 60,
      origin: { x: (origin?.x ?? 0.5) - 0.05, y: origin?.y ?? 0.5 },
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      angle: 120,
      origin: { x: (origin?.x ?? 0.5) + 0.05, y: origin?.y ?? 0.5 },
    });
  }, [active, origin, spread, count]);

  return null; // canvas-confetti manages its own canvas
}

export { StickerEffect, STICKER_COLORS };
export default StickerEffect;
