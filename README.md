# Coolify MCP Server

A Model Context Protocol (MCP) server that integrates with [Coolify](https://coolify.io/) to let AI assistants manage your Coolify instance via a clean toolkit that wraps the official REST API.

---

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)

  * [Environment Setup](#environment-setup)
  * [Claude Code Setup](#claude-code-setup)
  * [Cursor Setup](#cursor-setup)
* [API Token Generation](#api-token-generation)
* [Available Tools](#available-tools)
* [Usage Examples](#usage-examples)
* [Development](#development)
* [API Reference](#api-reference)
* [Troubleshooting](#troubleshooting)
* [Security](#security)
* [Contributing](#contributing)
* [License](#license)
* [Support](#support)

---

## Features

### Core Capabilities

* **Coverage of key Coolify API endpoints** (applications, services, deployments, teams, private keys, domains, health/version)
* **Team Management** – List teams, get team details, and view members
* **Server & Domain Insights** – Query domains configured per server
* **Application Lifecycle** – Start/stop/restart and create applications
* **Service Management** – List/create/start/stop/restart services
* **Deployments** – List running deployments; fetch deployment by UUID
* **Private Keys** – List and create SSH private keys for server auth
* **Env Vars** – CRUD for application/service environment variables

> Note: Some aggregated operations (e.g., “resources by server”) are implemented by client-side filtering over the supported endpoints rather than a dedicated API path.

---

## Prerequisites

* **Node.js** v18 or newer
* **npm** or **yarn**
* A running **Coolify** instance (self‑hosted or cloud)
* A **Coolify API token** with appropriate permissions

---

## Installation

### 1) Clone & install

```bash
git clone https://github.com/forsonny/Coolify-MCP-Server-for-Claude-Code.git
cd Coolify-MCP-Server-for-Claude-Code
npm install
```

### 2) Build

```bash
npm run build
```

(Compiles TypeScript into `dist/`)

---

## Configuration

### Environment Setup

Create a `.env` file at the project root:

```dotenv
# Required
COOLIFY_BASE_URL=https://your-coolify-instance.com
COOLIFY_API_TOKEN=your-api-token-here

# Optional
COOLIFY_TIMEOUT=30000
```

**Notes**

* Use a **full base URL** (no trailing slash). Example: `https://coolify.example.com`
* Do **not** use inline comments in `.env` values.
* Never commit `.env` to version control.

### Claude Code Setup

You can connect the server to **Claude Code** either via the CLI wizard or by importing from Claude Desktop.

**Option A — CLI wizard**

```bash
# Add this local MCP server to the current project
claude mcp add coolify node /absolute/path/to/Coolify-MCP-Server-for-Claude-Code/dist/index.js

# Verify
claude mcp list
```

**Option B — Import from Claude Desktop**
If you already have the server configured in Claude Desktop:

```bash
claude mcp add-from-claude-desktop
claude mcp list
```

> Tip: Some setups store Claude Code MCP config in `~/.claude.json`. The Desktop app uses `claude_desktop_config.json` under your OS application data directory.

### Cursor Setup

**Cursor** supports MCP. The easiest route is through **Settings → Extensions → MCP Servers → Add Server**, then point to your built script (`node …/dist/index.js`) and add the three environment variables. Restart Cursor after saving.

For advanced/enterprise setups, see Cursor’s MCP docs on programmatic registration.

---

## API Token Generation

1. Open your Coolify dashboard.
2. Navigate to **Keys & Tokens → API tokens**.
3. Create a new token (name it e.g. “MCP Server”), select the permissions you need, and optionally set an expiration.
4. Copy the token **once** when shown and paste it into your `.env`.

---

## Available Tools

### System

| Tool           | What it does        |
| -------------- | ------------------- |
| `get_version`  | Get Coolify version |
| `health_check` | Healthcheck probe   |

### Teams

| Tool                       | What it does                 |
| -------------------------- | ---------------------------- |
| `list_teams`               | List all teams               |
| `get_team`                 | Get team by ID               |
| `get_current_team`         | Get current team             |
| `get_current_team_members` | List members of current team |

### Servers & Domains

| Tool                 | What it does                  |
| -------------------- | ----------------------------- |
| `get_server_domains` | Get domains for a server UUID |

### Applications

| Tool                  | What it does        |
| --------------------- | ------------------- |
| `list_applications`   | List applications   |
| `create_application`  | Create application  |
| `start_application`   | Start application   |
| `stop_application`    | Stop application    |
| `restart_application` | Restart application |

### Services

| Tool              | What it does    |
| ----------------- | --------------- |
| `list_services`   | List services   |
| `create_service`  | Create service  |
| `start_service`   | Start service   |
| `stop_service`    | Stop service    |
| `restart_service` | Restart service |

### Deployments & Keys

| Tool                 | What it does                 |
| -------------------- | ---------------------------- |
| `list_deployments`   | List running deployments     |
| `get_deployment`     | Get deployment by UUID       |
| `list_private_keys`  | List SSH private keys        |
| `create_private_key` | Create a new SSH private key |

### Environment Variables

Application and service env vars support: list, create, update (single/bulk), and delete.

---

## Usage Examples

Natural language you can try once connected:

**Basics**

```
"List my applications"
"Who’s in the current team?"
"What version is my Coolify instance?"
```

**Servers & Apps**

```
"Show domains for server 123e4567-e89b-12d3-a456-426614174000"
"Create a new app from https://github.com/user/repo"
"Restart the backend app"
```

**Services & Env Vars**

```
"List running services"
"Create a PostgreSQL service on the main server"
"Add DATABASE_URL to the frontend app"
```

---

## Development

**Dev mode (watch):**

```bash
npm run dev
```

**Build:**

```bash
npm run build
```

**Clean:**

```bash
npm run clean
```

**Project Structure**

```
Coolify-MCP-Server-for-Claude-Code/
├── src/
│   ├── index.ts           # MCP server entrypoint
│   ├── coolify-client.ts  # Coolify API client
│   └── types.ts           # Type definitions
├── dist/                  # Compiled JS (generated)
├── .env                   # Environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md              # This file
```

---

## API Reference

**Selected endpoint mapping used by this server**

| MCP Tool                   | Method | Path                           |
| -------------------------- | ------ | ------------------------------ |
| `get_version`              | GET    | `/version`                     |
| `health_check`             | GET    | `/health`                      |
| `list_teams`               | GET    | `/teams`                       |
| `get_team`                 | GET    | `/teams/{id}`                  |
| `get_current_team`         | GET    | `/teams/current`               |
| `get_current_team_members` | GET    | `/teams/current/members`       |
| `list_applications`        | GET    | `/applications`                |
| `create_application`       | POST   | `/applications`                |
| `start_application`        | POST   | `/applications/{uuid}/start`   |
| `stop_application`         | POST   | `/applications/{uuid}/stop`    |
| `restart_application`      | POST   | `/applications/{uuid}/restart` |
| `list_services`            | GET    | `/services`                    |
| `create_service`           | POST   | `/services`                    |
| `list_deployments`         | GET    | `/deployments`                 |
| `get_deployment`           | GET    | `/deployments/{uuid}`          |
| `list_private_keys`        | GET    | `/security/keys`               |
| `create_private_key`       | POST   | `/security/keys`               |
| `get_server_domains`       | GET    | `/servers/{uuid}/domains`      |

> Endpoint paths follow the official Coolify API and **do not** use a `/api/v1` prefix.

**Environment variable flags**

| Flag            | Meaning                             | Apps | Services |
| --------------- | ----------------------------------- | ---- | -------- |
| `is_build_time` | Present at build time               | ✅    | —        |
| `is_preview`    | Applies to preview deployments only | ✅    | ✅        |
| `is_literal`    | Disable variable substitution       | ✅    | ✅        |

> Services are prebuilt images (no build phase), so `is_build_time` has no effect for services.

---

## Troubleshooting

**Server won’t start**

* Confirm Node ≥ 18: `node --version`
* Reinstall deps: `rm -rf node_modules && npm install`
* Rebuild: `npm run clean && npm run build`
* Confirm absolute paths in MCP config

**Auth errors (`401 Unauthorized`)**

* Verify token is valid and scoped to the correct team
* Recreate token if expired; paste into `.env`

**Connection issues (`ECONNREFUSED`/timeouts)**

* Check `COOLIFY_BASE_URL` (no trailing slash)
* Ensure the Coolify instance is reachable and healthy
* Increase `COOLIFY_TIMEOUT` for slow links

**Tools not appearing**

* Restart your client (Claude Code / Cursor)
* Verify with `claude mcp list`
* Check server logs in your terminal
* Ensure environment variables are set for the MCP process

**Debug mode**

```bash
DEBUG=coolify-mcp npm run dev
```

---

## Security

* Keep API tokens out of VCS; rotate regularly
* Use HTTPS; consider IP allowlists / VPN for private instances
* Add `.env` to `.gitignore`; restrict file permissions
* Use least-privilege tokens per environment; audit and revoke regularly

---

## Contributing

We welcome contributions!

1. **Fork** the repo and clone your fork

   ```bash
   git clone https://github.com/<your-username>/Coolify-MCP-Server-for-Claude-Code.git
   ```
2. **Create a branch**

   ```bash
   git checkout -b feat/your-feature
   ```
3. **Code & test** – follow existing style; add tests where useful
4. **Commit**

   ```bash
   git commit -m "feat: add <thing>"
   ```
5. **Push & open PR**

   ```bash
   git push origin feat/your-feature
   ```

Guidelines

* TypeScript best practices; backward compat where feasible
* Clear commit messages and error handling
* Update README when adding features

---

## License

MIT — see [LICENSE](LICENSE).

---

## Support

**Issues** – open on GitHub

**Docs**

* Coolify API Reference
* MCP Quickstarts & SDKs
* Claude Code MCP docs
* Cursor MCP docs

**Version:** 1.0.0
**Maintainer:** [@forsonny](https://github.com/forsonny)
