#!/usr/bin/env node

import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { CoolifyClient } from './coolify-client.js';
import { Config, ConfigSchema } from './types.js';
import { z } from 'zod';

// Load environment variables from .env file in the same directory as this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname); // Go up one level from dist to project root
config({ path: join(projectRoot, '.env') });

class CoolifyMCPServer {
  private server: Server;
  private coolify: CoolifyClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'coolify-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private getConfig(): Config {
    const baseUrl = process.env.COOLIFY_BASE_URL;
    const apiToken = process.env.COOLIFY_API_TOKEN;
    const timeout = process.env.COOLIFY_TIMEOUT ? parseInt(process.env.COOLIFY_TIMEOUT) : 30000;

    if (!baseUrl || !apiToken) {
      throw new Error('COOLIFY_BASE_URL and COOLIFY_API_TOKEN environment variables are required');
    }

    return {
      baseUrl,
      apiToken,
      timeout,
    };
  }

  private getCoolifyClient(): CoolifyClient {
    if (!this.coolify) {
      const config = this.getConfig();
      this.coolify = new CoolifyClient(config);
    }
    return this.coolify;
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getTools(),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const coolify = this.getCoolifyClient();
        
        switch (name) {
          case 'get_version':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.getVersion(), null, 2),
                },
              ],
            };

          case 'health_check':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.healthCheck(), null, 2),
                },
              ],
            };

          case 'list_teams':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listTeams(), null, 2),
                },
              ],
            };

          case 'get_team':
            const { team_id } = z.object({ team_id: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.getTeam(team_id), null, 2),
                },
              ],
            };

          case 'get_current_team':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.getCurrentTeam(), null, 2),
                },
              ],
            };

          case 'get_current_team_members':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.getCurrentTeamMembers(), null, 2),
                },
              ],
            };

          case 'list_servers':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listServers(), null, 2),
                },
              ],
            };

          case 'create_server':
            const serverData = z.object({
              name: z.string(),
              ip: z.string(),
              port: z.number(),
              user: z.string(),
              private_key_uuid: z.string(),
              description: z.string().optional(),
              proxy_type: z.enum(['none', 'nginx', 'caddy']).optional(),
              is_build_server: z.boolean().optional(),
              instant_validate: z.boolean().optional(),
            }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.createServer(serverData), null, 2),
                },
              ],
            };

          case 'validate_server':
            const { uuid: serverUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.validateServer(serverUuid), null, 2),
                },
              ],
            };

          case 'get_server_resources':
            const { uuid: resourcesUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.getServerResources(resourcesUuid), null, 2),
                },
              ],
            };

          case 'get_server_domains':
            const { uuid: domainsUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.getServerDomains(domainsUuid), null, 2),
                },
              ],
            };

          case 'list_services':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listServices(), null, 2),
                },
              ],
            };

          case 'create_service':
            const serviceData = z.object({
              name: z.string(),
              server_uuid: z.string(),
              project_uuid: z.string(),
              environment_name: z.string().optional(),
              environment_uuid: z.string().optional(),
              description: z.string().optional(),
            }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.createService(serviceData), null, 2),
                },
              ],
            };

          case 'start_service':
            const { uuid: startServiceUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.startService(startServiceUuid), null, 2),
                },
              ],
            };

          case 'stop_service':
            const { uuid: stopServiceUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.stopService(stopServiceUuid), null, 2),
                },
              ],
            };

          case 'restart_service':
            const { uuid: restartServiceUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.restartService(restartServiceUuid), null, 2),
                },
              ],
            };

          case 'list_applications':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listApplications(), null, 2),
                },
              ],
            };

          case 'create_application':
            const applicationData = z.object({
              project_uuid: z.string(),
              environment_name: z.string(),
              destination_uuid: z.string(),
              git_repository: z.string().optional(),
              ports_exposes: z.string().optional(),
              environment_uuid: z.string().optional(),
            }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.createApplication(applicationData), null, 2),
                },
              ],
            };

          case 'start_application':
            const { uuid: startAppUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.startApplication(startAppUuid), null, 2),
                },
              ],
            };

          case 'stop_application':
            const { uuid: stopAppUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.stopApplication(stopAppUuid), null, 2),
                },
              ],
            };

          case 'restart_application':
            const { uuid: restartAppUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.restartApplication(restartAppUuid), null, 2),
                },
              ],
            };


          case 'list_deployments':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listDeployments(), null, 2),
                },
              ],
            };

          case 'get_deployment':
            const { uuid: deploymentUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.getDeployment(deploymentUuid), null, 2),
                },
              ],
            };

          case 'list_private_keys':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listPrivateKeys(), null, 2),
                },
              ],
            };

          case 'create_private_key':
            const keyData = z.object({
              name: z.string(),
              private_key: z.string(),
              description: z.string().optional(),
            }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.createPrivateKey(keyData), null, 2),
                },
              ],
            };

          // Application Environment Variables
          case 'list_application_envs':
            const { uuid: listAppEnvUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listApplicationEnvs(listAppEnvUuid), null, 2),
                },
              ],
            };

          case 'create_application_env':
            const createAppEnvArgs = z.object({
              uuid: z.string(),
              key: z.string(),
              value: z.string(),
              is_build_time: z.boolean().optional(),
              is_preview: z.boolean().optional(),
              is_literal: z.boolean().optional(),
            }).parse(args);
            const { uuid: createAppEnvUuid, ...createAppEnvData } = createAppEnvArgs;
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.createApplicationEnv(createAppEnvUuid, createAppEnvData), null, 2),
                },
              ],
            };

          case 'update_application_env':
            const updateAppEnvArgs = z.object({
              application_uuid: z.string(),
              env_uuid: z.string(),
              key: z.string().optional(),
              value: z.string().optional(),
              is_build_time: z.boolean().optional(),
              is_preview: z.boolean().optional(),
              is_literal: z.boolean().optional(),
            }).parse(args);
            const { application_uuid: updateAppUuid, env_uuid: updateEnvUuid, ...updateAppEnvData } = updateAppEnvArgs;
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.updateApplicationEnv(updateAppUuid, { uuid: updateEnvUuid, ...updateAppEnvData }), null, 2),
                },
              ],
            };

          case 'bulk_update_application_envs':
            const bulkUpdateAppArgs = z.object({
              uuid: z.string(),
              envs: z.array(z.object({
                uuid: z.string().optional(),
                key: z.string(),
                value: z.string(),
                is_build_time: z.boolean().optional(),
                is_preview: z.boolean().optional(),
                is_literal: z.boolean().optional(),
              })),
            }).parse(args);
            const { uuid: bulkAppUuid, envs: bulkAppEnvs } = bulkUpdateAppArgs;
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.bulkUpdateApplicationEnvs(bulkAppUuid, bulkAppEnvs), null, 2),
                },
              ],
            };

          case 'delete_application_env':
            const { application_uuid: delAppUuid, env_uuid: delAppEnvUuid } = z.object({
              application_uuid: z.string(),
              env_uuid: z.string(),
            }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.deleteApplicationEnv(delAppUuid, delAppEnvUuid), null, 2),
                },
              ],
            };

          // Service Environment Variables
          case 'list_service_envs':
            const { uuid: listServiceEnvUuid } = z.object({ uuid: z.string() }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.listServiceEnvs(listServiceEnvUuid), null, 2),
                },
              ],
            };

          case 'create_service_env':
            const createServiceEnvArgs = z.object({
              uuid: z.string(),
              key: z.string(),
              value: z.string(),
              is_build_time: z.boolean().optional(),
              is_preview: z.boolean().optional(),
              is_literal: z.boolean().optional(),
            }).parse(args);
            const { uuid: createServiceEnvUuid, ...createServiceEnvData } = createServiceEnvArgs;
            
            // Warning for build-time variables on services
            let createWarningMessage = '';
            if (createServiceEnvData.is_build_time) {
              createWarningMessage = '\n\n⚠️  WARNING: is_build_time=true has no functional effect on services. Services use pre-built images and do not have a build phase. This flag is only meaningful for applications that build from source code.';
            }
            
            const createResult = await coolify.createServiceEnv(createServiceEnvUuid, createServiceEnvData);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(createResult, null, 2) + createWarningMessage,
                },
              ],
            };

          case 'update_service_env':
            const updateServiceEnvArgs = z.object({
              service_uuid: z.string(),
              key: z.string(),
              value: z.string(),
              is_build_time: z.boolean().optional(),
              is_preview: z.boolean().optional(),
              is_literal: z.boolean().optional(),
            }).parse(args);
            const { service_uuid: updateServiceUuid, ...updateServiceEnvData } = updateServiceEnvArgs;
            
            // Warning for build-time variables on services
            let updateWarningMessage = '';
            if (updateServiceEnvData.is_build_time) {
              updateWarningMessage = '\n\n⚠️  WARNING: is_build_time=true has no functional effect on services. Services use pre-built images and do not have a build phase. This flag is only meaningful for applications that build from source code.';
            }
            
            const updateResult = await coolify.updateServiceEnv(updateServiceUuid, updateServiceEnvData);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(updateResult, null, 2) + updateWarningMessage,
                },
              ],
            };

          case 'bulk_update_service_envs':
            const bulkUpdateServiceArgs = z.object({
              uuid: z.string(),
              data: z.array(z.object({
                key: z.string(),
                value: z.string(),
                is_build_time: z.boolean().optional(),
                is_preview: z.boolean().optional(),
                is_literal: z.boolean().optional(),
              })),
            }).parse(args);
            const { uuid: bulkServiceUuid, data: bulkServiceEnvs } = bulkUpdateServiceArgs;
            
            // Warning for build-time variables on services
            let bulkWarningMessage = '';
            const buildTimeVars = bulkServiceEnvs.filter(env => env.is_build_time);
            if (buildTimeVars.length > 0) {
              const varNames = buildTimeVars.map(env => env.key).join(', ');
              bulkWarningMessage = `\n\n⚠️  WARNING: is_build_time=true has no functional effect on services. The following variables have this flag set but will be ignored: ${varNames}. Services use pre-built images and do not have a build phase. This flag is only meaningful for applications that build from source code.`;
            }
            
            const bulkResult = await coolify.bulkUpdateServiceEnvs(bulkServiceUuid, bulkServiceEnvs);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(bulkResult, null, 2) + bulkWarningMessage,
                },
              ],
            };

          case 'delete_service_env':
            const { service_uuid: delServiceUuid, env_uuid: delServiceEnvUuid } = z.object({
              service_uuid: z.string(),
              env_uuid: z.string(),
            }).parse(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await coolify.deleteServiceEnv(delServiceUuid, delServiceEnvUuid), null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'get_version',
        description: 'Get Coolify version information. Returns the current version of the Coolify instance.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'health_check',
        description: 'Check Coolify API health status. Note: This endpoint may not be available in all Coolify versions, including the current version (4.0.0-beta.397).',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'list_teams',
        description: 'List all teams the authenticated user has access to. Use this to get team UUIDs needed for other operations.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_team',
        description: 'Get details of a specific team. Requires a team ID obtained from list_teams.',
        inputSchema: {
          type: 'object',
          properties: {
            team_id: {
              type: 'string',
              description: 'ID of the team to retrieve. This is typically a numeric ID obtained from the list_teams response.',
            },
          },
          required: ['team_id'],
        },
      },
      {
        name: 'get_current_team',
        description: 'Get details of the currently authenticated team. This is the team associated with your API token.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_current_team_members',
        description: 'Get a list of all members in the currently authenticated team. Shows who has access to team resources.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'list_servers',
        description: 'List all servers registered in your Coolify instance. Use this to get server UUIDs needed for other operations.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'create_server',
        description: 'Create a new server in Coolify. Requires SSH access details and a private key for authentication.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'A unique, human-readable name for the server',
            },
            ip: {
              type: 'string',
              description: 'IP address of the server. Can be IPv4 or IPv6.',
            },
            port: {
              type: 'number',
              description: 'SSH port number',
              default: 22,
            },
            user: {
              type: 'string',
              description: 'SSH username for authentication',
            },
            private_key_uuid: {
              type: 'string',
              description: 'UUID of the private key to use for SSH authentication. Obtain this from list_private_keys.',
            },
            description: {
              type: 'string',
              description: 'Optional description of the server\'s purpose or configuration',
            },
            proxy_type: {
              type: 'string',
              enum: ['none', 'nginx', 'caddy'],
              description: 'Type of proxy to use for this server',
              default: 'nginx',
            },
            is_build_server: {
              type: 'boolean',
              description: 'Whether this server should be used for building applications',
              default: false,
            },
            instant_validate: {
              type: 'boolean',
              description: 'Whether to validate the server configuration immediately after creation',
              default: true,
            },
          },
          required: ['name', 'ip', 'port', 'user', 'private_key_uuid'],
        },
      },
      {
        name: 'validate_server',
        description: 'Validate a server\'s configuration and connectivity. Use this to verify server setup and troubleshoot connection issues.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'ID of the server to validate. Get this from list_servers.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'get_server_resources',
        description: 'Get a list of applications and services running on a server. This provides an overview of all resources deployed on the specified server.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'ID of the server to check. Get this from list_servers.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'get_server_domains',
        description: 'Get a list of domains configured for a server. These domains are used for routing traffic to applications and services.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'ID of the server to get domains for. Get this from list_servers.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'list_services',
        description: 'List all services across your Coolify instance. Services are containerized applications running on your servers.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'create_service',
        description: 'Create a new service on a specified server. Services are containerized applications that run on your Coolify servers.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'A unique, human-readable name for the service',
            },
            server_uuid: {
              type: 'string',
              description: 'UUID of the server where this service will run. Obtain this from list_servers.',
            },
            project_uuid: {
              type: 'string',
              description: 'UUID of the project this service belongs to. Projects help organize related services.',
            },
            environment_name: {
              type: 'string',
              description: 'Name of the environment (e.g., production, staging, development)',
            },
            environment_uuid: {
              type: 'string',
              description: 'Optional UUID of an existing environment to use',
            },
            description: {
              type: 'string',
              description: 'Optional description of the service\'s purpose or configuration',
            },
          },
          required: ['name', 'server_uuid', 'project_uuid'],
        },
      },
      {
        name: 'start_service',
        description: 'Start a previously created service. This will initialize the service container and make it accessible.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the service to start. Obtain this from list_services or from the create_service response.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'stop_service',
        description: 'Stop a running service. This will gracefully shut down the service container.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the service to stop. Get this from list_services.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'restart_service',
        description: 'Restart a service by stopping and starting it again. Useful for applying configuration changes or recovering from issues.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the service to restart. Get this from list_services.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'list_applications',
        description: 'List all applications across your Coolify instance. Applications are deployable units sourced from Git repositories.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'create_application',
        description: 'Create a new application in Coolify. Applications are deployable units that can be sourced from Git repositories.',
        inputSchema: {
          type: 'object',
          properties: {
            project_uuid: {
              type: 'string',
              description: 'UUID of the project this application belongs to. Projects help organize related applications.',
            },
            environment_name: {
              type: 'string',
              description: 'Name of the deployment environment (e.g., production, staging, development)',
            },
            destination_uuid: {
              type: 'string',
              description: 'UUID of the destination server where this application will be deployed. Get this from list_servers.',
            },
            git_repository: {
              type: 'string',
              description: 'URL of the Git repository containing the application code',
            },
            ports_exposes: {
              type: 'string',
              description: 'Comma-separated list of ports to expose (e.g., "3000,8080"). These ports will be accessible from outside the container.',
            },
            environment_uuid: {
              type: 'string',
              description: 'Optional UUID of an existing environment to use',
            },
          },
          required: ['project_uuid', 'environment_name', 'destination_uuid'],
        },
      },
      {
        name: 'start_application',
        description: 'Start a previously created application. This will initialize the application container and make it accessible.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the application to start. Obtain this from list_applications or from the create_application response.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'stop_application',
        description: 'Stop a running application. This will gracefully shut down the application container.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the application to stop. Get this from list_applications.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'restart_application',
        description: 'Restart an application by stopping and starting it again. Useful for applying configuration changes or recovering from issues.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the application to restart. Get this from list_applications.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'list_deployments',
        description: 'List all deployments across your Coolify instance. Deployments represent the history of application and service deployments.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_deployment',
        description: 'Get detailed information about a specific deployment. Use this to monitor deployment status and troubleshoot issues.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the deployment to retrieve. Obtain this from list_deployments or from deployment event responses.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'list_private_keys',
        description: 'List all SSH private keys stored in Coolify. These keys are used for server authentication and Git repository access.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'create_private_key',
        description: 'Create a new SSH private key in Coolify for server authentication or Git repository access.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'A unique, human-readable name for the private key',
            },
            private_key: {
              type: 'string',
              description: 'The SSH private key content in PEM format. Must be a valid SSH private key.',
            },
            description: {
              type: 'string',
              description: 'Optional description of the key\'s purpose or usage',
            },
          },
          required: ['name', 'private_key'],
        },
      },
      // Application Environment Variables
      {
        name: 'list_application_envs',
        description: 'List all environment variables for a specific application. Use this to view current environment configuration.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the application to list environment variables for. Get this from list_applications.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'create_application_env',
        description: 'Create a new environment variable for an application. This adds a new key-value pair to the application\'s environment.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the application to add the environment variable to.',
            },
            key: {
              type: 'string',
              description: 'Environment variable name (e.g., "DATABASE_URL", "API_KEY").',
            },
            value: {
              type: 'string',
              description: 'Environment variable value.',
            },
            is_build_time: {
              type: 'boolean',
              description: 'Whether this variable should be available during build time.',
            },
            is_preview: {
              type: 'boolean',
              description: 'Whether this variable applies to preview deployments.',
            },
            is_literal: {
              type: 'boolean',
              description: 'Whether the value should be treated as a literal string without variable substitution.',
            },
          },
          required: ['uuid', 'key', 'value'],
        },
      },
      {
        name: 'update_application_env',
        description: 'Update an existing environment variable for an application. This modifies the value or settings of an existing environment variable.',
        inputSchema: {
          type: 'object',
          properties: {
            application_uuid: {
              type: 'string',
              description: 'UUID of the application containing the environment variable.',
            },
            env_uuid: {
              type: 'string',
              description: 'UUID of the environment variable to update. Get this from list_application_envs.',
            },
            key: {
              type: 'string',
              description: 'New environment variable name (optional if only updating value).',
            },
            value: {
              type: 'string',
              description: 'New environment variable value (optional if only updating other properties).',
            },
            is_build_time: {
              type: 'boolean',
              description: 'Whether this variable should be available during build time.',
            },
            is_preview: {
              type: 'boolean',
              description: 'Whether this variable applies to preview deployments.',
            },
            is_literal: {
              type: 'boolean',
              description: 'Whether the value should be treated as a literal string without variable substitution.',
            },
          },
          required: ['application_uuid', 'env_uuid'],
        },
      },
      {
        name: 'bulk_update_application_envs',
        description: 'Update multiple environment variables for an application in a single operation. Efficient for updating many variables at once.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the application to update environment variables for.',
            },
            envs: {
              type: 'array',
              description: 'Array of environment variables to update or create.',
              items: {
                type: 'object',
                properties: {
                  uuid: {
                    type: 'string',
                    description: 'UUID of existing environment variable (omit to create new).',
                  },
                  key: {
                    type: 'string',
                    description: 'Environment variable name.',
                  },
                  value: {
                    type: 'string',
                    description: 'Environment variable value.',
                  },
                  is_build_time: {
                    type: 'boolean',
                    description: 'Whether this variable should be available during build time.',
                  },
                  is_preview: {
                    type: 'boolean',
                    description: 'Whether this variable applies to preview deployments.',
                  },
                  is_literal: {
                    type: 'boolean',
                    description: 'Whether the value should be treated as a literal string.',
                  },
                },
                required: ['key', 'value'],
              },
            },
          },
          required: ['uuid', 'envs'],
        },
      },
      {
        name: 'delete_application_env',
        description: 'Delete an environment variable from an application. This permanently removes the environment variable.',
        inputSchema: {
          type: 'object',
          properties: {
            application_uuid: {
              type: 'string',
              description: 'UUID of the application containing the environment variable.',
            },
            env_uuid: {
              type: 'string',
              description: 'UUID of the environment variable to delete. Get this from list_application_envs.',
            },
          },
          required: ['application_uuid', 'env_uuid'],
        },
      },
      // Service Environment Variables
      {
        name: 'list_service_envs',
        description: 'List all environment variables for a specific service. Use this to view current environment configuration.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the service to list environment variables for. Get this from list_services.',
            },
          },
          required: ['uuid'],
        },
      },
      {
        name: 'create_service_env',
        description: 'Create a new environment variable for a service. This adds a new key-value pair to the service\'s environment. Note: Setting is_build_time=true has no functional effect on services (they use pre-built images).',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the service to add the environment variable to.',
            },
            key: {
              type: 'string',
              description: 'Environment variable name (e.g., "DATABASE_URL", "REDIS_HOST").',
            },
            value: {
              type: 'string',
              description: 'Environment variable value.',
            },
            is_build_time: {
              type: 'boolean',
              description: 'Whether this variable should be available during build time. Note: Has no functional effect on services (they use pre-built images).',
            },
            is_preview: {
              type: 'boolean',
              description: 'Whether this variable applies to preview deployments.',
            },
            is_literal: {
              type: 'boolean',
              description: 'Whether the value should be treated as a literal string without variable substitution.',
            },
          },
          required: ['uuid', 'key', 'value'],
        },
      },
      {
        name: 'update_service_env',
        description: 'Update an existing environment variable for a service. This modifies the value or settings of an existing environment variable. Note: Setting is_build_time=true has no functional effect on services (they use pre-built images).',
        inputSchema: {
          type: 'object',
          properties: {
            service_uuid: {
              type: 'string',
              description: 'UUID of the service containing the environment variable.',
            },
            key: {
              type: 'string',
              description: 'Environment variable name to update.',
            },
            value: {
              type: 'string',
              description: 'New environment variable value.',
            },
            is_build_time: {
              type: 'boolean',
              description: 'Whether this variable should be available during build time. Note: Has no functional effect on services (they use pre-built images).',
            },
            is_preview: {
              type: 'boolean',
              description: 'Whether this variable applies to preview deployments.',
            },
            is_literal: {
              type: 'boolean',
              description: 'Whether the value should be treated as a literal string without variable substitution.',
            },
          },
          required: ['service_uuid', 'key', 'value'],
        },
      },
      {
        name: 'bulk_update_service_envs',
        description: 'Update multiple environment variables for a service in a single operation. Efficient for updating many variables at once. Note: Setting is_build_time=true has no functional effect on services (they use pre-built images).',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'UUID of the service to update environment variables for.',
            },
            data: {
              type: 'array',
              description: 'Array of environment variables to update or create.',
              items: {
                type: 'object',
                properties: {
                  key: {
                    type: 'string',
                    description: 'Environment variable name.',
                  },
                  value: {
                    type: 'string',
                    description: 'Environment variable value.',
                  },
                  is_build_time: {
                    type: 'boolean',
                    description: 'Whether this variable should be available during build time. Note: Has no functional effect on services (they use pre-built images).',
                  },
                  is_preview: {
                    type: 'boolean',
                    description: 'Whether this variable applies to preview deployments.',
                  },
                  is_literal: {
                    type: 'boolean',
                    description: 'Whether the value should be treated as a literal string.',
                  },
                },
                required: ['key', 'value'],
              },
            },
          },
          required: ['uuid', 'data'],
        },
      },
      {
        name: 'delete_service_env',
        description: 'Delete an environment variable from a service. This permanently removes the environment variable.',
        inputSchema: {
          type: 'object',
          properties: {
            service_uuid: {
              type: 'string',
              description: 'UUID of the service containing the environment variable.',
            },
            env_uuid: {
              type: 'string',
              description: 'UUID of the environment variable to delete. Get this from list_service_envs.',
            },
          },
          required: ['service_uuid', 'env_uuid'],
        },
      },
    ];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new CoolifyMCPServer();
server.run().catch(() => {
  // Silently handle errors to avoid STDIO pollution
  process.exit(1);
});