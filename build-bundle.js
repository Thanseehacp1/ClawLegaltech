const {execSync} = require('child_process');
const path = require('path');

try {
  console.log('Building React Native bundle...');

  const command = `node node_modules/react-native/cli.js bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res --reset-cache`;

  execSync(command, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {...process.env, CI: 'true'},
  });

  console.log('Bundle created successfully!');
  process.exit(0);
} catch (error) {
  console.error('Failed to create bundle:', error.message);
  process.exit(1);
}
