const fs = require('fs');
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const shellDir = process.cwd();
const parentDir = path.resolve(shellDir, `../`);

async function runShellCommand(cmd) {
  const { stdout, stderr } = await exec(cmd);
  console.log(stdout);
  console.error(stderr);
}

const repositories = [
  'frontend-component-footer',
  'frontend-component-header',
  'frontend-app-account',
  'frontend-app-learning'
];

async function processRepository(repo) {
  console.log(`Processing: ${repo}`);
  const pathToRepo = path.resolve(shellDir, `../${repo}`);

  process.chdir(parentDir);
  await runShellCommand(`git clone https://github.com/hammerlabs-net/${repo}.git`);
  process.chdir(pathToRepo);
  await runShellCommand(`git checkout oep65 && npm install`);
  await runShellCommand(`npm install && npm run build`);
  process.chdir(shellDir);
}


const requiredNodeVersion = 'v18.16.1';

async function verifyNodeVersion() {
  const { stdout } = await exec('node -v');
  const version = stdout.trim();
  if (version !== requiredNodeVersion) {
    console.log(`Node.js version ${requiredNodeVersion} is required.`);
    console.log(`Your current Node.js version is ${version}.`);
    process.exit(1);
  } else {
    console.log(`Found Node.js version ${version}`)
  }
}

(async () => {
  await verifyNodeVersion();
  await runShellCommand(`npm install && npm run build`);
  for (const repo of repositories) {
    await processRepository(repo);
  }
})().catch(e => console.error(e));