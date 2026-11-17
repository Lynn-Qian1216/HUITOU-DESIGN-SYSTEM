import React from 'react';
import { Icon } from './Icon.jsx';
import { fileIcon, formatBytes } from './FileChip.jsx';

/* 附件卡片：比 FileChip 大一档，带缩略图。用在输入框上方这种「刚上传、还要确认一眼」的地方。
   图片给真缩略图 —— 一次传五张截图，光看 image.png 谁也认不出哪张是哪张。
   非图片给扩展名图标块，不硬凑缩略图：PDF 的首页缩到 40px 只是一团灰。
   点卡片可预览；× 只在悬停时出现，一排卡片上五个 × 太吵。 */

export function FileCard({ name, size, thumb, status = 'ready', progress = 0, error, onRemove, onRetry, onOpen, style }) {
  const [hover, setHover] = React.useState(false);
  const bad = status === 'error';
  const busy = status === 'uploading';
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onOpen && !bad ? onOpen : undefined}
      style={Object.assign({
        position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
        width: 232, height: 52, flex: 'none', padding: 'var(--space-4)', overflow: 'hidden',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: bad ? 'var(--status-danger-border)' : hover ? 'var(--border-default)' : 'var(--border-subtle)',
        background: bad ? 'var(--status-danger-bg)' : 'var(--surface-card)',
        borderRadius: 'var(--radius-md)', cursor: onOpen && !bad ? 'pointer' : 'default',
        transition: 'var(--transition-control)',
      }, style)}>
      <span style={{
        display: 'grid', placeItems: 'center', width: 40, height: 40, flex: 'none', overflow: 'hidden',
        borderRadius: 'var(--radius-xs)', background: thumb ? 'var(--neutral-100)' : 'var(--neutral-50)',
        borderWidth: thumb ? 0 : 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
      }}>
        {thumb
          ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <Icon name={bad ? 'triangle-alert' : fileIcon(name)} size={16} style={{ color: bad ? 'var(--status-danger-fg)' : 'var(--text-tertiary)' }} />}
      </span>

      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span title={name} style={{ fontSize: 'var(--fs-13)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-11)', color: bad ? 'var(--status-danger-fg)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>
          {bad ? error || '上传失败' : busy ? Math.round(progress) + '%' : formatBytes(size)}
          {bad && onRetry ? (
            <button type="button" onClick={(e) => { e.stopPropagation(); onRetry(); }}
              style={{ border: 0, background: 'transparent', padding: 0, font: 'inherit', fontSize: 'var(--fs-11)', color: 'var(--text-link)', cursor: 'pointer' }}>重试</button>
          ) : null}
        </span>
      </span>

      {onRemove && (hover || bad) ? (
        <button type="button" aria-label={'移除 ' + name} onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flex: 'none',
            border: 0, borderRadius: 'var(--radius-xs)', background: 'var(--surface-hover)',
            color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'var(--transition-control)',
          }}>
          <Icon name="x" size={12} />
        </button>
      ) : null}

      {busy ? (
        <span style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: Math.max(2, progress) + '%', background: 'var(--neutral-800)', transition: 'width 160ms linear' }} />
      ) : null}
    </div>
  );
}
