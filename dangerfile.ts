import { danger, markdown, warn } from 'danger';

// ENFORCE LOCKFILE UP TO DATE
const packagesChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml'].some((file) => danger.git.modified_files.includes(file));

if (packagesChanged && !lockfileChanged) {
  const message = 'Changes were made to package.json, but not to pnpm-lock.yml';
  const idea = 'Perhaps you need to run `pnpm install`?';
  warn(`${message} - <i>${idea}</i>`);
}

// ENCURAGE SMALLER MRs
var bigPRThreshold = 50;
if (danger.gitlab.mr.changes_count.length > bigPRThreshold) {
  warn(':exclamation: Big PR (' + danger.gitlab.mr.changes_count.length + ')');
  markdown(
    '> (' +
      danger.gitlab.mr.changes_count.length +
      ') : Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.'
  );
}

if (!danger.gitlab.mr.assignee) {
  const method = danger.gitlab.mr.title.includes('WIP') ? warn : fail;
  method('This pull request needs an assignee, and optionally include any reviewers.');
}

if (danger.gitlab.mr.description.length < 10) {
  fail('This pull request needs a description.');
}
