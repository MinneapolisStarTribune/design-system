/*
 * This is a custom reporter for Vitest that only shows the failed tests and the files that contain them.
 * It is used to report the results of the tests to the developer on commit.
 * Is this strictly necessary? No. But the default reporter is NOISY and annoying.
 */
import type { Reporter } from 'vitest/node';

type RunnerResult = {
  state?: string;
  errors?: unknown[];
};

type RunnerTask = {
  type: 'suite' | 'test' | 'custom';
  name: string;
  tasks?: RunnerTask[];
  result?: RunnerResult;
};

type RunnerFile = {
  name: string;
  tasks: RunnerTask[];
  result?: RunnerResult;
};

function toErrorText(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.stack || error.message;
  if (typeof error === 'object') {
    const maybe = error as { stack?: string; message?: string };
    return maybe.stack || maybe.message || '';
  }
  return String(error);
}

function firstNonEmptyLine(text: string): string {
  return (
    text
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean) || ''
  );
}

function collectFailures(tasks: RunnerTask[], fileName: string, failures: string[]) {
  for (const task of tasks) {
    if (task.type === 'suite' && task.tasks) {
      collectFailures(task.tasks, fileName, failures);
    } else if (task.result?.state === 'fail') {
      const firstError = task.result.errors?.[0];
      const errorText = firstNonEmptyLine(toErrorText(firstError));
      const message = errorText
        ? `${fileName} > ${task.name}\n      ↳ ${errorText}`
        : `${fileName} > ${task.name}`;
      failures.push(message);
    }
  }
}

export default class MinimalReporter implements Reporter {
  private passedFiles: string[] = [];
  private failedTests: string[] = [];

  onFinished(files: unknown[], _errors: unknown[] = [], _coverage?: unknown) {
    for (const file of files as RunnerFile[]) {
      const fileName = file.name.split('/').pop() ?? file.name;
      const failures: string[] = [];

      collectFailures(file.tasks, fileName, failures);

      // Handle setup/module-level failures that may not map to individual tasks.
      if (file.result?.state === 'fail' && failures.length === 0) {
        const firstError = file.result.errors?.[0];
        const errorText = firstNonEmptyLine(toErrorText(firstError));
        const message = errorText ? `${fileName}\n      ↳ ${errorText}` : fileName;
        failures.push(message);
      }

      if (failures.length > 0) {
        this.failedTests.push(...failures);
      } else if (file.tasks.some((t) => t.result?.state === 'pass')) {
        this.passedFiles.push(fileName);
      }
    }

    if (this.failedTests.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`\n❌ ${this.failedTests.length} test(s) failed:`);
      // eslint-disable-next-line no-console
      this.failedTests.forEach((t) => console.log(`   • ${t}`));
    } else {
      // eslint-disable-next-line no-console
      console.log(`\n✅ ${this.passedFiles.length} passed — ${this.passedFiles.join(', ')}`);
    }
  }
}
