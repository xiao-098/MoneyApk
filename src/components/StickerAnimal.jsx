import React from 'react';

/**
 * StickerAnimal - Renders cute doodle-style animal sticker SVGs.
 *
 * Props:
 *   animal - string key for the animal (bear, rabbit, cat, fox, dog, panda, pig, duck, deer, penguin, hamster, star)
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

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lighten(hex, factor = 0.5) {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.round(r + (255 - r) * factor);
  const lg = Math.round(g + (255 - g) * factor);
  const lb = Math.round(b + (255 - b) * factor);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

const STROKE = '#5a4a3a';
const STROKE_W = 2.5;
const COMMON = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  stroke: STROKE,
  strokeWidth: STROKE_W,
};

function GradientDefs({ id, color }) {
  const light = lighten(color, 0.45);
  return (
    <defs>
      <linearGradient id={`wc-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={light} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0.72" />
      </linearGradient>
      <radialGradient id={`wcr-${id}`} cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor={light} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </radialGradient>
    </defs>
  );
}

function WhiteBorder({ children, id }) {
  return (
    <g filter="">
      {/* White sticker border rendered underneath via paint-order */}
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              style: { ...child.props?.style, paintOrder: 'stroke fill' },
              stroke: 'white',
              strokeWidth: 6,
            })
          : child
      )}
    </g>
  );
}

/* ---- Individual animal renderers ---- */

function Bear({ id }) {
  const c = PALETTE.bear.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears */}
      <circle cx="30" cy="25" r="14" fill={`url(#wcr-${id})`} {...COMMON} />
      <circle cx="70" cy="25" r="14" fill={`url(#wcr-${id})`} {...COMMON} />
      {/* Inner ears */}
      <circle cx="30" cy="25" r="7" fill={lighten(c, 0.25)} opacity="0.5" />
      <circle cx="70" cy="25" r="7" fill={lighten(c, 0.25)} opacity="0.5" />
      {/* Head */}
      <circle cx="50" cy="52" r="32" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="52" r="32" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Eyes */}
      <circle cx="40" cy="48" r="3.5" fill={STROKE} />
      <circle cx="60" cy="48" r="3.5" fill={STROKE} />
      <circle cx="41.5" cy="46.5" r="1.2" fill="white" />
      <circle cx="61.5" cy="46.5" r="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="57" rx="5" ry="3.5" fill={STROKE} />
      {/* Mouth */}
      <path d="M46 60 Q50 65 54 60" fill="none" {...COMMON} strokeWidth="1.8" />
      {/* Cheeks */}
      <circle cx="35" cy="58" r="5" fill={lighten(c, 0.3)} opacity="0.4" />
      <circle cx="65" cy="58" r="5" fill={lighten(c, 0.3)} opacity="0.4" />
    </g>
  );
}

function Rabbit({ id }) {
  const c = PALETTE.rabbit.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears */}
      <ellipse cx="38" cy="18" rx="8" ry="22" fill={`url(#wc-${id})`} {...COMMON} />
      <ellipse cx="62" cy="18" rx="8" ry="22" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Inner ears */}
      <ellipse cx="38" cy="18" rx="4" ry="14" fill={lighten(c, 0.3)} opacity="0.45" />
      <ellipse cx="62" cy="18" rx="4" ry="14" fill={lighten(c, 0.3)} opacity="0.45" />
      {/* Head */}
      <circle cx="50" cy="55" r="30" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="55" r="30" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Eyes */}
      <circle cx="40" cy="50" r="3.5" fill={STROKE} />
      <circle cx="60" cy="50" r="3.5" fill={STROKE} />
      <circle cx="41.2" cy="48.8" r="1.2" fill="white" />
      <circle cx="61.2" cy="48.8" r="1.2" fill="white" />
      {/* Nose */}
      <path d="M47 58 L50 61 L53 58 Z" fill={STROKE} />
      {/* Mouth */}
      <path d="M46 62 Q50 66 54 62" fill="none" {...COMMON} strokeWidth="1.6" />
      {/* Whiskers */}
      <line x1="30" y1="56" x2="42" y2="58" {...COMMON} strokeWidth="1.2" />
      <line x1="30" y1="60" x2="42" y2="60" {...COMMON} strokeWidth="1.2" />
      <line x1="58" y1="58" x2="70" y2="56" {...COMMON} strokeWidth="1.2" />
      <line x1="58" y1="60" x2="70" y2="60" {...COMMON} strokeWidth="1.2" />
      {/* Cheeks */}
      <circle cx="34" cy="60" r="5" fill={lighten(c, 0.3)} opacity="0.35" />
      <circle cx="66" cy="60" r="5" fill={lighten(c, 0.3)} opacity="0.35" />
    </g>
  );
}

function Cat({ id }) {
  const c = PALETTE.cat.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears */}
      <path d="M25 38 L20 10 L42 30 Z" fill={`url(#wc-${id})`} {...COMMON} />
      <path d="M75 38 L80 10 L58 30 Z" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Inner ears */}
      <path d="M27 34 L24 16 L38 30 Z" fill={lighten(c, 0.25)} opacity="0.45" />
      <path d="M73 34 L76 16 L62 30 Z" fill={lighten(c, 0.25)} opacity="0.45" />
      {/* Head */}
      <circle cx="50" cy="55" r="30" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="55" r="30" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Eyes */}
      <ellipse cx="40" cy="50" rx="4" ry="4.5" fill={STROKE} />
      <ellipse cx="60" cy="50" rx="4" ry="4.5" fill={STROKE} />
      <ellipse cx="41" cy="48.5" rx="1.5" ry="1.8" fill="white" />
      <ellipse cx="61" cy="48.5" rx="1.5" ry="1.8" fill="white" />
      {/* Nose */}
      <path d="M47 57 L50 60 L53 57 Z" fill="#e8a0a0" />
      {/* Mouth */}
      <path d="M46 61 Q50 65 54 61" fill="none" {...COMMON} strokeWidth="1.5" />
      {/* Whiskers */}
      <line x1="22" y1="54" x2="38" y2="57" {...COMMON} strokeWidth="1.3" />
      <line x1="22" y1="59" x2="38" y2="59" {...COMMON} strokeWidth="1.3" />
      <line x1="22" y1="64" x2="38" y2="61" {...COMMON} strokeWidth="1.3" />
      <line x1="62" y1="57" x2="78" y2="54" {...COMMON} strokeWidth="1.3" />
      <line x1="62" y1="59" x2="78" y2="59" {...COMMON} strokeWidth="1.3" />
      <line x1="62" y1="61" x2="78" y2="64" {...COMMON} strokeWidth="1.3" />
      {/* Cheeks */}
      <circle cx="34" cy="60" r="5" fill={lighten(c, 0.25)} opacity="0.4" />
      <circle cx="66" cy="60" r="5" fill={lighten(c, 0.25)} opacity="0.4" />
    </g>
  );
}

function Fox({ id }) {
  const c = PALETTE.fox.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears */}
      <path d="M28 40 L18 8 L44 30 Z" fill={`url(#wc-${id})`} {...COMMON} />
      <path d="M72 40 L82 8 L56 30 Z" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Inner ears */}
      <path d="M30 36 L23 14 L40 30 Z" fill={lighten(c, 0.3)} opacity="0.4" />
      <path d="M70 36 L77 14 L60 30 Z" fill={lighten(c, 0.3)} opacity="0.4" />
      {/* Head */}
      <circle cx="50" cy="55" r="30" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="55" r="30" fill={`url(#wc-${id})`} {...COMMON} />
      {/* White face patch */}
      <ellipse cx="50" cy="62" rx="16" ry="14" fill="white" opacity="0.55" />
      {/* Eyes */}
      <ellipse cx="40" cy="48" rx="3.5" ry="4" fill={STROKE} />
      <ellipse cx="60" cy="48" rx="3.5" ry="4" fill={STROKE} />
      <circle cx="41" cy="46.5" r="1.3" fill="white" />
      <circle cx="61" cy="46.5" r="1.3" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="58" rx="4" ry="3" fill={STROKE} />
      {/* Mouth */}
      <path d="M46 61 Q50 65 54 61" fill="none" {...COMMON} strokeWidth="1.5" />
    </g>
  );
}

function Dog({ id }) {
  const c = PALETTE.dog.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears (floppy) */}
      <ellipse cx="24" cy="48" rx="12" ry="20" fill={`url(#wc-${id})`} {...COMMON} transform="rotate(-15 24 48)" />
      <ellipse cx="76" cy="48" rx="12" ry="20" fill={`url(#wc-${id})`} {...COMMON} transform="rotate(15 76 48)" />
      {/* Head */}
      <circle cx="50" cy="52" r="30" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="52" r="30" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Face patch */}
      <ellipse cx="50" cy="58" rx="14" ry="12" fill={lighten(c, 0.35)} opacity="0.45" />
      {/* Eyes */}
      <circle cx="40" cy="48" r="3.5" fill={STROKE} />
      <circle cx="60" cy="48" r="3.5" fill={STROKE} />
      <circle cx="41.2" cy="46.5" r="1.3" fill="white" />
      <circle cx="61.2" cy="46.5" r="1.3" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="56" rx="5.5" ry="4" fill={STROKE} />
      <ellipse cx="50" cy="55" rx="2" ry="1" fill="#7a6a5a" opacity="0.5" />
      {/* Mouth */}
      <path d="M44 60 Q50 66 56 60" fill="none" {...COMMON} strokeWidth="1.6" />
      {/* Tongue */}
      <ellipse cx="50" cy="66" rx="4" ry="5" fill="#e89090" {...COMMON} strokeWidth="1.5" />
    </g>
  );
}

function Panda({ id }) {
  const c = PALETTE.panda.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears */}
      <circle cx="28" cy="28" r="13" fill="#4a4a4a" {...COMMON} />
      <circle cx="72" cy="28" r="13" fill="#4a4a4a" {...COMMON} />
      {/* Head */}
      <circle cx="50" cy="54" r="30" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="54" r="30" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Eye patches */}
      <ellipse cx="38" cy="48" rx="10" ry="9" fill="#4a4a4a" {...COMMON} strokeWidth="1.5" transform="rotate(-8 38 48)" />
      <ellipse cx="62" cy="48" rx="10" ry="9" fill="#4a4a4a" {...COMMON} strokeWidth="1.5" transform="rotate(8 62 48)" />
      {/* Eyes */}
      <circle cx="38" cy="48" r="3.5" fill="white" />
      <circle cx="62" cy="48" r="3.5" fill="white" />
      <circle cx="39" cy="47" r="2" fill={STROKE} />
      <circle cx="63" cy="47" r="2" fill={STROKE} />
      <circle cx="39.5" cy="46.2" r="0.8" fill="white" />
      <circle cx="63.5" cy="46.2" r="0.8" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="57" rx="4.5" ry="3" fill={STROKE} />
      {/* Mouth */}
      <path d="M46 60 Q50 64 54 60" fill="none" {...COMMON} strokeWidth="1.5" />
      {/* Cheeks */}
      <circle cx="33" cy="58" r="5" fill={lighten(c, 0.2)} opacity="0.3" />
      <circle cx="67" cy="58" r="5" fill={lighten(c, 0.2)} opacity="0.3" />
    </g>
  );
}

function Pig({ id }) {
  const c = PALETTE.pig.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears */}
      <path d="M28 35 Q18 18 32 22 Q38 24 36 36 Z" fill={`url(#wc-${id})`} {...COMMON} />
      <path d="M72 35 Q82 18 68 22 Q62 24 64 36 Z" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Head */}
      <circle cx="50" cy="54" r="30" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="54" r="30" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Eyes */}
      <circle cx="40" cy="48" r="3.5" fill={STROKE} />
      <circle cx="60" cy="48" r="3.5" fill={STROKE} />
      <circle cx="41" cy="46.8" r="1.2" fill="white" />
      <circle cx="61" cy="46.8" r="1.2" fill="white" />
      {/* Snout */}
      <ellipse cx="50" cy="58" rx="11" ry="8" fill={lighten(c, 0.2)} {...COMMON} strokeWidth="2" />
      {/* Nostrils */}
      <ellipse cx="46" cy="58" rx="2.5" ry="2" fill={STROKE} />
      <ellipse cx="54" cy="58" rx="2.5" ry="2" fill={STROKE} />
      {/* Mouth */}
      <path d="M46 66 Q50 70 54 66" fill="none" {...COMMON} strokeWidth="1.5" />
      {/* Cheeks */}
      <circle cx="32" cy="56" r="5.5" fill={lighten(c, 0.25)} opacity="0.45" />
      <circle cx="68" cy="56" r="5.5" fill={lighten(c, 0.25)} opacity="0.45" />
    </g>
  );
}

function Duck({ id }) {
  const c = PALETTE.duck.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Body */}
      <ellipse cx="50" cy="58" rx="30" ry="28" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <ellipse cx="50" cy="58" rx="30" ry="28" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Head */}
      <circle cx="50" cy="35" r="20" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Eyes */}
      <circle cx="44" cy="32" r="3" fill={STROKE} />
      <circle cx="45" cy="31" r="1.1" fill="white" />
      {/* Bill */}
      <ellipse cx="58" cy="38" rx="10" ry="5" fill="#F0A050" {...COMMON} strokeWidth="2" />
      <line x1="52" y1="38" x2="64" y2="38" {...COMMON} strokeWidth="1.3" />
      {/* Cheek */}
      <circle cx="40" cy="38" r="4.5" fill={lighten(c, 0.25)} opacity="0.45" />
      {/* Wing hint */}
      <path d="M30 55 Q22 50 28 62 Q32 70 38 65" fill={lighten(c, 0.2)} opacity="0.4" {...COMMON} strokeWidth="1.5" />
      {/* Blush */}
      <circle cx="38" cy="40" r="4" fill={lighten(c, 0.2)} opacity="0.35" />
    </g>
  );
}

function Deer({ id }) {
  const c = PALETTE.deer.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Antlers */}
      <path d="M32 35 L25 12 L20 5" fill="none" {...COMMON} strokeWidth="3" />
      <path d="M28 20 L22 15" fill="none" {...COMMON} strokeWidth="2.5" />
      <path d="M68 35 L75 12 L80 5" fill="none" {...COMMON} strokeWidth="3" />
      <path d="M72 20 L78 15" fill="none" {...COMMON} strokeWidth="2.5" />
      {/* Ears */}
      <ellipse cx="25" cy="40" rx="8" ry="12" fill={`url(#wc-${id})`} {...COMMON} transform="rotate(-20 25 40)" />
      <ellipse cx="75" cy="40" rx="8" ry="12" fill={`url(#wc-${id})`} {...COMMON} transform="rotate(20 75 40)" />
      {/* Inner ears */}
      <ellipse cx="25" cy="40" rx="4" ry="7" fill={lighten(c, 0.25)} opacity="0.4" transform="rotate(-20 25 40)" />
      <ellipse cx="75" cy="40" rx="4" ry="7" fill={lighten(c, 0.25)} opacity="0.4" transform="rotate(20 75 40)" />
      {/* Head */}
      <circle cx="50" cy="55" r="28" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="55" r="28" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Eyes */}
      <circle cx="40" cy="50" r="3.5" fill={STROKE} />
      <circle cx="60" cy="50" r="3.5" fill={STROKE} />
      <circle cx="41" cy="48.8" r="1.2" fill="white" />
      <circle cx="61" cy="48.8" r="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="60" rx="5" ry="3.5" fill={STROKE} />
      {/* Mouth */}
      <path d="M46 63 Q50 67 54 63" fill="none" {...COMMON} strokeWidth="1.5" />
      {/* Cheeks */}
      <circle cx="34" cy="58" r="5" fill={lighten(c, 0.3)} opacity="0.4" />
      <circle cx="66" cy="58" r="5" fill={lighten(c, 0.3)} opacity="0.4" />
      {/* Spots */}
      <circle cx="38" cy="42" r="2" fill={lighten(c, 0.4)} opacity="0.5" />
      <circle cx="62" cy="42" r="2" fill={lighten(c, 0.4)} opacity="0.5" />
    </g>
  );
}

function Penguin({ id }) {
  const c = PALETTE.penguin.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Body */}
      <ellipse cx="50" cy="58" rx="28" ry="30" fill="#4a5568" {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <ellipse cx="50" cy="58" rx="28" ry="30" fill="#4a5568" {...COMMON} />
      {/* Belly */}
      <ellipse cx="50" cy="62" rx="18" ry="22" fill={`url(#wc-${id})`} {...COMMON} strokeWidth="1.8" />
      {/* Head */}
      <circle cx="50" cy="32" r="18" fill="#4a5568" {...COMMON} />
      {/* Face patch */}
      <ellipse cx="50" cy="34" rx="12" ry="10" fill={`url(#wc-${id})`} opacity="0.6" />
      {/* Eyes */}
      <circle cx="44" cy="30" r="3" fill={STROKE} />
      <circle cx="56" cy="30" r="3" fill={STROKE} />
      <circle cx="45" cy="29" r="1.1" fill="white" />
      <circle cx="57" cy="29" r="1.1" fill="white" />
      {/* Beak */}
      <path d="M46 36 L50 41 L54 36 Z" fill="#F0A050" {...COMMON} strokeWidth="1.8" />
      {/* Cheeks */}
      <circle cx="40" cy="35" r="4" fill={lighten(c, 0.25)} opacity="0.4" />
      <circle cx="60" cy="35" r="4" fill={lighten(c, 0.25)} opacity="0.4" />
      {/* Feet */}
      <ellipse cx="40" cy="88" rx="8" ry="3" fill="#F0A050" {...COMMON} strokeWidth="1.5" />
      <ellipse cx="60" cy="88" rx="8" ry="3" fill="#F0A050" {...COMMON} strokeWidth="1.5" />
    </g>
  );
}

function Hamster({ id }) {
  const c = PALETTE.hamster.fill;
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Ears */}
      <circle cx="28" cy="30" r="10" fill={`url(#wcr-${id})`} {...COMMON} />
      <circle cx="72" cy="30" r="10" fill={`url(#wcr-${id})`} {...COMMON} />
      {/* Inner ears */}
      <circle cx="28" cy="30" r="5" fill={lighten(c, 0.25)} opacity="0.5" />
      <circle cx="72" cy="30" r="5" fill={lighten(c, 0.25)} opacity="0.5" />
      {/* Head */}
      <circle cx="50" cy="54" r="30" fill={`url(#wc-${id})`} {...COMMON} stroke="white" strokeWidth="6" style={{ paintOrder: 'stroke fill' }} />
      <circle cx="50" cy="54" r="30" fill={`url(#wc-${id})`} {...COMMON} />
      {/* Cheek pouches */}
      <ellipse cx="30" cy="58" rx="12" ry="10" fill={lighten(c, 0.3)} opacity="0.5" {...COMMON} strokeWidth="1.5" />
      <ellipse cx="70" cy="58" rx="12" ry="10" fill={lighten(c, 0.3)} opacity="0.5" {...COMMON} strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="42" cy="48" r="3.5" fill={STROKE} />
      <circle cx="58" cy="48" r="3.5" fill={STROKE} />
      <circle cx="43" cy="46.8" r="1.3" fill="white" />
      <circle cx="59" cy="46.8" r="1.3" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="56" rx="3.5" ry="2.5" fill={STROKE} />
      {/* Mouth */}
      <path d="M47 59 Q50 62 53 59" fill="none" {...COMMON} strokeWidth="1.4" />
      {/* Teeth */}
      <rect x="48" y="59" width="4" height="3.5" rx="1" fill="white" {...COMMON} strokeWidth="1" />
    </g>
  );
}

function StarShape({ id }) {
  const c = PALETTE.star.fill;
  const points = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
    points.push(`${50 + 38 * Math.cos(outerAngle)},${50 + 38 * Math.sin(outerAngle)}`);
    points.push(`${50 + 18 * Math.cos(innerAngle)},${50 + 18 * Math.sin(innerAngle)}`);
  }
  return (
    <g>
      <GradientDefs id={id} color={c} />
      {/* Star body */}
      <polygon
        points={points.join(' ')}
        fill={`url(#wc-${id})`}
        {...COMMON}
        stroke="white"
        strokeWidth="6"
        style={{ paintOrder: 'stroke fill' }}
      />
      <polygon
        points={points.join(' ')}
        fill={`url(#wc-${id})`}
        {...COMMON}
      />
      {/* Face */}
      <circle cx="44" cy="46" r="2.5" fill={STROKE} />
      <circle cx="56" cy="46" r="2.5" fill={STROKE} />
      <circle cx="45" cy="45" r="0.9" fill="white" />
      <circle cx="57" cy="45" r="0.9" fill="white" />
      {/* Smile */}
      <path d="M45 53 Q50 58 55 53" fill="none" {...COMMON} strokeWidth="1.6" />
      {/* Cheeks */}
      <circle cx="39" cy="52" r="4" fill={lighten(c, 0.25)} opacity="0.4" />
      <circle cx="61" cy="52" r="4" fill={lighten(c, 0.25)} opacity="0.4" />
    </g>
  );
}

const ANIMAL_MAP = {
  bear:    Bear,
  rabbit:  Rabbit,
  cat:     Cat,
  fox:     Fox,
  dog:     Dog,
  panda:   Panda,
  pig:     Pig,
  duck:    Duck,
  deer:    Deer,
  penguin: Penguin,
  hamster: Hamster,
  star:    StarShape,
};

function StickerAnimal({ animal, size = 48 }) {
  const Renderer = ANIMAL_MAP[animal];
  if (!Renderer) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[StickerAnimal] Unknown animal: "${animal}". Valid: ${Object.keys(ANIMAL_MAP).join(', ')}`);
    }
    return null;
  }

  const id = `sticker-${animal}-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${animal} sticker`}
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <Renderer id={id} />
    </svg>
  );
}

export { StickerAnimal, PALETTE };
export default StickerAnimal;
