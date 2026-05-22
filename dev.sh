#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Book My Squad Development Environment${NC}"
echo ""

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
docker ps | grep postgres-bms > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}PostgreSQL not found. Starting Docker container...${NC}"
  docker run -d --name postgres-bms -e POSTGRES_PASSWORD=password -e POSTGRES_DB=bookmysquad -p 5432:5432 postgres:latest > /dev/null 2>&1
  sleep 3
  echo -e "${GREEN}✓ PostgreSQL started${NC}"
else
  echo -e "${GREEN}✓ PostgreSQL is running${NC}"
fi

echo ""
echo -e "${YELLOW}Starting servers...${NC}"
echo ""

# Start backend and frontend in parallel
export PORT=8080
export DATABASE_URL="postgresql://postgres:password@localhost:5432/bookmysquad"
export SESSION_SECRET="dev-secret-key"
export OPENAI_API_KEY="sk-test"
export BASE_PATH="/"

(
  echo -e "${GREEN}[Backend]${NC} Starting on port 8080..."
  cd /workspaces/BookMySquadin/artifacts/api-server
  pnpm run dev
) &
BACKEND_PID=$!

sleep 3

(
  echo -e "${GREEN}[Frontend]${NC} Starting on port 5173..."
  cd /workspaces/BookMySquadin/artifacts/wedding-platform
  PORT=5173 pnpm run dev
) &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✓ Both servers are running!${NC}"
echo ""
echo -e "${YELLOW}📱 Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}🔌 Backend:  http://localhost:8080${NC}"
echo ""
echo -e "${YELLOW}Login credentials (password: Infinity@123):${NC}"
echo -e "  • Admin:    bookmysquad0@gmail.com"
echo -e "  • Vendor:   vendor@bookmysquad.in"
echo -e "  • Customer: customer@bookmysquad.in"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
