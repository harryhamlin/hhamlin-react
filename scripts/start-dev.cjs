const { spawn } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const processes = [
  spawn(process.execPath, ['server/index.mjs'], { cwd: root, stdio: 'inherit' }),
  spawn(process.execPath, [require.resolve('react-scripts/bin/react-scripts.js'), 'start'], {
    cwd: root, stdio: 'inherit', env: process.env,
  }),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  processes.forEach((child) => child.kill('SIGTERM'));
  process.exitCode = code;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
processes.forEach((child) => {
  child.on('error', () => { console.error('Could not start the local app.'); stop(1); });
  child.on('exit', (code) => { if (!stopping) stop(code || 0); });
});
