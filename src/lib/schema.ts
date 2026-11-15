import { z } from 'zod';

const pages = z.array(z.number().int().min(1).max(208)).min(1);

export const ReactionSchema = z.object({
  equation: z.string().min(3),
  conditions: z.string().optional(),
  observation: z.string().optional(),
  safety: z.string().optional(),
  note: z.string().optional(),
});

const Detail = z.object({
  concept: z.string().min(5),
  reactionIds: z.array(z.string()).optional(),
  observation: z.string().optional(),
  examTip: z.string().optional(),
  pages: pages.optional(),
});

const Column = z.object({ key: z.string(), label: z.string(), reaction: z.boolean().optional() });

const Table = z.object({
  id: z.string(),
  title: z.string(),
  columns: z.array(Column).min(2),
  rows: z.array(z.object({ id: z.string(), cells: z.record(z.string(), z.string()), detail: Detail.optional() })).min(1),
});

const base = {
  id: z.string().regex(/^g[89]-s\d{1,2}-q\d+$/),
  skill: z.string(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  stem: z.string().min(10),
  solution: z.string().min(10),
  mistakes: z.string().optional(),
};

export const QuestionSchema = z.discriminatedUnion('type', [
  z.object({ ...base, type: z.literal('Y1'), choices: z.array(z.string()).min(3).max(5), answer: z.number().int().min(0) }),
  z.object({ ...base, type: z.literal('Y2'), left: z.array(z.string()).min(2), right: z.array(z.string()).min(2), answer: z.array(z.number().int().min(0)) }),
  z.object({ ...base, type: z.literal('O1'), answer: z.union([z.number(), z.string()]), tolerance: z.number().min(0).optional(), unit: z.string().optional() }),
  z.object({ ...base, type: z.literal('O2'), steps: z.array(z.string()).min(2), rubric: z.array(z.object({ criterion: z.string(), points: z.number().positive() })).min(1) }),
]);

export const LessonSchema = z.object({
  id: z.string().regex(/^g[89]-s\d{1,2}$/),
  status: z.enum(['seed-verified', 'draft']),
  pages,
  summary: z.string().min(20),
  keyConcepts: z.array(z.string()).min(1),
  tables: z.array(Table).min(1),
  reactions: z.record(z.string(), ReactionSchema),
  clarifications: z.array(z.object({ text: z.string(), source: z.enum(['textbook2019', 'officialExamSpecification', 'additionalVerifiedSource']) })).optional(),
  questions: z.array(QuestionSchema),
});

export type Lesson = z.infer<typeof LessonSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;
export type LessonTable = z.infer<typeof Table>;

export interface SectionMeta {
  id: string; grade: 8 | 9; section: number; chapterId: string; title: string;
  pdfPage: number; printedPage: number; endPage: number | null;
  verification: string; source: { kind: string; citation: string };
}
export interface ChapterMeta { id: string; grade: 8 | 9; roman: string; title: string; sections: number[] }
