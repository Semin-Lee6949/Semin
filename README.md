# 청년나침반

온통청년의 청년정책·청년콘텐츠를 한 화면에서 탐색하는 웹사이트입니다.

## API 데이터 동기화

온통청년은 GitHub Pages 브라우저 요청을 HTTP 403으로 차단합니다. 주택청약 API 키도 브라우저에 노출하지 않기 위해 GitHub Actions가 API 데이터를 정적 JSON으로 갱신하고 홈페이지는 `data/`의 JSON을 읽습니다.

주택청약 데이터는 30분마다 자동 동기화됩니다. 화면은 `data/housing.json`을 캐시 우회 방식으로 불러오고, 마지막 API 동기화 시각을 표시합니다. GitHub Pages만 쓰는 구조라 방문 순간마다 청약홈/API를 직접 호출하는 완전 실시간 방식은 아니지만, 별도 서버 없이 운영 가능한 준실시간 갱신 구조입니다.

### GitHub Actions 등록 방법

1. 저장소 페이지에서 상단의 Settings(설정)를 클릭합니다.
2. 왼쪽 메뉴에서 보이지 않으면 화면을 아래로 조금 스크롤한 뒤, Secrets(비밀값), Actions(작업), 또는 Security(보안) 쪽 항목을 찾습니다.
3. 비밀값 관리 화면이 열리면 New repository secret 버튼을 눌러 새 비밀값을 추가합니다.
4. 아래 항목을 각각 등록합니다.
   - `YOUTH_POLICY_API_KEY`: 정책 API 인증키
   - `YOUTH_CONTENT_API_KEY`: 콘텐츠 API 인증키
   - `HOUSING_SUBSCRIPTION_API_KEY`: 주택청약 API 인증키
   - `HOUSING_SUBSCRIPTION_API_URL`: 주택청약 API 요청 URL. 없으면 `https://api.odcloud.kr/api/15101046/v1/uddi:14a46595-03dd-47d3-a418-d64e52820598`을 사용합니다.
5. 등록이 끝나면 상단의 Actions 탭으로 이동합니다.
6. `Sync youth data` 워크플로우를 열고 Run workflow 버튼을 눌러 한 번 수동 실행합니다.

정책 API `/go/ythip/getPlcy`와 콘텐츠 API `/go/ythip/getContent`는 `pageSize=100`, `rtnType=json`으로 요청합니다.
주택청약 API는 `serviceKey`, `page=1`, `perPage=1000`, `returnType=JSON`으로 모든 페이지를 요청하고, 응답은 `data/housing.json`에 저장합니다.

2026-07-08 검증 결과 정책 키는 정상 인증되어 총 2,633건을 반환했습니다. 다만 정책명 등 핵심 필드는 제공처 응답에서 모두 `null`이었고, 콘텐츠 API는 HTTP 500을 반환했습니다. 제공처 장애 중에는 화면이 미리보기 데이터를 유지합니다.
