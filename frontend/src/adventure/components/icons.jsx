import React from "react";

const paths = {
  arrow: <><path d="M5 12h13" /><path d="m14 7 5 5-5 5" /></>,
  backpack: <><path d="M7 8.5A5 5 0 0 1 17 8.5" /><path d="M6 8.5h12a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2Z" /><path d="M8 14h8v4H8z" /><path d="M4 12H2v5h2M20 12h2v5h-2" /></>,
  camera: <><path d="M4 8h4l1.4-2h5.2L16 8h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" /><circle cx="12" cy="14" r="4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  gift: <><path d="M3 10h18v4H3zM5 14h14v7H5zM12 10v11" /><path d="M12 10H8.5A2.5 2.5 0 1 1 11 7.5V10Zm0 0h3.5A2.5 2.5 0 1 0 13 7.5V10Z" /></>,
  hourglass: <><path d="M6 3h12M6 21h12" /><path d="M8 3v4c0 2 1.3 3.2 4 5-2.7 1.8-4 3-4 5v4M16 3v4c0 2-1.3 3.2-4 5 2.7 1.8 4 3 4 5v4" /></>,
  leaf: <><path d="M20 4C12 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16Z" /><path d="M4 21c3-6 7-9 13-12" /></>,
  light: <><path d="M9 18h6M10 22h4" /><path d="M8.5 15.5A7 7 0 1 1 15.5 15.5C14.5 16.3 14 17 14 18h-4c0-1-.5-1.7-1.5-2.5Z" /><path d="M12 1V-1M4.2 4.2 2.8 2.8M19.8 4.2l1.4-1.4" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
  microphone: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" /></>,
  pen: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m14.5 7.5 3 3" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  replay: <><path d="M4 9V4m0 0h5M4 4l3.5 3.5" /><path d="M5.5 16a8 8 0 1 0 1-10" /></>,
  scroll: <><path d="M7 4h11a3 3 0 0 1 3 3v1h-5V7a3 3 0 0 1 3-3" /><path d="M17 20H6a3 3 0 0 1-3-3v-1h5v1a3 3 0 0 0 3 3" /><path d="M7 4v13a3 3 0 0 0 3 3M10 9h4M10 13h4" /></>,
  sound: <><path d="M4 10v4h4l5 4V6L8 10H4Z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></>,
  mute: <><path d="M4 10v4h4l5 4V6L8 10H4Z" /><path d="m17 10 5 5m0-5-5 5" /></>,
  spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" /><path d="m19 17 .8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 4 4 2-2 5 5" /></>,
};

export function GameIcon({ name, size = 24, strokeWidth = 1.8, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] || paths.spark}
    </svg>
  );
}

export function IconButton({ icon, label, onClick, badge = null, className = "", disabled = false, testId }) {
  return (
    <button
      type="button"
      className={`adv-icon-button ${className}`.trim()}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      <span className="adv-icon-button-inner"><GameIcon name={icon} size={24} /></span>
      {badge ? <span className="adv-icon-badge">{badge}</span> : null}
    </button>
  );
}

export function ActionButton({ icon = "arrow", children, className = "", ...props }) {
  return (
    <button type="button" className={`adv-action-button ${className}`.trim()} {...props}>
      <span>{children}</span>
      <GameIcon name={icon} size={27} strokeWidth={2.3} />
    </button>
  );
}
