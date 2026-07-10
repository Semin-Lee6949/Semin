const FALLBACK_NEWS=[
  {id:'n1',category:'정책',title:'하반기 청년정책 신청 일정, 주거와 자산형성 지원 중심으로 확대',description:'정부와 지자체가 하반기 청년 지원 사업 접수 일정을 순차적으로 공개하고 있습니다. 신청 기간과 소득 기준을 함께 확인하는 것이 중요합니다.',source:'청년나침반 편집부',publishedAt:'2026-07-10T09:30:00+09:00',url:'https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch',score:98},
  {id:'n2',category:'주거',title:'청년 월세와 전세보증금 지원, 지역별 접수 조건 확인 필요',description:'주거비 부담 완화를 위한 월세 지원과 보증금 대출 사업은 거주지, 소득, 계약 형태에 따라 지원 요건이 달라집니다.',source:'주거브리핑',publishedAt:'2026-07-10T08:20:00+09:00',url:'https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch',score:94},
  {id:'n3',category:'일자리',title:'취업 준비 청년 대상 직무교육 과정, 디지털·제조 분야 모집 이어져',description:'직무교육과 일경험 프로그램이 산업별로 열리고 있으며, 일부 과정은 훈련비와 참여수당을 함께 제공합니다.',source:'커리어뉴스',publishedAt:'2026-07-09T17:40:00+09:00',url:'https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch',score:89},
  {id:'n4',category:'금융',title:'청년 자산형성 상품 비교할 때 납입 한도와 중도해지 조건 살펴야',description:'청년도약계좌 등 자산형성 상품은 혜택뿐 아니라 유지 기간, 납입 방식, 중도해지 시 불이익을 함께 비교해야 합니다.',source:'머니가이드',publishedAt:'2026-07-09T14:10:00+09:00',url:'https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch',score:84},
  {id:'n5',category:'생활',title:'고립·은둔 청년 지원 프로그램, 상담부터 일상 회복까지 단계별 운영',description:'심리상담, 공동활동, 진로 설계 등을 결합한 지역 프로그램이 확대되고 있어 본인에게 맞는 참여 방식을 고를 수 있습니다.',source:'생활정책저널',publishedAt:'2026-07-08T11:50:00+09:00',url:'https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch',score:78},
  {id:'n6',category:'정책',title:'지자체 청년수당 공고 확인 시 거주 기간과 미취업 기준 유의',description:'청년수당은 지역별 자격 조건 차이가 큰 편입니다. 공고문에서 거주 기간, 근로 시간, 중복 수혜 제한을 먼저 확인하세요.',source:'정책알림',publishedAt:'2026-07-08T09:15:00+09:00',url:'https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch',score:75},
  {id:'n7',category:'주거',title:'공공임대 예비입주자 모집, 청년·신혼부부 유형별 공급 물량 공개',description:'공공임대 모집은 신청 유형별 순위 기준과 제출 서류가 다르므로 모집공고 원문을 기준으로 준비해야 합니다.',source:'청약리포트',publishedAt:'2026-07-07T16:30:00+09:00',url:'housing.html',score:72},
  {id:'n8',category:'일자리',title:'중소기업 재직 청년 지원, 교통비·복지포인트 등 생활형 혜택 주목',description:'취업 이후에도 받을 수 있는 재직 청년 지원 사업은 회사 규모와 근속 기간에 따라 신청 가능 여부가 갈립니다.',source:'워크브리프',publishedAt:'2026-07-07T10:05:00+09:00',url:'https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch',score:69}
];

const ACCESS_HASH='56632b41c72527c1783c8d3e6abf8494d78289d06264aa39f675dd4685d20145';
async function sha256(value){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function unlock(){document.body.classList.remove('locked');document.querySelector('#accessGate')?.classList.add('unlocked');setTimeout(()=>document.querySelector('#accessGate')?.remove(),350);sessionStorage.setItem('youth-access','granted')}
if(sessionStorage.getItem('youth-access')==='granted')unlock();
document.querySelector('#gateForm')?.addEventListener('submit',async event=>{event.preventDefault();const card=event.currentTarget;const input=document.querySelector('#gatePassword');const error=document.querySelector('#gateError');if(await sha256(input.value)===ACCESS_HASH){unlock();return}error.textContent='비밀번호가 올바르지 않습니다.';input.value='';input.focus();card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake')});

const state={items:[...FALLBACK_NEWS],category:'전체',query:'',sort:'latest',visible:6};
const $=selector=>document.querySelector(selector);
const clean=value=>String(value??'').replace(/<[^>]*>/g,' ').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const pick=(obj,keys,fallback='')=>{for(const key of keys)if(obj?.[key]!=null&&obj[key]!=='')return obj[key];return fallback};
const stripTags=value=>clean(value).replace(/<\/?b>/g,'');
const deepItems=data=>{const candidates=[data?.items,data?.data,data?.result?.items,data?.result?.data,data?.news,data?.list];return candidates.find(Array.isArray)||[]};

function inferCategory(text){
  if(/주거|월세|전세|청약|임대|주택|보증금/.test(text))return '주거';
  if(/취업|채용|일자리|직무|재직|구직|창업/.test(text))return '일자리';
  if(/금융|저축|계좌|대출|자산|은행|적금/.test(text))return '금융';
  if(/문화|복지|상담|건강|생활|고립|은둔/.test(text))return '생활';
  return '정책';
}
function normalizeNews(item,index){
  const title=stripTags(pick(item,['title','newsTitle','subject'],`뉴스 ${index+1}`));
  const description=stripTags(pick(item,['description','summary','content'],'자세한 내용은 원문 기사에서 확인해 주세요.'));
  const text=`${title} ${description}`;
  return {
    id:String(pick(item,['id','link','originallink'],`news-${index}`)),
    category:clean(pick(item,['category','section'],inferCategory(text))),
    title,
    description,
    source:clean(pick(item,['source','publisher','press'],'뉴스')),
    publishedAt:pick(item,['pubDate','publishedAt','date'],new Date().toISOString()),
    url:pick(item,['originallink','link','url'],'#'),
    score:Number(pick(item,['score','rank'],50))
  };
}
function dateValue(value){const time=Date.parse(value);return Number.isFinite(time)?time:0}
function formatDate(value,mode='short'){
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '날짜 확인';
  return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:mode==='long'?'2-digit':undefined,minute:mode==='long'?'2-digit':undefined}).format(date);
}
function filtered(){
  const q=state.query.toLowerCase();
  const items=state.items.filter(item=>{
    const text=`${item.title} ${item.description} ${item.source} ${item.category}`.toLowerCase();
    return (state.category==='전체'||item.category===state.category)&&(!q||text.includes(q));
  });
  if(state.sort==='relevance')items.sort((a,b)=>(b.score||0)-(a.score||0)||dateValue(b.publishedAt)-dateValue(a.publishedAt));
  else items.sort((a,b)=>dateValue(b.publishedAt)-dateValue(a.publishedAt));
  return items;
}
function escapeHtml(value){return clean(value).replace(/[&<>'"]/g,match=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[match]))}
function safeUrl(value){try{const url=new URL(value,location.href);return ['http:','https:'].includes(url.protocol)?url.href:'#'}catch{return '#'}}
function setStatus(message,type='warn'){const el=$('#newsStatus');el.innerHTML=`<span></span>${message}`;el.className=`status-message show ${type}`}
function renderLead(items){
  const lead=items[0]||state.items[0];
  $('#leadStory').innerHTML=`<div class="lead-body"><span class="news-chip">${escapeHtml(lead.category)}</span><h2>${escapeHtml(lead.title)}</h2><p>${escapeHtml(lead.description)}</p><div class="news-meta"><span>${escapeHtml(lead.source)}</span><i></i><span>${escapeHtml(formatDate(lead.publishedAt,'long'))}</span></div><a class="news-link" href="${safeUrl(lead.url)}" target="_blank" rel="noopener">기사 원문 보기 <span>→</span></a></div><div class="lead-visual" aria-hidden="true"><span>NEWS FOCUS</span></div>`;
}
function renderHeadlines(items){
  $('#headlineList').innerHTML=items.slice(1,5).map(item=>`<a class="headline-item" href="${safeUrl(item.url)}" target="_blank" rel="noopener"><small>${escapeHtml(item.category)}</small><b>${escapeHtml(item.title)}</b><span>${escapeHtml(item.source)} · ${escapeHtml(formatDate(item.publishedAt))}</span></a>`).join('');
}
function renderList(items){
  $('#newsResultLabel').textContent=state.query?`검색 결과 ${items.length}개`:state.category==='전체'?'전체 뉴스':`${state.category} 뉴스`;
  $('#newsList').innerHTML=items.slice(0,state.visible).map(item=>`<a class="news-item" href="${safeUrl(item.url)}" target="_blank" rel="noopener"><time class="news-date" datetime="${escapeHtml(item.publishedAt)}">${escapeHtml(formatDate(item.publishedAt))}</time><div><span class="news-chip">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div><div class="news-source"><b>${escapeHtml(item.source)}</b><span>원문 보기</span></div></a>`).join('')||'<div class="empty-state">조건에 맞는 뉴스가 없어요.<br>검색어나 카테고리를 바꿔보세요.</div>';
  $('#newsMore').style.display=items.length>state.visible?'block':'none';
}
function render(){
  const items=filtered();
  renderLead(items);
  renderHeadlines(items);
  renderList(items);
  const latest=state.items.map(item=>dateValue(item.publishedAt)).sort((a,b)=>b-a)[0];
  $('#updatedAt').textContent=latest?formatDate(new Date(latest).toISOString(),'long'):'임시 데이터';
}
function applyNewsData(data){
  const items=deepItems(data).filter(item=>clean(pick(item,['title','newsTitle','subject'])));
  if(!items.length)throw new Error('usable fields empty');
  state.items=items.map(normalizeNews);
  setStatus(`뉴스 API 데이터 ${state.items.length.toLocaleString()}건을 확인했습니다.`,'ok');
}
async function loadNews(){
  try{
    const response=await fetch(`data/news.json?v=${Date.now()}`,{headers:{Accept:'application/json'},cache:'no-store'});
    if(!response.ok)throw new Error(`DATA ${response.status}`);
    applyNewsData(await response.json());
  }catch(error){
    setStatus('네이버 뉴스 API 연동 전이라 임시 데이터로 표시합니다.','warn');
  }
  render();
}
function submitSearch(value){state.query=value.trim();state.visible=6;render();$('#newsBoardTitle').scrollIntoView({behavior:'smooth',block:'start'})}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1800)}

$('#headerNewsSearch').addEventListener('submit',event=>{event.preventDefault();submitSearch($('#headerNewsInput').value)});
$('#newsFilters').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;document.querySelectorAll('#newsFilters button').forEach(item=>item.classList.remove('active'));button.classList.add('active');state.category=button.dataset.category;state.visible=6;render()});
$('#newsSort').addEventListener('change',event=>{state.sort=event.target.value;state.visible=6;render();toast('정렬 기준을 적용했어요.')});
$('#newsMore').addEventListener('click',()=>{state.visible+=6;render()});
$('#menuButton').addEventListener('click',()=>toast('상단 메뉴에서 정책, 청약, 뉴스를 이동할 수 있어요.'));

render();loadNews();
