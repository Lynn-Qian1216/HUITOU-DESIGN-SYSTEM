Lucide glyph that inherits `currentColor` — use for every icon in the system.

```jsx
<Icon name="sparkles" size={16} />
<Icon name="triangle-alert" size={14} style={{ color: 'var(--status-warning-fg)' }} />
```

Names are Lucide kebab-case. Stroke stays 1.5px at every size — never scale it. Icons are decorative by default; pass `title` only when the icon is the sole label.
