import { spawnSync } from 'node:child_process';
import { basename, dirname } from 'node:path';

export function lastCommitDate(filePath: string): Date | undefined {
  const { stdout } = spawnSync('git', ['log', '-1', '--format=%ct', '--', basename(filePath)], {
    cwd: dirname(filePath),
    encoding: 'utf-8',
  });
  const seconds = Number(stdout?.trim());
  return seconds ? new Date(seconds * 1000) : undefined;
}
