import { existsSync, readFileSync, readdirSync, type Dirent } from 'node:fs';
import { join, relative } from 'node:path';

const MODULES_ROOT = join(__dirname, '../../modules');
const FORBIDDEN_IMPORTS = [
  /from ['"]@nestjs\//,
  /from ['"]@prisma\/client['"]/,
  /from ['"][^'"]*\/prisma\//,
  /from ['"][^'"]*\/dto\//,
  /from ['"][^'"]*\.(?:controller|module|service)['"]/,
];

function domainFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(
    (entry: Dirent) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return domainFiles(path);
      }
      return entry.isFile() &&
        entry.name.endsWith('.ts') &&
        !entry.name.endsWith('.spec.ts')
        ? [path]
        : [];
    },
  );
}

describe('domain dependency boundaries', () => {
  it('keeps module domain policies independent of framework and adapters', () => {
    const violations: string[] = [];

    for (const moduleEntry of readdirSync(MODULES_ROOT, {
      withFileTypes: true,
    })) {
      if (!moduleEntry.isDirectory()) {
        continue;
      }
      const domainDirectory = join(MODULES_ROOT, moduleEntry.name, 'domain');
      if (!existsSync(domainDirectory)) {
        continue;
      }

      for (const file of domainFiles(domainDirectory)) {
        const source = readFileSync(file, 'utf8');
        if (FORBIDDEN_IMPORTS.some((pattern) => pattern.test(source))) {
          violations.push(relative(MODULES_ROOT, file));
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
