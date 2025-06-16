#!/usr/bin/env node

/**
 * Permission checker script for KeySpy
 * This script checks if the necessary permissions are granted before running tests
 */

const { checkPermissions, getPermissionInstructions } = require('../dist/utils/permissions');
const os = require('os');

async function main() {
  console.log('🔍 Checking KeySpy permissions...\n');
  
  const platform = os.platform();
  console.log(`Platform: ${platform}`);
  
  try {
    const hasPermissions = await checkPermissions();
    
    if (hasPermissions) {
      console.log('✅ Permissions are granted!');
      console.log('You can run integration tests safely.\n');
      process.exit(0);
    } else {
      console.log('❌ Permissions are not granted.');
      console.log('Integration tests may fail or prompt for permissions.\n');
      console.log(getPermissionInstructions());
      console.log('\n💡 Tips:');
      console.log('- Run this script again after granting permissions');
      console.log('- Set SKIP_INTEGRATION_TESTS=true to skip integration tests');
      console.log('- Use npm run test:unit to run only unit tests\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error checking permissions:', error.message);
    console.log('\n💡 You can still try running tests, but they may fail.');
    console.log('Set SKIP_INTEGRATION_TESTS=true to skip integration tests.\n');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
