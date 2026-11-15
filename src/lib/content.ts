import manifest from '../../content/manifest.json';
import { LessonSchema, type ChapterMeta, type Lesson, type SectionMeta } from './schema';

export const sections = manifest.sections as SectionMeta[];
export const chapters = manifest.chapters as ChapterMeta[];
export const sectionById = new Map(sections.map((s) => [s.id, s]));

// One lazy chunk per lesson; the service worker precaches all of them for offline use.
const lessonLoaders = import.meta.glob<{ default: unknown }>('../../content/lessons/*.json');
const loaderById = new Map(Object.entries(lessonLoaders).map(([path, load]) => [path.match(/(g\d-s\d+)\.json$/)![1]!, load]));

export const hasLesson = (id: string) => loaderById.has(id);

export async function loadLesson(id: string): Promise<Lesson | null> {
  const load = loaderById.get(id);
  if (!load) return null;
  return LessonSchema.parse((await load()).default);
}

export function neighbours(id: string): { prev?: SectionMeta; next?: SectionMeta } {
  const i = sections.findIndex((s) => s.id === id);
  return { prev: sections[i - 1], next: sections[i + 1] };
}
