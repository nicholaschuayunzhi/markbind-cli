const fs = require('fs');
const walkSync = require('walk-sync');
const path = require('path');
const diffHtml = require('./diffHtml');

const expectedPaths = walkSync('../expected', { directories: false });
const actualPaths = walkSync('../_site', { directories: false });

if (expectedPaths.length !== actualPaths.length) {
  throw new Error('Unequal number of files');
}

for (let i = 0; i < expectedPaths.length; i += 1) {
  const expectedFilePath = expectedPaths[i];
  const actualFilePath = actualPaths[i];

  if (expectedFilePath !== actualFilePath) {
    throw new Error('Different files built');
  }

  // check contents
  const resolvedExpectedFilePath = path.resolve('../expected', expectedFilePath);
  const resolvedActualFilePath = path.resolve('../_site', actualFilePath);
  const expected = fs.readFileSync(resolvedExpectedFilePath, 'utf8');
  const actual = fs.readFileSync(resolvedActualFilePath, 'utf8');
  if (path.parse(resolvedActualFilePath).ext !== '.html') {
    if (expected !== actual) {
      throw Error(`${resolvedExpectedFilePath} and ${resolvedActualFilePath} are not equal`);
    }
  } else {
    diffHtml(expected, actual);
  }
}

