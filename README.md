# Coolify MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with Coolify, the open-source deployment platform. This server enables Claude Code to interact with your Coolify instance through a comprehensive set of API endpoints.

## Features

- **Complete Coolify API Coverage**: Access all major Coolify API endpoints
- **Team Management**: List teams, get team details, and manage team members
- **Server Management**: Create, validate, and manage servers
- **Application Deployment**: Create, start, stop, and restart applications
- **Service Management**: Manage containerized services
- **Deployment Tracking**: Monitor deployment history and status
- **Private Key Management**: Manage SSH keys for server authentication
- **Real-time Monitoring**: Get server resources and domain configurations

## Prerequisites

- Node.js 18.0.0 or higher
- A running Coolify instance
- Coolify API token (generated from Keys & Tokens in Coolify UI)

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Required: Your Coolify instance base URL (without /api)
COOLIFY_BASE_URL=http://your-coolify-instance:8000

# Required: Your Coolify API token 
COOLIFY_API_TOKEN=your-api-token-here

# Optional: Request timeout in milliseconds (default: 30000)
COOLIFY_TIMEOUT=30000
```

### Claude Code Configuration

Add the following to your Claude Code configuration:

```bash
claude config mcp add coolify node /absolute/path/to/coolify-mcp-server/dist/index.js
```

Or manually add to your MCP configuration file:

```json
{
  "mcp": {
    "servers": {
      "coolify": {
        "command": "node",
        "args": ["/absolute/path/to/coolify-mcp-server/dist/index.js"],
        "env": {
          "COOLIFY_BASE_URL": "http://your-coolify-instance:8000",
          "COOLIFY_API_TOKEN": "your-api-token-here",
          "COOLIFY_TIMEOUT": "30000"
        }
      }
    }
  }
}
```

## Getting Your Coolify API Token

1. Open your Coolify instance web interface
2. Navigate to **Keys & Tokens** > **API tokens**
3. Click **Create New Token**
4. Give your token a descriptive name
5. Copy the generated token (you'll only see it once!)
6. Use this token as your `COOLIFY_API_TOKEN`

## Available Tools

### System Information
- `get_version` - Get Coolify version information
- `health_check` - Check API health status

### Team Management
- `list_teams` - List all accessible teams
- `get_team` - Get specific team details
- `get_current_team` - Get current team information
- `get_current_team_members` - List current team members

### Server Management
- `list_servers` - List all servers
- `create_server` - Create a new server
- `validate_server` - Validate server configuration
- `get_server_resources` - Get applications/services on a server
- `get_server_domains` - Get domains configured for a server

### Application Management
- `list_applications` - List all applications
- `create_application` - Create a new application
- `start_application` - Start an application
- `stop_application` - Stop an application
- `restart_application` - Restart an application
- `execute_command_application` - Execute commands in application container

### Service Management
- `list_services` - List all services
- `create_service` - Create a new service
- `start_service` - Start a service
- `stop_service` - Stop a service
- `restart_service` - Restart a service

### Deployment Management
- `list_deployments` - List all deployments
- `get_deployment` - Get specific deployment details

### SSH Key Management
- `list_private_keys` - List stored private keys
- `create_private_key` - Add a new private key

## Usage Examples

Once configured with Claude Code, you can use natural language commands like:

- "List all my Coolify applications"
- "Show me the status of server xyz-123"
- "Create a new application from my GitHub repository"
- "Restart the backend service"
- "Get the deployment history for my app"

## Development

### Run in Development Mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Clean Build Directory
```bash
npm run clean
```

## API Endpoints Mapping

This MCP server maps to the following Coolify API endpoints:

| MCP Tool | Coolify Endpoint | Description |
|----------|------------------|-------------|
| `get_version` | `GET /api/v1/version` | Get version info |
| `health_check` | `GET /api/health` | Health check |
| `list_teams` | `GET /api/v1/teams` | List teams |
| `list_servers` | `GET /api/v1/servers` | List servers |
| `create_server` | `POST /api/v1/servers` | Create server |
| `list_applications` | `GET /api/v1/applications` | List applications |
| `create_application` | `POST /api/v1/applications` | Create application |
| `start_application` | `POST /api/v1/applications/{uuid}/start` | Start application |
| `list_services` | `GET /api/v1/services` | List services |
| `list_deployments` | `GET /api/v1/deployments` | List deployments |
| `list_private_keys` | `GET /api/v1/private-keys` | List SSH keys |

## Error Handling

The server includes comprehensive error handling:
- **Authentication Errors**: Invalid or missing API tokens
- **Network Errors**: Connection timeouts or unreachable Coolify instance
- **API Errors**: Invalid parameters or server-side errors
- **Validation Errors**: Invalid input parameters

## Security Notes

- **Never commit your API token** to version control
- Store your `.env` file securely
- Use environment-specific API tokens
- Regularly rotate your API tokens
- Ensure your Coolify instance is properly secured

## Troubleshooting

### Server Won't Start
- Verify Node.js version (18.0.0+)
- Check that all dependencies are installed
- Ensure the build completed successfully

### API Calls Failing
- Verify your Coolify instance is running and accessible
- Check your API token is valid and not expired
- Ensure the base URL is correct (without `/api` suffix)
- Check network connectivity between Claude and your Coolify instance

### Tools Not Showing in Claude Code
- Restart Claude Code after configuration changes
- Verify the absolute path to the server script is correct
- Check the MCP server logs for error messages
- Verify MCP server is properly configured with `claude config mcp list`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues related to:
- **This MCP Server**: Open an issue in this repository
- **Coolify API**: Check the [Coolify documentation](https://coolify.io/docs/api-reference/api/)
- **MCP Protocol**: See the [Model Context Protocol documentation](https://modelcontextprotocol.io/)