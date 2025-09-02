# Coolify MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with Coolify, the open-source deployment platform. This server enables AI assistants to interact with your Coolify instance through a comprehensive set of API endpoints.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Setup](#environment-setup)
  - [Claude Code Setup](#claude-code-setup)
  - [Codex CLI Setup](#codex-cli-setup)
  - [Cursor Setup](#cursor-setup)
- [API Token Generation](#api-token-generation)
- [Available Tools](#available-tools)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Capabilities

- **Complete Coolify API Coverage** - Full access to all major Coolify API endpoints
- **Team Management** - List teams, get team details, and manage team members
- **Server Management** - Create, validate, and manage servers
- **Application Deployment** - Create, start, stop, and restart applications
- **Service Management** - Manage containerized services
- **Deployment Tracking** - Monitor deployment history and status
- **Private Key Management** - Manage SSH keys for server authentication
- **Environment Variables** - Full CRUD operations for application and service environment variables
- **Real-time Monitoring** - Get server resources and domain configurations

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- A running **Coolify instance** (self-hosted or cloud)
- **Coolify API token** with appropriate permissions

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/forsonny/Coolify-MCP-Server-for-Claude-Code.git
cd Coolify-MCP-Server-for-Claude-Code
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Project

```bash
npm run build
```

This will compile the TypeScript source code into the `dist/` directory.

## Configuration

### Environment Setup

Create a `.env` file in the project root directory:

```bash
# Required Configuration
COOLIFY_BASE_URL=https://your-coolify-instance.com
COOLIFY_API_TOKEN=your-api-token-here

# Optional Configuration
COOLIFY_TIMEOUT=30000  # Request timeout in milliseconds (default: 30000)
```

**Important:** Never commit your `.env` file to version control.

### Claude Code Setup

Claude Code is Anthropic's official CLI for Claude. To configure the Coolify MCP server with Claude Code:

#### Method 1: Using Claude CLI

```bash
claude config mcp add coolify node /absolute/path/to/coolify-mcp-server/dist/index.js
```

You'll be prompted to add environment variables. Enter:
- `COOLIFY_BASE_URL`: Your Coolify instance URL
- `COOLIFY_API_TOKEN`: Your API token
- `COOLIFY_TIMEOUT`: 30000 (optional)

#### Method 2: Manual Configuration

Edit your Claude configuration file directly:

**Windows:** `%LOCALAPPDATA%\Claude\claude_desktop_config.json`  
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

Add the following to the `mcp.servers` section:

```json
{
  "mcp": {
    "servers": {
      "coolify": {
        "command": "node",
        "args": ["C:/absolute/path/to/coolify-mcp-server/dist/index.js"],
        "env": {
          "COOLIFY_BASE_URL": "https://your-coolify-instance.com",
          "COOLIFY_API_TOKEN": "your-api-token-here",
          "COOLIFY_TIMEOUT": "30000"
        }
      }
    }
  }
}
```

#### Verification

After configuration, verify the server is properly loaded:

```bash
claude config mcp list
```

You should see `coolify` in the list of configured servers.

### Codex CLI Setup

Codex CLI is an alternative command-line interface for Claude. To configure with Codex:

#### Step 1: Install Codex CLI

```bash
npm install -g @anthropic/codex-cli
```

#### Step 2: Configure MCP Server

```bash
codex config add-server coolify
```

When prompted, provide:
- **Command:** `node`
- **Arguments:** `/absolute/path/to/coolify-mcp-server/dist/index.js`
- **Working Directory:** `/absolute/path/to/coolify-mcp-server`

#### Step 3: Set Environment Variables

```bash
codex config set-env coolify COOLIFY_BASE_URL "https://your-coolify-instance.com"
codex config set-env coolify COOLIFY_API_TOKEN "your-api-token-here"
codex config set-env coolify COOLIFY_TIMEOUT "30000"
```

#### Verification

```bash
codex config show
```

### Cursor Setup

Cursor is an AI-powered code editor with MCP support. To configure the Coolify MCP server with Cursor:

#### Step 1: Open Cursor Settings

1. Open Cursor
2. Navigate to **Settings** → **Extensions** → **MCP Servers**
3. Click **Add Server**

#### Step 2: Configure Server

Enter the following configuration:

```json
{
  "name": "coolify",
  "command": "node",
  "args": ["C:/absolute/path/to/coolify-mcp-server/dist/index.js"],
  "env": {
    "COOLIFY_BASE_URL": "https://your-coolify-instance.com",
    "COOLIFY_API_TOKEN": "your-api-token-here",
    "COOLIFY_TIMEOUT": "30000"
  },
  "enabled": true
}
```

#### Step 3: Restart Cursor

After adding the configuration, restart Cursor for the changes to take effect.

#### Verification

In Cursor's AI chat, type:
```
@coolify list applications
```

If configured correctly, the AI should be able to access your Coolify instance.

## API Token Generation

To generate a Coolify API token:

1. **Access Coolify Dashboard**
   - Navigate to your Coolify instance
   - Log in with your credentials

2. **Navigate to API Tokens**
   - Go to **Keys & Tokens** → **API tokens**
   - Click **Create New Token**

3. **Configure Token**
   - Provide a descriptive name (e.g., "MCP Server")
   - Select appropriate permissions
   - Set expiration (optional)

4. **Save Token**
   - Click **Generate**
   - **Important:** Copy the token immediately - it won't be shown again
   - Store it securely in your `.env` file

## Available Tools

### System Operations

| Tool | Description |
|------|-------------|
| `get_version` | Retrieve Coolify version information |
| `health_check` | Check API health status |

### Team Management

| Tool | Description |
|------|-------------|
| `list_teams` | List all accessible teams |
| `get_team` | Get specific team details |
| `get_current_team` | Get current team information |
| `get_current_team_members` | List current team members |

### Server Management

| Tool | Description |
|------|-------------|
| `list_servers` | List all servers |
| `create_server` | Create a new server |
| `validate_server` | Validate server configuration |
| `get_server_resources` | Get applications/services on a server |
| `get_server_domains` | Get domains configured for a server |

### Application Management

| Tool | Description |
|------|-------------|
| `list_applications` | List all applications |
| `create_application` | Create a new application |
| `start_application` | Start an application |
| `stop_application` | Stop an application |
| `restart_application` | Restart an application |

### Service Management

| Tool | Description |
|------|-------------|
| `list_services` | List all services |
| `create_service` | Create a new service |
| `start_service` | Start a service |
| `stop_service` | Stop a service |
| `restart_service` | Restart a service |

### Environment Variables

#### Application Environment Variables

| Tool | Description |
|------|-------------|
| `list_application_envs` | List environment variables |
| `create_application_env` | Create new environment variable |
| `update_application_env` | Update existing environment variable |
| `bulk_update_application_envs` | Update multiple variables at once |
| `delete_application_env` | Delete environment variable |

#### Service Environment Variables

| Tool | Description |
|------|-------------|
| `list_service_envs` | List environment variables |
| `create_service_env` | Create new environment variable |
| `update_service_env` | Update existing environment variable |
| `bulk_update_service_envs` | Update multiple variables at once |
| `delete_service_env` | Delete environment variable |

### Additional Operations

| Tool | Description |
|------|-------------|
| `list_deployments` | List all deployments |
| `get_deployment` | Get specific deployment details |
| `list_private_keys` | List stored SSH private keys |
| `create_private_key` | Add a new SSH private key |

## Usage Examples

Once configured, you can interact with your Coolify instance using natural language:

### Basic Operations

```
"List all my Coolify applications"
"Show me the current team members"
"Get the version of my Coolify instance"
```

### Server Management

```
"Create a new server with IP 192.168.1.100"
"Validate the configuration of server xyz-123"
"Show me all resources on the production server"
```

### Application Deployment

```
"Create a new application from github.com/user/repo"
"Restart the backend application"
"Stop the staging environment application"
```

### Service Management

```
"List all running services"
"Create a PostgreSQL service on the main server"
"Restart the Redis cache service"
```

### Environment Variables

```
"Add DATABASE_URL environment variable to my application"
"Update the API_KEY for the backend service"
"List all environment variables for the frontend application"
```

## Development

### Development Mode

Run the server in development mode with hot reloading:

```bash
npm run dev
```

### Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Cleaning

Remove build artifacts:

```bash
npm run clean
```

### Project Structure

```
coolify-mcp-server/
├── src/
│   ├── index.ts           # Main MCP server implementation
│   ├── coolify-client.ts  # Coolify API client
│   └── types.ts           # TypeScript type definitions
├── dist/                  # Compiled JavaScript (generated)
├── .env                   # Environment variables (create this)
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## API Reference

### Endpoint Mapping

The MCP server provides a clean interface to Coolify's REST API:

| MCP Tool | HTTP Method | Coolify Endpoint |
|----------|-------------|------------------|
| `get_version` | GET | `/api/v1/version` |
| `health_check` | GET | `/api/health` |
| `list_teams` | GET | `/api/v1/teams` |
| `get_team` | GET | `/api/v1/teams/{id}` |
| `list_servers` | GET | `/api/v1/servers` |
| `create_server` | POST | `/api/v1/servers` |
| `validate_server` | POST | `/api/v1/servers/{uuid}/validate` |
| `list_applications` | GET | `/api/v1/applications` |
| `create_application` | POST | `/api/v1/applications` |
| `start_application` | POST | `/api/v1/applications/{uuid}/start` |
| `list_services` | GET | `/api/v1/services` |
| `create_service` | POST | `/api/v1/services` |
| `list_deployments` | GET | `/api/v1/deployments` |
| `list_private_keys` | GET | `/api/v1/private-keys` |

### Environment Variable Flags

When managing environment variables, you can use the following flags:

| Flag | Description | Applications | Services |
|------|-------------|--------------|----------|
| `is_build_time` | Available during build | Yes | No effect |
| `is_preview` | Preview deployments only | Yes | Yes |
| `is_literal` | No variable substitution | Yes | Yes |

**Note:** Services use pre-built Docker images and don't have a build phase, so `is_build_time` has no effect on services.

## Troubleshooting

### Common Issues

#### Server Won't Start

**Symptoms:** MCP server fails to initialize

**Solutions:**
- Verify Node.js version: `node --version` (must be 18.0.0+)
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild the project: `npm run clean && npm run build`
- Check for port conflicts

#### Authentication Errors

**Symptoms:** `401 Unauthorized` responses

**Solutions:**
- Verify API token is correct and not expired
- Check token permissions in Coolify dashboard
- Ensure token is properly quoted in `.env` file
- Regenerate token if necessary

#### Connection Issues

**Symptoms:** `ECONNREFUSED` or timeout errors

**Solutions:**
- Verify `COOLIFY_BASE_URL` is correct (no trailing slash)
- Check network connectivity to Coolify instance
- Ensure Coolify instance is running
- Verify firewall rules allow connection
- Increase `COOLIFY_TIMEOUT` for slow connections

#### Tools Not Appearing

**Symptoms:** Coolify tools not available in AI assistant

**Solutions:**
- Restart your AI client after configuration
- Verify configuration with `claude config mcp list`
- Check MCP server logs for errors
- Ensure absolute paths are used in configuration
- Verify environment variables are set correctly

### Debug Mode

Enable detailed logging by setting the `DEBUG` environment variable:

```bash
DEBUG=coolify-mcp npm run dev
```

## Security

### Best Practices

1. **API Token Security**
   - Never commit API tokens to version control
   - Use environment variables for sensitive data
   - Rotate tokens regularly
   - Use tokens with minimal required permissions

2. **Network Security**
   - Always use HTTPS for production Coolify instances
   - Implement IP whitelisting where possible
   - Use VPN for accessing private Coolify instances

3. **File Security**
   - Add `.env` to `.gitignore`
   - Set appropriate file permissions (600) for `.env`
   - Don't log sensitive data

4. **Access Control**
   - Create separate API tokens for different environments
   - Regularly audit token usage
   - Revoke unused tokens immediately

## Contributing

We welcome contributions to improve the Coolify MCP Server.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/forsonny/Coolify-MCP-Server-for-Claude-Code.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: Add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Guidelines

- Follow TypeScript best practices
- Maintain backward compatibility
- Write clear commit messages
- Update README for new features
- Add error handling for new endpoints

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/forsonny/Coolify-MCP-Server-for-Claude-Code/issues)
- **Coolify Documentation:** [Official Coolify Docs](https://coolify.io/docs)
- **MCP Protocol:** [Model Context Protocol Documentation](https://modelcontextprotocol.io/)

### Useful Resources

- [Coolify API Reference](https://coolify.io/docs/api-reference/api/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Cursor MCP Guide](https://cursor.sh/docs/mcp)

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintainer:** [@forsonny](https://github.com/forsonny)