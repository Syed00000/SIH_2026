const STORAGE_KEY = 'joharsetu_faculty_custom_teams';
const STALE_PROJECT_IDS = new Set(['PRJ-20268640', 'PRJ-20265685', 'PRJ-20263603']);

export const facultyTeamsStorage = {
  getStoredTeams(validProjectIds = []) {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      if (!Array.isArray(raw)) return [];
      const validSet = validProjectIds.length > 0 ? new Set(validProjectIds) : null;
      const clean = raw.filter((t) => {
        if (!t) return false;
        const pid = t.projectId || '';
        if (STALE_PROJECT_IDS.has(pid)) return false;
        const title = (t.project || t.projectTitle || '').toLowerCase();
        if (title.includes('road beh') || title.includes('poor drainage')) return false;
        if (validSet && pid && !validSet.has(pid)) return false;
        return true;
      });
      if (clean.length !== raw.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      }
      return clean;
    } catch {
      return [];
    }
  },

  saveStoredTeams(teams = []) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch {
      // ignore
    }
  }
};
