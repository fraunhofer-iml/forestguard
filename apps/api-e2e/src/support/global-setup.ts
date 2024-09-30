/* eslint-disable */
import { execSync } from 'child_process';

var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...');

  console.log(' -> database schema without data\n');
  execSync('npx prisma db push --force-reset --schema=../../prisma/schema.prisma');

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
