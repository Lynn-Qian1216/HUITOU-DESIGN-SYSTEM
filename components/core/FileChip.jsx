import React from 'react';
import { Icon } from './Icon.jsx';

/* 附件胶囊。三种状态共用一个外形，只换右侧那一小块：上传中给百分比 + 底边进度条，
   失败给原因和「重试」，完成给体积。换形状会让同一批文件在上传过程中排版反复重排。
   文件名从中间截断 —— 尾部的「_final_v3.mp4」才是分辨两个文件的地方。 */

const EXT_ICON = [
  [/\.(png|jpe?g|gif|webp|avif|svg)$/i, 'image'],
  [/\.(mp4|mov|avi|mkv|webm)$/i, 'clapperboard'],
  [/\.(pdf)$/i, 'file-text'],
  [/\.(csv|xlsx?|numbers)$/i, 'sheet'],
  [/\.(docx?|pages|md|txt)$/i, 'file-type'],
  [/\.(zip|rar|7z)$/i, 'file-archive'],
];

export function fileIcon(name) {
  const hit = EXT_ICON.find(([re]) => re.test(name || ''));
  return hit ? hit[1] : 'file';
}

export function formatBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}

/* 中间截断：留头 12 字、尾 10 字。 */
function clip(name) {
  if (!name || name.length <= 24) return name;
  return name.slice(0, 12) + '…' + name.slice(-10);
}

export function FileChip({ name, size, status = 'ready', progress = 0, error, onRemove, onRetry, style }) {
  const bad = status === 'error';
  const busy = status === 'uploading';
  return (
    <span style={Object.assign({
      position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)',
      height: 32, flex: 'none', padding: '0 var(--space-4) 0 var(--space-5)', overflow: 'hidden',
      borderWidth: 1, borderStyle: 'solid',
      borderColor: bad ? 'var(--status-danger-border)' : 'var(--border-subtle)',
      background: bad ? 'var(--status-danger-bg)' : 'var(--surface-card)',
      borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-13)', whiteSpace: 'nowrap', maxWidth: 260,
    }, style)}>
      <Icon name={bad ? 'triangle-alert' : fileIcon(name)} size={13}
        style={{ color: bad ? 'var(--status-danger-fg)' : 'var(--text-tertiary)', flex: 'none' }} />
      <span title={name} style={{ flex: 'none' }}>{clip(name)}</span>
      <span style={{ fontSize: 'var(--fs-11)', color: bad ? 'var(--status-danger-fg)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', flex: 'none' }}>
        {bad ? error || '上传失败' : busy ? Math.round(progress) + '%' : formatBytes(size)}
      </span>
      {bad && onRetry ? (
        <button type="button" onClick={onRetry}
          style={{ border: 0, background: 'transparent', padding: 0, font: 'inherit', fontSize: 'var(--fs-11)', color: 'var(--text-link)', cursor: 'pointer', flex: 'none' }}>重试</button>
      ) : null}
      {onRemove ? (
        <button type="button" aria-label={'移除 ' + name} onClick={onRemove}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          style={{ display: 'inline-flex', border: 0, background: 'transparent', padding: 2, cursor: 'pointer', color: 'var(--text-tertiary)', flex: 'none', transition: 'var(--transition-control)' }}>
          <Icon name="x" size={12} />
        </button>
      ) : null}
      {busy ? (
        <span style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: Math.max(2, progress) + '%', background: 'var(--neutral-800)', transition: 'width 160ms linear' }} />
      ) : null}
    </span>
  );
}
