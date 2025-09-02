import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Config, ApiError, ApiErrorSchema } from './types.js';

export class CoolifyClient {
  private client: AxiosInstance;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.baseUrl}/api/v1`,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const errorData = ApiErrorSchema.safeParse(error.response.data);
          if (errorData.success) {
            throw new Error(`Coolify API Error: ${errorData.data.message}`);
          }
          throw new Error(`API Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
        }
        throw new Error(`Network Error: ${error.message}`);
      }
    );
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(endpoint);
    return response.data;
  }

  // Health check endpoint
  async healthCheck(): Promise<string> {
    try {
      // Health endpoint doesn't need /v1 prefix
      const response = await axios.get(`${this.config.baseUrl}/api/health`, {
        timeout: this.config.timeout,
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Health check failed: ${error.message || error}`);
    }
  }

  // Version endpoint
  async getVersion(): Promise<any> {
    return this.get('/version');
  }

  // Teams endpoints
  async listTeams(): Promise<any[]> {
    return this.get('/teams');
  }

  async getTeam(teamId: string): Promise<any> {
    return this.get(`/teams/${teamId}`);
  }

  async getCurrentTeam(): Promise<any> {
    return this.get('/teams/current');
  }

  async getCurrentTeamMembers(): Promise<any[]> {
    return this.get('/teams/current/members');
  }

  // Servers endpoints
  async listServers(): Promise<any[]> {
    return this.get('/servers');
  }

  async createServer(serverData: {
    name: string;
    ip: string;
    port: number;
    user: string;
    private_key_uuid: string;
    description?: string;
    proxy_type?: 'none' | 'nginx' | 'caddy';
    is_build_server?: boolean;
    instant_validate?: boolean;
  }): Promise<any> {
    return this.post('/servers', serverData);
  }

  async validateServer(uuid: string): Promise<any> {
    return this.post(`/servers/${uuid}/validate`);
  }

  async getServerResources(uuid: string): Promise<any[]> {
    return this.get(`/servers/${uuid}/resources`);
  }

  async getServerDomains(uuid: string): Promise<any[]> {
    return this.get(`/servers/${uuid}/domains`);
  }

  // Applications endpoints
  async listApplications(): Promise<any[]> {
    return this.get('/applications');
  }

  async createApplication(applicationData: {
    project_uuid: string;
    environment_name: string;
    destination_uuid: string;
    git_repository?: string;
    ports_exposes?: string;
    environment_uuid?: string;
  }): Promise<any> {
    return this.post('/applications', applicationData);
  }

  async startApplication(uuid: string): Promise<any> {
    return this.post(`/applications/${uuid}/start`);
  }

  async stopApplication(uuid: string): Promise<any> {
    return this.post(`/applications/${uuid}/stop`);
  }

  async restartApplication(uuid: string): Promise<any> {
    return this.post(`/applications/${uuid}/restart`);
  }


  // Services endpoints
  async listServices(): Promise<any[]> {
    return this.get('/services');
  }

  async createService(serviceData: {
    name: string;
    server_uuid: string;
    project_uuid: string;
    environment_name?: string;
    environment_uuid?: string;
    description?: string;
  }): Promise<any> {
    return this.post('/services', serviceData);
  }

  async startService(uuid: string): Promise<any> {
    return this.post(`/services/${uuid}/start`);
  }

  async stopService(uuid: string): Promise<any> {
    return this.post(`/services/${uuid}/stop`);
  }

  async restartService(uuid: string): Promise<any> {
    return this.post(`/services/${uuid}/restart`);
  }

  // Deployments endpoints
  async listDeployments(): Promise<any[]> {
    return this.get('/deployments');
  }

  async getDeployment(uuid: string): Promise<any> {
    return this.get(`/deployments/${uuid}`);
  }

  async listApplicationDeployments(uuid: string, skip = 0, take = 10): Promise<any[]> {
    return this.get(`/deployments/applications/${uuid}`, { skip, take });
  }

  // Private Keys endpoints
  async listPrivateKeys(): Promise<any[]> {
    return this.get('/private-keys');
  }

  async createPrivateKey(keyData: {
    name: string;
    private_key: string;
    description?: string;
  }): Promise<any> {
    return this.post('/private-keys', keyData);
  }

  // Environment Variables endpoints for Applications
  async listApplicationEnvs(uuid: string): Promise<any[]> {
    return this.get(`/applications/${uuid}/envs`);
  }

  async createApplicationEnv(uuid: string, envData: {
    key: string;
    value: string;
    is_build_time?: boolean;
    is_preview?: boolean;
    is_literal?: boolean;
  }): Promise<any> {
    return this.post(`/applications/${uuid}/envs`, envData);
  }

  async updateApplicationEnv(uuid: string, envData: {
    uuid: string;
    key?: string;
    value?: string;
    is_build_time?: boolean;
    is_preview?: boolean;
    is_literal?: boolean;
  }): Promise<any> {
    // CORRECTED: Use /applications/{uuid}/envs and send key+value in body
    const { uuid: envUuid, ...updateData } = envData;
    return this.patch(`/applications/${uuid}/envs`, updateData);
  }

  async bulkUpdateApplicationEnvs(uuid: string, envs: Array<{
    uuid?: string;
    key: string;
    value: string;
    is_build_time?: boolean;
    is_preview?: boolean;
    is_literal?: boolean;
  }>): Promise<any> {
    // CORRECTED: Use official API format with "data" wrapper
    return this.patch(`/applications/${uuid}/envs/bulk`, { data: envs });
  }

  async deleteApplicationEnv(applicationUuid: string, envUuid: string): Promise<any> {
    return this.delete(`/applications/${applicationUuid}/envs/${envUuid}`);
  }

  // Environment Variables endpoints for Services
  async listServiceEnvs(uuid: string): Promise<any[]> {
    return this.get(`/services/${uuid}/envs`);
  }

  async createServiceEnv(uuid: string, envData: {
    key: string;
    value: string;
    is_build_time?: boolean;
    is_preview?: boolean;
    is_literal?: boolean;
  }): Promise<any> {
    return this.post(`/services/${uuid}/envs`, envData);
  }

  async updateServiceEnv(uuid: string, envData: {
    key: string;
    value: string;
    is_build_time?: boolean;
    is_preview?: boolean;
    is_literal?: boolean;
  }): Promise<any> {
    // FIXED: Match official API - send key+value directly to /services/{uuid}/envs
    return this.patch(`/services/${uuid}/envs`, envData);
  }

  async bulkUpdateServiceEnvs(uuid: string, envs: Array<{
    uuid?: string;
    key: string;
    value: string;
    is_build_time?: boolean;
    is_preview?: boolean;
    is_literal?: boolean;
  }>): Promise<any> {
    // CORRECTED: Use official API format with "data" wrapper
    return this.patch(`/services/${uuid}/envs/bulk`, { data: envs });
  }

  async deleteServiceEnv(serviceUuid: string, envUuid: string): Promise<any> {
    return this.delete(`/services/${serviceUuid}/envs/${envUuid}`);
  }
}