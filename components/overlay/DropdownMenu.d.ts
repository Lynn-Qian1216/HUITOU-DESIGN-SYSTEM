export interface DropdownMenuProps {
  /** { id, label, icon?, shortcut?, tone?: 'danger', disabled? } or { divider: true }. */
  items: Array<{ id?: string; label?: React.ReactNode; icon?: string; shortcut?: string; tone?: 'danger'; disabled?: boolean; divider?: boolean; onClick?: () => void }>;
  align?: 'left' | 'right';
  /** Element that opens the menu — usually an IconButton. */
  trigger: React.ReactNode;
  onSelect?: (id: string) => void;
  /** 触发器占满容器宽度（侧栏底部账号行这类整行可点的情形）。 */
  block?: boolean;
  style?: React.CSSProperties;
}
export declare function DropdownMenu(props: DropdownMenuProps): JSX.Element;
