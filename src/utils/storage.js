const BEST_KEY = "best-score";

export function loadBestScore() {
  return Number(localStorage.getItem(BEST_KEY)) || 0;
}

export function saveBestScore(score) {
  localStorage.setItem(BEST_KEY, score);
}
