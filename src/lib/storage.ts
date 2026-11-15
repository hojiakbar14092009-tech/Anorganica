// Local persistence for small, user-owned state. localStorage (not IndexedDB) is enough for a few KB of JSON;
// every read is schema-validated so corrupted or old data falls back to defaults instead of crashing.
import { useSyncExternalStore } from 'react';
import { z } from 'zod';

const KEY = 'anorganica:v1';

const StateSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  tone: z.number().min(-1).max(1).default(0),
  warmth: z.number().min(-1).max(1).default(0),
  reduceMotion: z.boolean().default(false),
  lastLesson: z.string().nullable().default(null),
  recent: z.array(z.string()).max(8).default([]),
  favorites: z.array(z.string()).default([]),
  introSeen: z.boolean().default(false),
  installTipDismissed: z.boolean().default(false),
  // questionId -> last result; wrong answers drive "Xatolar ustida ishlash".
  answers: z.record(z.string(), z.object({ correct: z.boolean(), at: z.number() })).default({}),
});
export type AppState = z.infer<typeof StateSchema>;

function read(): AppState {
  try {
    const parsed = StateSchema.safeParse(JSON.parse(localStorage.getItem(KEY) ?? '{}'));
    return parsed.success ? parsed.data : StateSchema.parse({});
  } catch {
    return StateSchema.parse({});
  }
}

let state = read();
const listeners = new Set<() => void>();
export let storageError = false;

export function update(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageError = false;
  } catch {
    storageError = true; // quota exceeded / private mode: keep working in memory
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));
export const useAppState = () => useSyncExternalStore(subscribe, () => state);
export const getState = () => state;

export function exportProgress(): string {
  return JSON.stringify({ app: 'anorganica', version: 1, state }, null, 1);
}
export function importProgress(json: string): boolean {
  try {
    const data = z.object({ app: z.literal('anorganica'), state: StateSchema }).parse(JSON.parse(json));
    update(data.state);
    return true;
  } catch {
    return false;
  }
}

export function visitLesson(id: string) {
  update((s) => ({ lastLesson: id, recent: [id, ...s.recent.filter((r) => r !== id)].slice(0, 8) }));
}
