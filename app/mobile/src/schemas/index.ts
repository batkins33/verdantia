import { z } from 'zod';

export const DiagnosisIssueSchema = z.object({
  issue: z.string(),
  likelihood: z.enum(['low', 'medium', 'high']),
  evidence: z.array(z.string()).default([]),
  priority: z.number().int().positive().default(1),
});

export const DiagnosisActionSchema = z.object({
  step: z.string(),
  priority: z.number().int().positive().default(1),
  expected_window_hours: z.number().int().positive().optional(),
});

export const DiagnosisSchema = z.object({
  top_species: z.array(z.object({
    species_id: z.string(),
    confidence: z.number().min(0).max(1),
    why: z.array(z.string()).optional(),
  })),
  issues: z.array(DiagnosisIssueSchema),
  actions: z.array(DiagnosisActionSchema),
  confidence_overall: z.number().min(0).max(1),
});

export const CarePlanSchema = z.object({
  plant_id: z.string(),
  next_water_at: z.string(),
  interval_days: z.number().int().positive(),
  basis: z.record(z.unknown()),
  feed_plan: z.record(z.unknown()),
});

export const AlertSchema = z.object({
  type: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  message: z.string(),
  recommendations: z.array(z.string()),
});

export const AlertsResponseSchema = z.object({
  city: z.string(),
  alerts: z.array(AlertSchema),
  forecast_summary: z.object({
    temperature: z.string(),
    humidity: z.string(),
    conditions: z.string(),
  }),
});

// Type exports
export type DiagnosisIssue = z.infer<typeof DiagnosisIssueSchema>;
export type DiagnosisAction = z.infer<typeof DiagnosisActionSchema>;
export type Diagnosis = z.infer<typeof DiagnosisSchema>;
export type CarePlan = z.infer<typeof CarePlanSchema>;
export type Alert = z.infer<typeof AlertSchema>;
export type AlertsResponse = z.infer<typeof AlertsResponseSchema>;
