const {useState,useEffect}=React;
const groups=['品牌','颜色','字体','间距','动效','组件','交互设计思维记录','控制台','官网'];
const names={'交互设计思维记录':'交互规范','控制台':'控制台模板','官网':'官网模板'};
const descriptions={'品牌':'标识、安全边距与反色使用。','颜色':'中性色、语义色与数据可视化。','字体':'字体家族、层级与数字排版。','间距':'间距刻度、圆角与控件尺寸。','动效':'时长、缓动与状态反馈。','组件':'可直接操作的真实组件示例。','交互设计思维记录':'账户、对话、矩阵和团队的设计依据。','控制台':'页面布局与完整交互工作台。','官网':'品牌官网的页面组合。'};
const kindNames={color:'颜色',typography:'字体',spacing:'间距',radius:'圆角',shadow:'阴影',other:'其他'};
const readRoute=()=>new URLSearchParams(location.hash.slice(1)).get('view')||'overview';
function App(){
 const [manifest,setManifest]=useState(null),[view,setView]=useState(readRoute),[query,setQuery]=useState(''),[kind,setKind]=useState('all'),[toast,setToast]=useState(''),[error,setError]=useState('');
 useEffect(()=>{fetch('../_ds_manifest.json').then(r=>{if(!r.ok)throw Error('目录加载失败');return r.json()}).then(setManifest).catch(e=>setError(e.message));const fn=()=>setView(readRoute());addEventListener('hashchange',fn);return()=>removeEventListener('hashchange',fn)},[]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),1800);return()=>clearTimeout(t)},[toast]);
 function go(v){location.hash=new URLSearchParams({view:v}).toString();setView(v);setQuery('');window.scrollTo(0,0)}
 async function copy(value){try{await navigator.clipboard.writeText(value);setToast('已复制 '+value)}catch{setToast('复制不可用，请选择变量名称复制')}}
 if(!manifest)return <div className="ds-empty" role="status">{error||'正在加载设计系统…'}</div>;
 const {cards,tokens,components}=manifest;
 const card=cards.find(c=>c.path===view),group=groups.includes(view)?view:null;
 const match=(...s)=>s.join(' ').toLowerCase().includes(query.trim().toLowerCase());
 const matchedCards=cards.filter(c=>(!group||c.group===group)&&match(c.name,c.subtitle,c.group,c.path));
 const filteredTokens=tokens.filter(t=>(kind==='all'||t.kind===kind)&&match(t.name,t.value,t.definedIn));
 const title=card?card.name:group?(names[group]||group):view==='tokens'?'设计变量':view==='components'?'组件索引':'设计系统';
 return <div className="ds-shell">
  <aside className="ds-sidebar"><a className="ds-logo" href="#view=overview"><img src="../assets/logo-wordmark-cn-h.svg" alt="慧投"/><span>DESIGN</span></a>
   <input className="ds-search" type="search" aria-label="搜索设计系统" placeholder="搜索规范、组件、变量…" value={query} onChange={e=>setQuery(e.target.value)}/>
   <nav><div className="ds-nav-group"><div className="ds-nav-label">开始</div>{[['overview','概览'],['tokens','设计变量'],['components','组件索引']].map(([v,n])=><button key={v} className={'ds-nav-button '+(view===v?'active':'')} onClick={()=>go(v)}>{n}<small>{v==='tokens'?tokens.length:v==='components'?components.length:''}</small></button>)}</div>
    <div className="ds-nav-group"><div className="ds-nav-label">规范与资源</div>{groups.map(g=><button key={g} className={'ds-nav-button '+((group===g||card?.group===g)?'active':'')} onClick={()=>go(g)}>{names[g]||g}<small>{cards.filter(c=>c.group===g).length}</small></button>)}</div></nav>
   <div className="ds-sidebar-bottom">HUITOU Design System<br/>与当前项目源码共同维护</div>
  </aside>
  <main className="ds-main"><header className="ds-topbar"><div className="ds-crumb">资源库 <span aria-hidden="true"> / </span> <strong>{title}</strong></div><div className="ds-console"><a href="../ui_kits/marketing/index.html" target="_blank" rel="noreferrer">品牌官网 ↗</a><a href="../ui_kits/console/index.html" target="_blank" rel="noreferrer">打开控制台 ↗</a></div></header>
   <div className="ds-content"><div className="ds-eyebrow">HUITOU / {card?'REFERENCE':view==='tokens'?'TOKENS':'DESIGN SYSTEM'}</div><h1 className="ds-heading">{view==='overview'&&!query?'清晰、一致、可复用。':title}</h1><p className="ds-description">{card?card.subtitle:group?descriptions[group]:view==='tokens'?'查看项目中的颜色、排版、间距和动效变量。点击复制变量名，直接用于页面开发。':view==='components'?'组件导出与源文件索引。打开对应示例，可查看外观、状态和交互。':'慧投的视觉规范、基础组件与产品交互，汇集于此。设计与实现使用同一套源码，让每一次页面迭代保持一致。'}</p>
   {view==='tokens'?<><div className="ds-token-tools">{['all',...new Set(tokens.map(t=>t.kind))].map(k=><button key={k} className={'ds-chip '+(kind===k?'active':'')} onClick={()=>setKind(k)}>{k==='all'?'全部':kindNames[k]||k}</button>)}</div><div className="ds-table-wrap"><table className="ds-table"><thead><tr><th>变量</th><th>预览 / 定义值</th><th>来源</th><th></th></tr></thead><tbody>{filteredTokens.map(t=><tr key={t.name}><td><code>{t.name}</code></td><td><div className="ds-token-value">{t.kind==='color'?<span className="ds-token-swatch" style={{background:`var(${t.name})`}}/>:null}<code>{t.value}</code></div></td><td><code>{t.definedIn}</code></td><td><button className="ds-copy" onClick={()=>copy(t.name)}>复制</button></td></tr>)}</tbody></table>{!filteredTokens.length&&<div className="ds-empty">没有匹配的设计变量</div>}</div></>
   :view==='components'?<div className="ds-table-wrap" style={{marginTop:30}}><table className="ds-table"><thead><tr><th>组件</th><th>源文件</th><th>操作示例</th></tr></thead><tbody>{components.filter(c=>match(c.name,c.sourcePath)).map(c=>{const category=c.sourcePath.split('/')[1];const preview=cards.find(x=>x.path===`components/${category}/${category}.card.html`);return <tr key={c.name}><td><code>{c.name}</code></td><td><code>{c.sourcePath}</code></td><td>{preview?<button className="ds-copy" onClick={()=>go(preview.path)}>查看示例 →</button>:<span>组合模块</span>}</td></tr>})}</tbody></table></div>
   :card?<><div className="ds-preview"><div className="ds-preview-bar"><span>实时预览 · {card.viewport} · 可操作</span><a href={'../'+card.path} target="_blank" rel="noreferrer">独立打开 ↗</a></div><div className="ds-preview-scroll"><iframe key={card.path} title={card.name+'交互示例'} src={'../'+card.path} width={Number(card.viewport.split('x')[0])||700} height={Number(card.viewport.split('x')[1])||500}/></div></div><div className="ds-source">源文件 / {card.path}</div><div className="ds-note">此处直接加载项目里的规范与组件示例。修改对应源码后刷新页面，即可查看最新效果。</div></>
   :group||query?<div className="ds-card-list">{matchedCards.map(c=><button className="ds-card-row" key={c.path} onClick={()=>go(c.path)}><div><h3>{c.name}</h3><p>{c.subtitle||c.group+'组件示例'}</p></div><span>↗</span></button>)}{!matchedCards.length&&<div className="ds-empty">没有找到相关规范。变量与组件可在左侧对应目录中搜索。</div>}</div>
   :<><div className="ds-stats">{[[tokens.length,'设计变量'],[components.length,'组件导出'],[cards.length,'规范与示例']].map(([n,l])=><div className="ds-stat" key={l}><b>{n}</b><span>{l}</span></div>)}</div><div className="ds-section-heading"><h2>从基础到页面</h2><span>共享规范，持续迭代</span></div><div className="ds-grid">{groups.map((g,i)=><button className="ds-tile" key={g} onClick={()=>go(g)}><small>{String(i+1).padStart(2,'0')} / {cards.filter(c=>c.group===g).length} 份资源</small><h3>{names[g]||g} <span aria-hidden="true">↗</span></h3><p>{descriptions[g]}</p>{g==='颜色'&&<div className="ds-palette">{['#1b2126','#656f7a','#d1d9e0','#1d5bd6','#0a886c','#a57314'].map(c=><i key={c} style={{background:c}}/>)}</div>}</button>)}</div><div className="ds-note">登录页的苹果风视觉属于页面局部样式；此目录展示当前共享设计系统的原始规范。需要将某项改动推广到全局时，可以在这里统一调整。</div></>}
   </div>
  </main>{toast&&<div role="status" className="ds-toast">{toast}</div>}
 </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
