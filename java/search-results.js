// Live Server에서 직접 결과 페이지를 열어도 생성 전용 서버로 이동합니다.
// 생성 PNG를 저장할 때 자동 새로고침되어 결과가 사라지는 것을 방지합니다.
const needsGenerationServer = ["127.0.0.1", "localhost"].includes(location.hostname) && location.port !== "8008";
if (needsGenerationServer) {
  window.location.replace(`http://127.0.0.1:8008/naver/search.html${location.search}`);
}

// 검색어를 HTML로 해석하지 않고 텍스트로만 표시합니다.
const resultQuery = new URLSearchParams(window.location.search).get("q")?.trim() || "";
const queryField = document.querySelector(".search-query");
const heading = document.querySelector(".search-heading");
const statusText = document.querySelector(".search-status");
const gallery = document.querySelector(".search-gallery");
const toggle = document.querySelector(".search-toggle");
const countText = document.querySelector(".search-count");
queryField.value = resultQuery;
heading.textContent = resultQuery ? `${resultQuery} — 이미지 검색` : "이미지 검색";
document.title = heading.textContent;

// VS Code Live Server와 로컬 서버 모두 같은 Mac의 API를 사용합니다.
const isLocal = ["127.0.0.1", "localhost"].includes(location.hostname);
const apiBase = location.port === "8008" ? location.origin : "http://127.0.0.1:8008";
let running = false;
let loopPromise = null;
let activeJob = null;
let generationCount = 0;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(apiBase + path, { ...options, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new Error("로컬 이미지 서버에 연결할 수 없습니다。‘로컬 이미지 서버 실행.command’를 실행해 주세요。");
  }
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(typeof data.detail === "string" ? data.detail : "검색어를 확인해 주세요。");
    error.status = response.status;
    throw error;
  }
  return data;
}

function addImage(job) {
  generationCount += 1;
  const figure = document.createElement("figure");
  figure.className = "search-card";
  const image = document.createElement("img");
  image.src = apiBase + job.image;
  image.alt = `${resultQuery} — AI 생성 이미지 ${generationCount}`;
  image.width = image.height = 512;
  image.loading = "lazy";
  const caption = document.createElement("figcaption");
  caption.textContent = `${generationCount}번째 이미지 · ${job.seconds}초`;
  figure.append(image, caption);
  gallery.prepend(figure);
  // 장시간 실행해도 브라우저에 쌓이는 이미지는 최근 60장까지만 유지합니다.
  while (gallery.children.length > 60) gallery.lastElementChild.remove();
  countText.textContent = `${generationCount}장 생성`;
}

async function generateLoop() {
  try {
    while (running) {
      const health = await api("/api/health");
      if (!running) break;
      if (health.status === "error") throw new Error("모델을 불러오지 못했습니다。서버 실행 창을 확인해 주세요。");
      if (health.status !== "ready") {
        statusText.textContent = "Mac에서 이미지 모델을 준비하고 있습니다。처음에는 시간이 걸릴 수 있습니다。";
        await delay(2000);
        continue;
      }
      statusText.textContent = `${generationCount + 1}번째 이미지를 생성하고 있습니다。`;
      let job;
      try {
        job = await api("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: resultQuery }) });
      } catch (error) {
        if (error.status === 409 || error.status === 503) {
          statusText.textContent = "앞선 이미지 생성이 끝나기를 기다리고 있습니다。";
          await delay(2000);
          continue;
        }
        throw error;
      }
      activeJob = job.id;
      // 중지 직후 POST 응답이 도착한 경우에도 그 작업을 취소합니다.
      if (!running) { await api(`/api/jobs/${job.id}`, { method: "DELETE" }); activeJob = null; break; }
      const jobStartedAt = Date.now();
      while (running && job.status === "running") {
        await delay(1000);
        if (!running) break;
        statusText.textContent = `${generationCount + 1}번째 이미지 생성 중 · ${Math.floor((Date.now() - jobStartedAt) / 1000)}초 경과` ;
        job = await api(`/api/jobs/${activeJob}`);
      }
      if (!running) break;
      activeJob = null;
      if (job.status === "error") throw new Error(job.error || "이미지 생성에 실패했습니다。");
      if (job.status === "complete") addImage(job);
      await delay(1200); // 한 장씩 생성하며 GPU에 잠깐의 휴식을 줍니다.
    }
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    running = false;
    toggle.textContent = "생성 재개";
    loopPromise = null;
  }
}

function startGeneration() {
  if (loopPromise || !resultQuery || !isLocal) return;
  running = true;
  toggle.textContent = "생성 중지";
  loopPromise = generateLoop();
}

function stopGeneration() {
  running = false;
  toggle.textContent = "생성 재개";
  statusText.textContent = "생성을 중지했습니다。진행 중인 한 장의 연산이 끝나면 Mac이 대기합니다。";
  if (activeJob) {
    fetch(apiBase + `/api/jobs/${activeJob}`, { method: "DELETE", keepalive: true }).catch(() => {});
    activeJob = null;
  }
}

toggle.addEventListener("click", () => running ? stopGeneration() : startGeneration());
// 화면을 떠나거나 탭을 숨기면 연속 생성을 멈춥니다.
window.addEventListener("pagehide", stopGeneration);
document.addEventListener("visibilitychange", () => { if (document.hidden && running) stopGeneration(); });
if (!resultQuery) {
  statusText.textContent = "검색어를 입력해 주세요。";
  toggle.disabled = true;
} else if (!isLocal) {
  statusText.textContent = "이 기능은 모델이 설치된 Mac에서 사용합니다。http://127.0.0.1:8008/08.html로 접속해 주세요。";
  toggle.disabled = true;
} else if (needsGenerationServer) {
  statusText.textContent = "로컬 생성 서버로 이동하고 있습니다。";
} else if (document.hidden) {
  toggle.textContent = "생성 시작";
  statusText.textContent = "생성 시작을 누르면 이미지가 만들어집니다。";
} else {
  startGeneration();
}
