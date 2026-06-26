export function isSuperadminRole(roleName?: string | null): boolean {
  return roleName?.trim().toLowerCase() === 'superadmin';
}
