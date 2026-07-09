import { mkdir, writeFile } from 'node:fs/promises';

const feeds = {
  policy: { path: '/go/ythip/getPlcy', key: process.env.YOUTH_POLICY_API_KEY },
  content: { path: '/go/ythip/getContent', key: process.env.YOUTH_CONTENT_API_KEY },
  housing: {
    url: process.env.HOUSING_SUBSCRIPTION_API_URL || 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail',
    key: process.env.HOUSING_SUBSCRIPTION_API_KEY,
    params: { page: '1', perPage: '100', returnType: 'JSON' }
  }
};

await mkdir('data', { recursive: true });
let failures = 0;

for (const [name, feed] of Object.entries(feeds)) {
  if (!feed.key) { console.error(`${name}: API 키가 없습니다.`); failures++; continue; }
  const url = new URL(feed.url || feed.path, feed.url ? undefined : 'https://www.youthcenter.go.kr');
  if (name === 'housing') {
    url.searchParams.set('serviceKey', feed.key);
    for (const [key, value] of Object.entries(feed.params)) url.searchParams.set(key, value);
  } else {
    url.searchParams.set('apiKeyNm', feed.key);
    url.searchParams.set('pageNum', '1');
    url.searchParams.set('pageSize', '100');
    url.searchParams.set('rtnType', 'json');
  }
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
    const type = response.headers.get('content-type') || '';
    if (!response.ok || !type.includes('application/json')) throw new Error(`HTTP ${response.status} ${type}`);
    const data = await response.json();
    const items = name === 'policy'
      ? data?.result?.youthPolicyList
      : name === 'content'
        ? (data?.result?.contentList || data?.result?.data)
        : (data?.data || data?.items || data?.response?.body?.items?.item);
    const titleKeys = name === 'policy'
      ? ['plcyNm', 'polyBizSjnm', 'title']
      : name === 'content'
        ? ['pstTtl', 'contentTitle', 'title']
        : ['HOUSE_NM', 'houseNm', 'hsmpNm', 'pblancNm', 'SUPLY_NM', 'name', 'title'];
    const hasUsableItem = Array.isArray(items) && items.some(item => titleKeys.some(key => String(item?.[key] || '').trim()));
    if (!hasUsableItem) throw new Error('핵심 데이터 필드가 비어 있습니다. 기존 파일을 유지합니다.');
    await writeFile(`data/${name}.json`, JSON.stringify(data), 'utf8');
    console.log(`${name}: 동기화 완료`);
  } catch (error) {
    console.error(`${name}: ${error.message}`);failures++;
  }
}

if (failures === Object.keys(feeds).length) process.exitCode = 1;
