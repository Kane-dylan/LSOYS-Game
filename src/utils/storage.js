const BEST_KEY = "best-score";

export function loadBestScore() {
  try {
    const stored = localStorage.getItem(BEST_KEY);
    const score = Number(stored);
    return isNaN(score) || score < 0 ? 0 : score;
  } catch (error) {
    console.warn('Failed to load best score:', error);
    return 0 ;
  }
}

export function saveBestScore(score) {
  try {
    if (typeof score !== 'number' || score < 0 || isNaN(score)) {
      console.warn('Invalid score provided  to saveBestScore', score);
      return false;
    }

    localStorage.setItem(BEST_KEY, score.toString());
    return true;
  } catch (error) {
    console.warn('Failed to save best score:', error);
    return false;    
  }
}

export function clearBestScore() {
  try {
    localStorage.removeItem(BEST_KEY);
    return true;
  } catch (error) {
    console.warn('Failed to clear  best score:', error)
    return false;
  }
}
