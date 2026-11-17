import * as React from 'react';

export interface QueuedPrompt {
  /** 稳定标识，用于 React key 与增删定位 */
  id?: string | number;
  /** 排队的提问正文 */
  body: string;
  /** 该条携带的引用对象，最多展示 3 个，其余折为 +N */
  mentions?: Array<{ kind: string; label: string }>;
}

export interface PromptQueueProps {
  items?: QueuedPrompt[];
  /** 把该条取回输入框调整方向（同时从队列移除），渲染为「调整方向」文字按钮 */
  onEdit?: (item: QueuedPrompt) => void;
  /** 删除该条，渲染为常驻的垃桶图标按钮 */
  onRemove?: (item: QueuedPrompt) => void;
  /** 移到队首，下一条就发它 */
  onPromote?: (item: QueuedPrompt) => void;
  onClear?: () => void;
  /** 默认展开条数，超出折叠。默认 3 */
  visible?: number;
  /** 头部右侧说明文案，默认「当前回答结束后依次发送」 */
  note?: string;
}

/** 输入框上方的提问队列：生成未结束时继续发送的提问在此排队。 */
export declare function PromptQueue(props: PromptQueueProps): React.ReactElement | null;
