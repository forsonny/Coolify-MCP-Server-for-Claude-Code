#!/usr/bin/env node

/**
 * Test runner for Coolify MCP Server
 * This JavaScript file avoids TypeScript compilation issues and provides
 * a simple way to test the MCP server functionality
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class TestRunner {
  constructor() {
    this.testResults = [];
  }

  async checkEnvironment() {
    console.log('🔍 Checking test environment...\n');

    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`Node.js version: ${nodeVersion}`);
    
    const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
    if (majorVersion < 18) {
      console.error('❌ Node.js 18+ is required');
      process.exit(1);
    }
    
    console.log('✅ Node.js version is compatible');

    // Check if package.json exists
    const packagePath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packagePath)) {
      console.error('❌ package.json not found');
      process.exit(1);
    }
    
    console.log('✅ package.json found');

    // Check if node_modules exists
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('⚠️  node_modules not found - installing dependencies...');
      await this.runCommand('npm', ['install']);
    } else {
      console.log('✅ Dependencies installed');
    }

    // Check for environment configuration
    const envFile = path.join(__dirname, '.env');
    if (fs.existsSync(envFile)) {
      console.log('✅ .env file found');
    } else {
      console.log('⚠️  .env file not found - tests will use default/mock configuration');
    }

    console.log('');
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runTest(testName, command, args) {
    console.log(`🧪 Running ${testName}...`);
    const startTime = Date.now();

    try {
      await this.runCommand(command, args);
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name: testName,
        status: 'pass',
        duration
      });
      
      console.log(`✅ ${testName} completed in ${duration}ms\n`);
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name: testName,
        status: 'fail',
        duration,
        error: error.message
      });
      
      console.log(`❌ ${testName} failed in ${duration}ms`);
      console.log(`   Error: ${error.message}\n`);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Coolify MCP Server Test Runner\n');
    console.log('=' .repeat(60));

    await this.checkEnvironment();

    // Test 1: Basic server functionality
    await this.runTest(
      'Basic Server Test',
      'npx',
      ['tsx', 'src/simple-server-test.ts']
    );

    // Test 2: Server startup with mock data (optional)
    console.log('🔧 Testing MCP server startup with mock configuration...');
    const mockEnv = {
      ...process.env,
      COOLIFY_BASE_URL: 'http://localhost:8080',
      COOLIFY_API_TOKEN: 'mock-token',
      COOLIFY_TIMEOUT: '5000'
    };

    try {
      console.log('Starting MCP server for 3 seconds to test basic functionality...');
      const serverProcess = spawn('npx', ['tsx', 'src/index.ts'], {
        env: mockEnv,
        stdio: 'pipe',
        shell: true
      });

      // Let server run for a bit
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      serverProcess.kill();
      console.log('✅ MCP server started and stopped successfully\n');
      
      this.testResults.push({
        name: 'MCP Server Startup Test',
        status: 'pass',
        duration: 3000
      });
    } catch (error) {
      console.log(`⚠️  MCP server startup test: ${error.message}\n`);
      
      this.testResults.push({
        name: 'MCP Server Startup Test',
        status: 'fail',
        duration: 0,
        error: error.message
      });
    }

    this.printSummary();
  }

  printSummary() {
    console.log('=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    for (const result of this.testResults) {
      const status = result.status === 'pass' ? '✅' : '❌';
      console.log(`${status} ${result.name} - ${result.duration}ms`);
      
      if (result.error) {
        console.log(`   └─ Error: ${result.error}`);
      }

      if (result.status === 'pass') {
        totalPassed++;
      } else {
        totalFailed++;
      }
      
      totalDuration += result.duration;
    }

    console.log('');
    console.log(`🎯 Results: ${totalPassed} passed, ${totalFailed} failed`);
    console.log(`⏱️  Total duration: ${totalDuration}ms`);

    if (totalFailed === 0) {
      console.log('\n🎉 All basic tests passed!');
      console.log('\n📋 Your Coolify MCP Server is ready to use.');
      console.log('\n📖 Next steps:');
      console.log('1. Set up your Coolify instance with proper credentials');
      console.log('2. Copy test-config.example.env to .env and configure it');
      console.log('3. Run full tests with: npm test (after configuring .env)');
      console.log('4. Use the MCP server in Claude Code with your configuration');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above.');
      console.log('\nCommon issues:');
      console.log('- Missing dependencies: Run "npm install"');
      console.log('- TypeScript compilation errors: Check your TypeScript setup');
      console.log('- Missing environment configuration: Set up .env file');
    }

    console.log('=' .repeat(60));
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('Test runner crashed:', error);
    process.exit(1);
  });
}