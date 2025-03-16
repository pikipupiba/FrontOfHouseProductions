# Node.js 20.x Installation Instructions for Windows

Follow these steps to install the latest LTS version of Node.js:

## Option 1: Direct Installation (Recommended)

1. **Download the Node.js 20.x LTS Installer**:
   - Visit [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
   - Click on the "Windows Installer" button under the LTS version (20.11.1 or newer)
   - Save the .msi file to your computer

2. **Run the Installer**:
   - Double-click the downloaded .msi file
   - Follow the installation wizard
   - Use the default settings and installation location
   - Complete the installation

3. **Verify Installation**:
   - Open a new Command Prompt or PowerShell window
   - Run: `node -v` (should show v20.x.x)
   - Run: `npm -v` (should show the npm version that comes with Node.js 20)

## Option 2: Using NVM for Windows (For Advanced Users)

If you prefer to manage multiple Node.js versions, consider NVM for Windows:

1. **Download NVM for Windows**:
   - Visit [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
   - Download the latest `nvm-setup.exe` file

2. **Install NVM for Windows**:
   - Run the downloaded installer
   - Follow the installation prompts
   - Use default settings

3. **Install Node.js 20.x**:
   - Open a new Command Prompt or PowerShell as Administrator
   - Run: `nvm install 20.11.1`
   - Run: `nvm use 20.11.1`

4. **Verify Installation**:
   - Run: `node -v` (should show v20.11.1)
   - Run: `nvm list` (should show all installed versions)

## After Installation

Once Node.js 20.x is installed, you're ready to continue with updating the project:

1. Navigate to your project directory:
   ```
   cd C:\Users\pikipupiba\Documents\GitHub\front-of-house-productions\frontend
   ```

2. Install the updated dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

This will start the Next.js development server using the new Node.js version and updated dependencies.
