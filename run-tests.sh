#!/bin/bash

# Script to run Playwright tests with Bun while handling permission issues

# First, ensure we have a dev server running
echo "🚀 Starting dev server in the background..."
sudo -u admin bun run dev > dev-server.log 2>&1 &
DEV_SERVER_PID=$!

# Give the server a moment to start
echo "⏳ Waiting for dev server to initialize..."
sleep 5

# Ensure test directories have proper permissions
echo "🔑 Setting correct permissions on test directories..."
sudo mkdir -p test-results playwright-report
sudo chmod -R 777 test-results playwright-report

# Run the tests with Bun
echo "🧪 Running Playwright tests with Bun..."
bun exec playwright test
TEST_EXIT_CODE=$?

# Cleanup after tests
echo "🧹 Cleaning up..."
kill $DEV_SERVER_PID

# Return the test exit code
exit $TEST_EXIT_CODE
