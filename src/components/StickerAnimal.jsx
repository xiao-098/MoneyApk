/**
 * StickerAnimal - Renders kawaii animal PNG stickers.
 *
 * Props:
 *   animal - string key (bear, rabbit, cat, fox, dog, panda, pig, duck, deer, penguin, hamster, star)
 *   size   - number, rendered width/height in px (default 48)
 */

const PALETTE = {
  bear:    { fill: '#E8C87C', name: 'watercolor-yellow' },
  rabbit:  { fill: '#7CAED4', name: 'sky-blue' },
  cat:     { fill: '#F0B8B8', name: 'coral-pink' },
  fox:     { fill: '#9B8EC4', name: 'lavender' },
  dog:     { fill: '#A8D8C8', name: 'mint-green' },
  panda:   { fill: '#B8B0A8', name: 'warm-gray' },
  pig:     { fill: '#C88B9E', name: 'rose-gray' },
  duck:    { fill: '#F5E6C8', name: 'cream-yellow' },
  deer:    { fill: '#E8B8A0', name: 'peach-orange' },
  penguin: { fill: '#A8D0E8', name: 'ice-blue' },
  hamster: { fill: '#D4A57C', name: 'caramel-brown' },
  star:    { fill: '#E8D47C', name: 'gold' },
};

const VALID_ANIMALS = Object.keys(PALETTE);

function StickerAnimal({ animal, size = 48 }) {
  if (!VALID_ANIMALS.includes(animal)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[StickerAnimal] Unknown animal: "${animal}". Valid: ${VALID_ANIMALS.join(', ')}`);
    }
    return null;
  }

  return (
    <img
      src={`/animals/${animal}.png`}
      alt={`${animal} sticker`}
      width={size}
      height={size}
      draggable={false}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        objectFit: 'contain',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
      }}
    />
  );
}

export { StickerAnimal, PALETTE };
export default StickerAnimal;
