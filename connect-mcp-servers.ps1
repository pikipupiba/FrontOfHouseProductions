# Connect-MCP-Servers.ps1
# This script manually starts all configured MCP servers for Cline

Write-Host "Starting MCP servers..." -ForegroundColor Cyan

# Supabase MCP Server
Write-Host "Starting Supabase MCP Server..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "C:\Users\pikipupiba\.local\bin\supabase-mcp-server.exe" -ArgumentList "" -ErrorAction SilentlyContinue

# Browser Tools MCP
Write-Host "Starting Browser Tools MCP..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "@agentdeskai/browser-tools-mcp@1.2.0" -ErrorAction SilentlyContinue

# Software Planning MCP
Write-Host "Starting Software Planning MCP..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "C:\Users\pikipupiba\Documents\Cline\MCP\Software-planning-mcp\build\index.js" -ErrorAction SilentlyContinue

# GitHub MCP Server
Write-Host "Starting GitHub MCP Server..." -ForegroundColor Green
$githubEnv = @{
    "GITHUB_PERSONAL_ACCESS_TOKEN" = "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E"
}
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "-y @modelcontextprotocol/server-github" -Environment $githubEnv -ErrorAction SilentlyContinue

# Filesystem MCP Server
Write-Host "Starting Filesystem MCP Server..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "-y @modelcontextprotocol/server-filesystem C:\Users\pikipupiba\Documents\GitHub\front-of-house-productions C:\Users\pikipupiba\Documents\Cline\MCP" -ErrorAction SilentlyContinue

Write-Host "`nAll MCP servers started." -ForegroundColor Cyan
Write-Host "Note: Some servers may take a moment to initialize." -ForegroundColor Yellow
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Reload VSCode window (Ctrl+Shift+P > 'Developer: Reload Window')" -ForegroundColor White
Write-Host "2. Start a new Cline conversation" -ForegroundColor White
