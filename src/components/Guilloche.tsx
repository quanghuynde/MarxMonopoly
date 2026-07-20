interface Props {
  className?: string;
  color?: string;
  height?: number;
}

/**
 * A thin repeating engine-turned wave-line strip, in the style of a banknote
 * border. Renders as a full-width <svg> — the parent controls length via
 * layout (e.g. w-full) and color via the `color` prop or currentColor.
 */
export function Guilloche({ className, color = 'currentColor', height = 10 }: Props) {
  const patternId = 'guilloche-pattern';
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 80 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="20" height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M0,${height / 2} C5,0 15,${height} 20,${height / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.8"
          />
          <path
            d={`M0,${height / 2} C5,${height} 15,0 20,${height / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.4"
          />
        </pattern>
      </defs>
      <rect width="80" height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}
