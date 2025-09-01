import { z } from 'zod';

// Configuration schema
export const ConfigSchema = z.object({
  baseUrl: z.string().min(1),
  apiToken: z.string().min(1),
  timeout: z.number().default(30000),
});

export type Config = z.infer<typeof ConfigSchema>;

// Common API response schemas
export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export const ServerSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  ip: z.string(),
  port: z.number(),
  user: z.string(),
  description: z.string().optional(),
  proxy_type: z.enum(['none', 'nginx', 'caddy']).optional(),
  is_build_server: z.boolean().optional(),
});

export const ApplicationSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string().optional(),
  git_repository: z.string().optional(),
  git_branch: z.string().optional(),
  ports_exposes: z.string().optional(),
  status: z.string().optional(),
  environment: z.string().optional(),
});

export const ServiceSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string().optional(),
  server_uuid: z.string(),
  environment_name: z.string().optional(),
});

export const DeploymentSchema = z.object({
  uuid: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  application_uuid: z.string().optional(),
  service_uuid: z.string().optional(),
});

export const PrivateKeySchema = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string(),
});

// API request/response types
export type Team = z.infer<typeof TeamSchema>;
export type Server = z.infer<typeof ServerSchema>;
export type Application = z.infer<typeof ApplicationSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Deployment = z.infer<typeof DeploymentSchema>;
export type PrivateKey = z.infer<typeof PrivateKeySchema>;

// API Error schema
export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;