const {useState,useEffect,useRef}=React;
const DS=window.HUITOUAIDesignSystem_52606d;
const resourceGroups=['品牌','颜色','字体','间距','动效','组件','交互设计思维记录','控制台','官网'];
const groupNames={'组件':'组件','交互设计思维记录':'交互模式','控制台':'控制台模板','官网':'官网模板'};
const descriptions={'品牌':'标识组合、安全边距与使用方式。','颜色':'中性色、语义色与界面层级。','字体':'字体家族、字号层级与数字排版。','间距':'间距刻度、控件高度、圆角与阴影。','动效':'统一的时长与缓动。','组件':'直接体验组件的样式、状态与操作。','交互设计思维记录':'真实投放工作流中的交互约定。','控制台':'工作台布局与完整页面。','官网':'品牌官网的页面与区块组合。'};
const kindNames={color:'颜色',font:'字体',typography:'字体',spacing:'间距',radius:'圆角',shadow:'阴影',other:'其他'};
const groupId=g=>'resource-group-'+resourceGroups.indexOf(g);
const resourceId=p=>'resource-'+p.replace(/[^a-zA-Z0-9]/g,'-');
const matches=(query,...values)=>values.join(' ').toLowerCase().includes(query.trim().toLowerCase());
const componentNames={core:'基础组件',navigation:'导航',forms:'表单',data:'数据展示',feedback:'反馈',overlay:'浮层',decision:'AI 决策',chat:'提问队列'};
const componentOrder=['core','navigation','forms','data','feedback','overlay','decision','chat'];
const componentKeywords={core:'按钮 图标 头像 徽标 标签 卡片 分割线 文件 引用',navigation:'面包屑 标签页 分页 分段控制器 筛选栏 侧栏 账户 顶部栏',forms:'输入框 多行输入 表单项 选择器 多选框 单选框 开关 日期 时间 范围',data:'表格 指标 趋势图 状态 时间轴 进度 评分',feedback:'警告 空状态 进度 骨架屏 加载 提示',overlay:'对话框 下拉菜单 文字提示 气泡 说明 面板',decision:'决策 优先级 时效 元信息 结果 验证追踪 询问 加载',chat:'提问 队列'};

function PreviewArticle({card,component=false}){
 const category=card.path.split('/')[1];
 return <article id={resourceId(card.path)} className="ds-demo" data-nav-id={component?resourceId(card.path):undefined} aria-labelledby={resourceId(card.path)+'-title'}>
  <header className="ds-demo-heading"><div><h3 id={resourceId(card.path)+'-title'}>{component?componentNames[category]||card.name:card.name}</h3>{card.subtitle&&<p>{card.subtitle}</p>}</div><a href={'../'+card.path} target="_blank" rel="noreferrer" aria-label={'单独查看'+card.name}>单独查看 ↗</a></header>
  <div className="ds-demo-canvas"><iframe loading="lazy" title={card.name+'示例'} src={'../'+card.path} width={Number(card.viewport.split('x')[0])||700} height={Number(card.viewport.split('x')[1])||500}/></div>
 </article>;
}

function App(){
 const [manifest,setManifest]=useState(null),[query,setQuery]=useState(''),[kind,setKind]=useState('all'),[error,setError]=useState(''),[toast,setToast]=useState(''),[active,setActive]=useState(''),[target,setTarget]=useState(null);
 const searchRef=useRef(null);
 useEffect(()=>{
  fetch('../_ds_manifest.json').then(r=>{if(!r.ok)throw Error('资源加载失败');return r.json()}).then(setManifest).catch(e=>setError(e.message));
  const change=()=>{setQuery('');setTarget({hash:location.hash})};
  const key=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchRef.current?.focus()}};
  addEventListener('hashchange',change);addEventListener('keydown',key);
  return()=>{removeEventListener('hashchange',change);removeEventListener('keydown',key)};
 },[]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),1800);return()=>clearTimeout(timer)},[toast]);
 useEffect(()=>{
  if(!manifest)return;
  const params=new URLSearchParams((target?.hash??location.hash).slice(1));
  const legacy=params.get('view');
  const legacyGroups={foundations:'品牌',components:'组件',overview:'组件',patterns:'交互设计思维记录',templates:'控制台'};
  let id=params.get('section')||(legacy==='tokens'?'design-tokens':legacyGroups[legacy]?groupId(legacyGroups[legacy]):resourceGroups.includes(legacy)?groupId(legacy):manifest.cards.some(c=>c.path===legacy)?resourceId(legacy):'');
  if(id?.startsWith('components-')||id==='live-examples')id=groupId('组件');
  const frame=requestAnimationFrame(()=>{if(id)document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'})});
  return()=>cancelAnimationFrame(frame);
 },[manifest,target]);
 useEffect(()=>{
  if(!manifest)return;let frame=0;
  const update=()=>{frame=0;let current=null;for(const node of document.querySelectorAll('[data-nav-id]')){if(node.getBoundingClientRect().top<=140)current=node;else break}setActive(current?.getAttribute('data-nav-id')||'')};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);
  return()=>{removeEventListener('scroll',scroll);removeEventListener('resize',scroll);cancelAnimationFrame(frame)};
 },[manifest,query]);
 function navigate(id){const hash=id?'#section='+encodeURIComponent(id):'';history.replaceState(null,'',location.pathname+location.search+hash);setQuery('');setTarget({hash});if(id==='design-tokens')setKind('all')}
 async function copy(name){try{await navigator.clipboard.writeText(name);setToast('已复制 '+name)}catch{setToast('请选择变量名称进行复制')}}
 if(!manifest)return <div className="ds-empty" role="status">{error||'正在加载慧投设计系统…'}</div>;
 const {cards,components,tokens}=manifest;
 const keywords=card=>card.group==='组件'?[componentKeywords[card.path.split('/')[1]],...components.filter(c=>c.sourcePath.split('/')[1]===card.path.split('/')[1]).map(c=>c.name)].join(' '):'';
 const visibleCards=cards.filter(c=>matches(query,c.name,c.subtitle,c.group,groupNames[c.group],c.path,keywords(c),c.group==='组件'?componentNames[c.path.split('/')[1]]:''));
 const orderedComponentCards=componentOrder.flatMap(id=>cards.filter(c=>c.path===`components/${id}/${id}.card.html`));
 const navGroups=[
  {title:'设计规范',items:resourceGroups.slice(0,5).map(g=>({id:groupId(g),name:g}))},
  {title:'组件',items:orderedComponentCards.map(c=>({id:resourceId(c.path),name:componentNames[c.path.split('/')[1]]}))},
  {title:'产品应用',items:resourceGroups.slice(6).map(g=>({id:groupId(g),name:groupNames[g]}))},
  {title:'开发资源',items:[{id:'design-tokens',name:'设计变量'}]},
 ];
 const filteredTokens=tokens.filter(t=>(kind==='all'||t.kind===kind)&&matches(query,t.name,t.value,t.definedIn,kindNames[t.kind]));
 const showTokens=!query||filteredTokens.length>0;
 return <div className="ds-app">
  <header className="ds-global-header"><a className="ds-brand" href="#" onClick={e=>{e.preventDefault();navigate('')}}><img src="../assets/logo-wordmark-cn-h.svg" alt="慧投"/><span>Design</span></a>
   <div className="ds-global-search"><DS.Icon name="search" size={15}/><input ref={searchRef} type="search" aria-label="搜索设计系统" placeholder="搜索规范、组件、模板或变量…" value={query} onChange={e=>{setQuery(e.target.value);window.scrollTo({top:0,behavior:'instant'})}}/><kbd>⌘ K</kbd></div>
   <div className="ds-header-actions"><span className="ds-version">v1.0.0</span><a href="https://github.com/Lynn-Qian1216/HUITOU-DESIGN-SYSTEM" target="_blank" rel="noreferrer" aria-label="GitHub 仓库"><DS.Icon name="github" size={19}/></a><a className="ds-open-console" href="../ui_kits/console/index.html" target="_blank" rel="noreferrer">打开工作台 ↗</a></div>
  </header>
  <div className="ds-body"><aside className="ds-sidebar"><nav aria-label="文档目录">{navGroups.map(group=><div className="ds-nav-group" key={group.title}><div className="ds-nav-label">{group.title}</div>{group.items.map(item=><button key={item.id} aria-current={active===item.id?'location':undefined} className={'ds-nav-button '+(active===item.id?'active':'')} onClick={()=>navigate(item.id)}>{item.name}</button>)}</div>)}</nav><a className="ds-back-top" href="#" onClick={e=>{e.preventDefault();navigate('')}}>↑ 回到顶部</a></aside>
   <main className="ds-main"><div className="ds-page-heading"><div className="ds-eyebrow">HUITOU DESIGN SYSTEM</div><h1>慧投设计系统</h1><p className="ds-page-description">从设计规范到产品应用，一处查看，直接体验。</p></div>
    {query&&<div className="ds-search-status" role="status"><span>“{query}” · {visibleCards.length} 项资源，{filteredTokens.length} 个变量</span><button onClick={()=>setQuery('')}>清除搜索 ×</button></div>}
    {resourceGroups.map(g=>{const items=g==='组件'?orderedComponentCards.filter(c=>visibleCards.includes(c)):visibleCards.filter(c=>c.group===g);return items.length>0&&<section className="ds-doc-section" key={g} id={groupId(g)} data-nav-id={g==='组件'?undefined:groupId(g)}><div className="ds-section-heading"><h2>{groupNames[g]||g}</h2><p>{descriptions[g]}</p></div>{items.map(c=><PreviewArticle key={c.path} card={c} component={g==='组件'}/>)}</section>})}
    {showTokens&&<section className="ds-doc-section" id="design-tokens" data-nav-id="design-tokens"><div className="ds-section-heading ds-token-heading"><div><h2>设计变量</h2><p>颜色、字体与间距的统一定义，点击复制即可使用。</p></div><select aria-label="变量类型" value={kind} onChange={e=>setKind(e.target.value)}><option value="all">全部类型</option>{[...new Set(tokens.map(t=>t.kind))].map(k=><option key={k} value={k}>{kindNames[k]||k}</option>)}</select></div><div className="ds-token-table"><table><thead><tr><th>变量名称</th><th>预览与定义</th><th>来源</th><th/></tr></thead><tbody>{filteredTokens.map(t=><tr key={t.name}><td><code>{t.name}</code></td><td><div className="ds-token-value">{t.kind==='color'&&<i style={{background:`var(${t.name})`}}/>}<code>{t.value}</code></div></td><td><code>{t.definedIn}</code></td><td><button onClick={()=>copy(t.name)} aria-label={'复制 '+t.name}>复制</button></td></tr>)}</tbody></table>{!filteredTokens.length&&<div className="ds-empty">当前类型没有匹配的变量。</div>}</div></section>}
    {!visibleCards.length&&!showTokens&&<div className="ds-empty">没有找到相关内容，试试「颜色」「表单」或「Button」。</div>}
    <footer className="ds-page-footer"><span>慧投 Design System · 持续迭代</span></footer>
   </main></div>{toast&&<div className="ds-toast" role="status">{toast}</div>}
 </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
