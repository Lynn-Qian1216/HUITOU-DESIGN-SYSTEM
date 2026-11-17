(() => {

/* 团队是排他的：一个广告账户只属于一个团队，角色与权限也按团队定。
   所以「我在哪个团队」是全局状态，不是某一页的局部状态 —— 账户列表、广告计划、
   侧栏的账户切换器都读这里。改成局部状态的话，团队切换就只是个装饰。
   切换 UI 只有一处：侧栏底部身份区的 SidebarAccount。 */

const TEAMS = [
  { id: 't1', name: '王小卤 · 电商投放', created: '2025-06-18', role: 'owner',
    accounts: ['a1', 'a2', 'a3', 'b1'], switchIds: ['s1', 's2', 's3', 's5'] },
  { id: 't2', name: '宠物险 · 效果投放', created: '2025-11-04', role: 'admin',
    accounts: ['a4', 'a5', 'b2', 'b3'], switchIds: ['s4', 's6', 's7'] },
  { id: 't3', name: '外部代运营（协作）', created: '2026-02-09', role: 'operator',
    accounts: ['b4'], switchIds: [] },
];

let current = 't1';
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

function getTeam() { return TEAMS.find((t) => t.id === current) || TEAMS[0]; }
function setTeam(id) { if (id !== current) { current = id; notify(); } }
function renameTeam(id, name) { const t = TEAMS.find((x) => x.id === id); if (t) { t.name = name; notify(); } }
function createTeam(name) {
  const id = 't' + (TEAMS.length + 1) + Date.now().toString().slice(-3);
  TEAMS.push({ id: id, name: name, created: new Date().toISOString().slice(0, 10), role: 'owner', accounts: [], switchIds: [], fresh: true });
  current = id; notify();
  return id;
}
/* 账户是否属于当前团队。两套 id 都认：工作台的 ACCOUNTS 与侧栏切换器的 SWITCH_ACCOUNTS */
function inTeam(id) { const t = getTeam(); return t.accounts.includes(id) || t.switchIds.includes(id); }

function useTeam() {
  const [, force] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => { listeners.add(force); return () => listeners.delete(force); }, []);
  return { team: getTeam(), teams: TEAMS, setTeam, renameTeam, createTeam, inTeam };
}

Object.assign(window, { useTeam, HUITOU_TEAMS: TEAMS, teamInTeam: inTeam, getCurrentTeam: getTeam });
})();
