// Remembers the user's preferences between visits. Storage can be unavailable
// (private windows, blocked site data), so every access is guarded.

const KEY = "assignment7.preferences";

export function loadPreferences() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch {
        return {};
    }
}

export function savePreferences(preferences) {
    try {
        localStorage.setItem(KEY, JSON.stringify(preferences));
    } catch {
        // Preferences simply won't persist.
    }
}
