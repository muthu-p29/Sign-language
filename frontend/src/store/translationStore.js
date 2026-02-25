import { create } from "zustand";

function getInitialDarkMode() {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export const useTranslationStore = create((set, get) => ({
  // Translation state
  inputText: "",
  translatedWords: [],
  currentVideoIndex: 0,
  isPlaying: false,
  isLoading: false,

  // UI state
  darkMode: getInitialDarkMode(),

  // Actions
  setInputText: (text) => set({ inputText: text }),

  translateText: async (text) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/translate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        set({
          translatedWords: data.words,
          currentVideoIndex: 0,
          isLoading: false,
        });
        return { success: true, data };
      } else {
        set({ isLoading: false });
        return { success: false, error: "Translation failed" };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  setCurrentVideoIndex: (index) => set({ currentVideoIndex: index }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),

  clearTranslation: () =>
    set({
      translatedWords: [],
      currentVideoIndex: 0,
      isPlaying: false,
      isLoading: false,
    }),

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
      return { darkMode: next };
    }),

  reset: () =>
    set({
      inputText: "",
      translatedWords: [],
      currentVideoIndex: 0,
      isPlaying: false,
      isLoading: false,
    }),
}));

function getCsrfToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  return cookieValue;
}
