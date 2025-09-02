# Coolify MCP Server Test Suite

This directory contains comprehensive tests for the Coolify MCP Server to ensure all endpoints work correctly and the server can handle real-world usage scenarios.

## Test Types

### 1. Basic Test Suite (`test-suite.ts`)
**Purpose**: Validates all MCP endpoints and basic functionality
- Tests all 20+ MCP tools/endpoints
- Validates request/response formats
- Tests error handling
- Checks tool schema compliance
- **Runtime**: ~30-60 seconds

**Run with**: `npm test`

### 2. Integration Tests (`integration-test.ts`)
**Purpose**: Tests real-world workflows and data consistency
- Tests data consistency across related endpoints
- Validates typical user workflows
- Tests error recovery scenarios
- Performance benchmarking
- **Runtime**: ~60-120 seconds

**Run with**: `npm run test:integration`

### 3. Load Tests (`load-test.ts`)
**Purpose**: Tests server stability under concurrent load
- Tests concurrent client connections
- Measures throughput and response times
- Tests for memory leaks
- Stress tests with multiple simultaneous requests
- **Runtime**: ~2-3 minutes

**Run with**: `npm run test:load`

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- A running Coolify instance with API access
- Valid Coolify API token

### 2. Configuration
1. Copy the example environment file:
   ```bash
   cp test-config.example.env .env
   ```

2. Edit `.env` with your Coolify instance details:
   ```env
   COOLIFY_BASE_URL=https://your-coolify-instance.com
   COOLIFY_API_TOKEN=your_actual_api_token
   COOLIFY_TIMEOUT=30000
   ```

3. Get your API token from:
   - Coolify Dashboard → Settings → API
   - Create a new token with appropriate permissions

### 3. Install Dependencies
```bash
npm install
```

## Running Tests

### Quick Start (All Tests)
```bash
npm run test:all
```

### Individual Test Suites
```bash
# Basic endpoint tests
npm test

# Integration tests
npm run test:integration

# Load tests
npm run test:load
```

## Test Results Interpretation

### Success Indicators ✅
- **Basic Tests**: All endpoint calls succeed and return expected data formats
- **Integration Tests**: Data consistency verified, workflows complete successfully
- **Load Tests**: >90% success rate, reasonable response times (<2s average)

### Warning Signs ⚠️
- **High Response Times**: Average >1s indicates potential performance issues
- **Low Success Rates**: <95% suggests API connectivity or authentication problems
- **Frequent Timeouts**: May indicate server overload or network issues

### Common Issues and Solutions

#### Authentication Errors
```
Error: Coolify API Error: Unauthorized
```
**Solution**: Check your `COOLIFY_API_TOKEN` in `.env`

#### Connection Errors
```
Error: Network Error: connect ECONNREFUSED
```
**Solution**: Verify `COOLIFY_BASE_URL` and ensure Coolify is accessible

#### Timeout Errors
```
Error: timeout of 30000ms exceeded
```
**Solution**: Increase `COOLIFY_TIMEOUT` or check server performance

## Test Coverage

### Endpoints Tested
- ✅ `get_version` - Version information
- ✅ `health_check` - API health status (optional)
- ✅ `list_teams` - Team listing
- ✅ `get_team` - Specific team details
- ✅ `get_current_team` - Current team info
- ✅ `get_current_team_members` - Team members
- ✅ `list_servers` - Server listing
- ✅ `create_server` - Server creation (integration test)
- ✅ `validate_server` - Server validation
- ✅ `get_server_resources` - Server resources
- ✅ `get_server_domains` - Server domains
- ✅ `list_services` - Service listing
- ✅ `create_service` - Service creation (integration test)
- ✅ `start_service` - Service start
- ✅ `stop_service` - Service stop
- ✅ `restart_service` - Service restart
- ✅ `list_applications` - Application listing
- ✅ `create_application` - Application creation (integration test)
- ✅ `start_application` - Application start
- ✅ `stop_application` - Application stop
- ✅ `restart_application` - Application restart
- ✅ `list_deployments` - Deployment listing
- ✅ `get_deployment` - Specific deployment
- ✅ `list_private_keys` - Private key listing
- ✅ `create_private_key` - Private key creation (integration test)

### Testing Scenarios
- 🔍 **Error Handling**: Invalid UUIDs, missing parameters, network issues
- 🔄 **Data Consistency**: Related endpoint data integrity
- 🚀 **Performance**: Response times and throughput
- 🔒 **Security**: Authentication and authorization
- 📊 **Load Testing**: Concurrent requests and stability
- 🧠 **Memory**: Leak detection and resource usage

## Continuous Integration

### GitHub Actions Example
```yaml
name: MCP Server Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
        env:
          COOLIFY_BASE_URL: ${{ secrets.COOLIFY_BASE_URL }}
          COOLIFY_API_TOKEN: ${{ secrets.COOLIFY_API_TOKEN }}
```

## Development and Debugging

### Debug Mode
Set environment variable for verbose output:
```bash
DEBUG=coolify-mcp npm test
```

### Test Development
When adding new tests:
1. Add test methods to appropriate test class
2. Update the test arrays in `run*Tests()` methods
3. Follow the existing error handling patterns
4. Add appropriate console logging for debugging

### Custom Test Configuration
Modify test parameters at the top of each test file:
- `maxConcurrentClients` in load-test.ts
- `testDurationSeconds` in load-test.ts
- Add new test scenarios in integration-test.ts

## Troubleshooting

### Test Failures
1. Check Coolify instance is running and accessible
2. Verify API token has necessary permissions
3. Confirm network connectivity
4. Review Coolify version compatibility

### Performance Issues
1. Monitor Coolify server resources during tests
2. Adjust timeout values for slower instances
3. Reduce concurrent clients in load tests
4. Check network latency to Coolify instance

### Getting Help
- Check Coolify documentation: https://coolify.io/docs
- Review MCP SDK documentation
- Check server logs during test failures
- Verify API endpoint availability in your Coolify version

---

**Note**: Some endpoints like `health_check` may not be available in all Coolify versions. Tests are designed to gracefully handle these scenarios.