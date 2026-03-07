import type { Reporter, File, Task } from 'vitest/node'

function collectFailures(tasks: Task[], fileName: string, failures: string[]) {
  for (const task of tasks) {
    if (task.type === 'suite' && task.tasks) {
      collectFailures(task.tasks, fileName, failures)
    } else if (task.result?.state === 'fail') {
      failures.push(`${fileName} > ${task.name}`)
    }
  }
}

export default class MinimalReporter implements Reporter {
  private passedFiles: string[] = []
  private failedTests: string[] = []

  onFinished(files: File[]) {
    for (const file of files) {
      const fileName = file.name.split('/').pop() ?? file.name
      const failures: string[] = []

      collectFailures(file.tasks, fileName, failures)

      if (failures.length > 0) {
        this.failedTests.push(...failures)
      } else if (file.tasks.some(t => t.result?.state === 'pass')) {
        this.passedFiles.push(fileName)
      }
    }

    if (this.failedTests.length > 0) {
      console.log(`\n❌ ${this.failedTests.length} test(s) failed:`)
      this.failedTests.forEach(t => console.log(`   • ${t}`))
    } else {
      console.log(`\n✅ ${this.passedFiles.length} passed — ${this.passedFiles.join(', ')}`)
    }
  }
}