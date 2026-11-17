import React from 'react';

const SIZES = { xs: 20, sm: 24, md: 32, lg: 40 };

export function Avatar({ name = '', src, size = 'md', square, agent, style, ...rest }) {
  const px = SIZES[size] || size;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span {...rest} title={name} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
      width: px, height: px, borderRadius: square ? 'var(--radius-sm)' : 'var(--radius-pill)',
      background: agent ? 'var(--status-ai-bg)' : 'var(--neutral-900)',
      color: agent ? 'var(--status-ai-fg)' : 'var(--text-inverse)',
      border: agent ? '1px solid var(--status-ai-border)' : 'none',
      fontSize: Math.round(px * 0.36), fontWeight: 'var(--fw-medium)', letterSpacing: 0,
      overflow: 'hidden', ...style,
    }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}
