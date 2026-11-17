import * as React from 'react';

export interface SidebarAccountProps {
  name: string;
  /** 次行文字，通常是邮箱。省略则只显示名字 */
  email?: string;
  /** 菜单项，格式同 DropdownMenu。默认给出资料/团队/账单/偏好/帮助/退出登录 */
  items?: Array<{ id?: string; label?: React.ReactNode; icon?: string; tone?: 'danger'; divider?: boolean }>;
  onSelect?: (id: string) => void;
  /** 是否画上边框，默认 true */
  bordered?: boolean;
}

/** 侧栏底部账号行：整行可点，弹出上拉菜单（含退出登录）。 */
export declare function SidebarAccount(props: SidebarAccountProps): JSX.Element;
