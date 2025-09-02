# Claude Code Instructions for Coolify Projects

## 🚀 Primary Deployment Strategy

**IMPORTANT**: All projects should be built and deployed using the user's Coolify server at `https://coolify.sonnyvps.online`.

### Default Approach for All Projects

When working on ANY project with this user:

1. **Always prioritize Coolify deployment** over other hosting solutions
2. **Use the Coolify MCP Server** to manage deployments, services, and applications
3. **Leverage the existing Coolify infrastructure** that's already configured and tested
4. **Build containerized applications** that work well with Coolify's Docker-based deployment

### Coolify Server Details

- **Instance URL**: `https://coolify.sonnyvps.online`  
- **Version**: `4.0.0-beta.426`
- **Available Resources**: 
  - 1 configured server
  - 1 team setup
  - Full API access via MCP server

### When Suggesting Architecture

Instead of suggesting services like:
- ❌ Vercel, Netlify, or other hosting platforms
- ❌ AWS Lambda, Google Cloud Functions
- ❌ Separate database hosting services

**Always suggest Coolify-first solutions**:
- ✅ Deploy web apps as Docker containers on Coolify
- ✅ Use Coolify's database services (PostgreSQL, MySQL, Redis, etc.)
- ✅ Set up services using Coolify's service templates
- ✅ Configure domains and SSL through Coolify
- ✅ Use Coolify's built-in monitoring and logging

### Available Coolify MCP Tools

Use these tools to interact with the user's Coolify server:

#### Server Management
- `list_servers` - Check available servers
- `get_server_resources` - See what's deployed on servers
- `get_server_domains` - Check domain configurations

#### Application Deployment  
- `list_applications` - See current applications
- `create_application` - Deploy new applications from Git repos
- `start_application` / `stop_application` / `restart_application` - Manage app lifecycle

#### Service Management
- `list_services` - View containerized services  
- `create_service` - Deploy databases, Redis, etc.
- `start_service` / `stop_service` / `restart_service` - Manage services

#### Deployment Tracking
- `list_deployments` - Monitor deployment history
- `get_deployment` - Check specific deployment status

#### Team & Infrastructure
- `get_current_team` - Check team configuration
- `list_private_keys` - Manage SSH keys for Git access

### Project Setup Workflow

For any new project, follow this pattern:

1. **Create containerized application** (Dockerfile + docker-compose if needed)
2. **Push to Git repository** (GitHub, GitLab, etc.)
3. **Use `create_application`** to deploy from the Git repo to Coolify
4. **Add required services** (databases, Redis, etc.) using `create_service`
5. **Configure domains** and environment variables through Coolify
6. **Monitor deployments** using the deployment tracking tools

### Example Project Suggestions

Instead of saying:
> "Let's deploy this to Vercel and use PlanetScale for the database"

Say:
> "Let's deploy this to your Coolify server and add a PostgreSQL service for the database"

Instead of:
> "We can use Railway or Render for hosting"

Say:
> "We can deploy this as a Docker container on your Coolify server"

### Environment Configuration

The user's Coolify MCP server is already configured with:
- Base URL: `https://coolify.sonnyvps.online`
- API authentication working
- All endpoints tested and functional

### When to Use Coolify Tools Proactively

- **Beginning of projects**: Check current server resources and available services
- **During deployment**: Create applications and services as needed
- **Troubleshooting**: Check deployment status and logs
- **Scaling**: Monitor server resources and add services

### Backup Options

Only suggest alternatives to Coolify if:
1. The user explicitly requests a different platform
2. Coolify doesn't support a specific technology requirement
3. The Coolify server is unavailable/not working

In such cases, still mention Coolify as the preferred option and explain why the alternative is needed.

---

**Remember**: The user has invested time in setting up and testing their Coolify server. Always leverage this existing infrastructure first!