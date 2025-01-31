import { danger, markdown, warn } from 'danger';

// ENFORCE LOCKFILE UP TO DATE
const packagesChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = ['package-lock.json'].some((file) => danger.git.modified_files.includes(file));

if (packagesChanged && !lockfileChanged) {
  const message = 'Changes were made to package.json, but not to package-lock.json';
  const idea = 'Perhaps you need to run `npm install`?';
  warn(`${message} - <i>${idea}</i>`);
}

// ENCOURAGE SMALLER MRs
var bigPRThreshold = 50;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR (' + (danger.github.pr.additions + danger.github.pr.deletions) + ' changes)');
  markdown(
    '> (' +
      (danger.github.pr.additions + danger.github.pr.deletions) +
      ') : Pull request size seems relatively large. If the pull request contains multiple changes, splitting each into separate PRs will help with faster, easier review.'
  );
}

if (!danger.github.pr.assignee) {
  const method = danger.github.pr.title.includes('WIP') ? warn : fail;
  method('This pull request needs an assignee, and optionally include any reviewers.');
}

if (danger.github.pr.body.length < 10) {
  fail('This pull request needs a description.');
}

if (danger.github.pr.body.match(/(Resolves) \D+-\d+/)) {
  fail('Pull request description should not only contain Resolves/Related to Issue');
}
