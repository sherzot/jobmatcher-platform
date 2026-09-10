import { randomBytes } from 'node:crypto';

const paddedCode = (prefix: string, id: number): string =>
  `${prefix}${String(id).padStart(7, '0')}`;

export const formatCandidateCode = (id: number): string => paddedCode('U', id);
export const formatCompanyCode = (id: number): string => paddedCode('C', id);
export const formatAgentCode = (id: number): string => paddedCode('A', id);
export const formatAdminCode = (id: number): string => `admin${id}`;
export const formatJobCode = (id: number): string => paddedCode('J', id);
export const formatApplicationCode = (id: number): string =>
  paddedCode('APP', id);

export function createTemporaryBusinessCode(maxLength: number): string {
  return `T${randomBytes(Math.ceil((maxLength - 1) / 2))
    .toString('hex')
    .slice(0, maxLength - 1)}`;
}
