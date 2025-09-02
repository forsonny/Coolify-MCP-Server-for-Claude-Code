#!/usr/bin/env node

/**
 * Setup script for Coolify MCP Server
 * This script helps users configure the MCP server with proper environment variables
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

function main() {
  console.log('🚀 Coolify MCP Server Setup');
  console.log('================================\n');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const projectRoot = __dirname;
  const envPath = path.join(projectRoot, '.env');
  const distPath = path.join(projectRoot, 'dist', 'index.js');

  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found!');
    console.log('📝 Please create a .env file with your Coolify configuration:');
    console.log('');
    console.log('COOLIFY_BASE_URL=https://your-coolify-instance.com');
    console.log('COOLIFY_API_TOKEN=your-api-token-here');
    console.log('COOLIFY_TIMEOUT=30000');
    console.log('');
    console.log('You can copy .env.example if it exists, or create the file manually.');
    process.exit(1);
  }

  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.log('🔨 Building TypeScript project...');
    try {
      execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });
      console.log('✅ Build completed successfully');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  // Read and validate .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['COOLIFY_BASE_URL', 'COOLIFY_API_TOKEN'];
  const missingVars = [];

  for (const varName of requiredVars) {
    if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your-`) || envContent.includes(`${varName}=`)) {
      const line = envContent.split('\n').find(line => line.startsWith(`${varName}=`));
      if (!line || line.split('=')[1]?.trim() === '' || line.includes('your-')) {
        missingVars.push(varName);
      }
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Error: Missing or incomplete environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n📝 Please update your .env file with proper values.');
    process.exit(1);
  }

  console.log('✅ Environment variables configured');

  // Generate the MCP server configuration commands
  const serverCommand = `node ${distPath}`;
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key.trim() && value) {
        envVars[key.trim()] = value;
      }
    }
  });

  const mcpConfig = {
    type: 'stdio',
    command: 'node',
    args: [distPath],
    env: envVars
  };

  console.log('\n🔧 MCP Server Configuration');
  console.log('============================');
  console.log('\n1. Add the MCP server to Claude Code:');
  console.log(`\nclaude mcp add-json coolify '${JSON.stringify(mcpConfig)}' -s local\n`);

  console.log('2. Alternative: Add without explicit environment (relies on .env file):');
  console.log(`\nclaude mcp add coolify "${serverCommand}" -s local\n`);

  console.log('3. Verify the server is connected:');
  console.log('\nclaude mcp list\n');

  console.log('✅ Setup complete! Use the commands above to configure Claude Code.');
  console.log('');
  console.log('💡 Pro tip: The first command (add-json) is more reliable as it explicitly');
  console.log('   passes environment variables to the MCP server process.');
}

// ES module equivalent of require.main === module
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main();
}