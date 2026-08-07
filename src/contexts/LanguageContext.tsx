"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/user";
import type { Language } from "@/lib/types";
import en, { type TranslationKey } from "@/lib/i18n/en";
import de from "@/lib/i18n/de";

const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = { en, de };
const STORAGE_KEY = "citrusgrass-language";

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "de";
}

function detectBrowserLanguage(): Language {
  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

// A minimal external store so useSyncExternalStore can read localStorage
// safely: getServerSnapshot (SSR/static export) always returns "en", and
// React switches to getSnapshot only after client hydration - no effect
// needed, so this doesn't hit the set-state-in-effect anti-pattern that
// AuthContext also avoids (see its `loading` derived value).
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  return isLanguage(stored) ? stored : detectBrowserLanguage();
}

function getServerSnapshot(): Language {
  return "en";
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const storedLanguage = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // A logged-in user's saved preference overrides the local default, so it
  // follows them across devices (mirrors how AuthContext syncs the profile
  // doc via onSnapshot). Derived rather than effect-set, same as AuthContext's
  // `loading`.
  const language = profile?.preferredLanguage ?? storedLanguage;

  function setLanguage(next: Language) {
    localStorage.setItem(STORAGE_KEY, next);
    notify();
    if (user) {
      updateUserProfile(user.uid, { preferredLanguage: next });
    }
  }

  function t(key: TranslationKey, vars?: Record<string, string>): string {
    let value = DICTIONARIES[language][key] ?? en[key];
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{${name}}`, replacement);
      }
    }
    return value;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
