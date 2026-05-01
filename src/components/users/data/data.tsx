import { User, UserKey, KeyRound } from 'lucide-react';

// export const Status = [
//   {
//     label: 'Active',
//     value: 'active' as const,
//     icon: ShieldCheck,
//   },
//   {
//     label: 'Inactive',
//     value: 'inactive' as const,
//     icon: ShieldMinus,
//   },
// ];

export const Roles = [
  {
    label: 'Client',
    value: 'client' as const,
    icon: User,
  },
  {
    label: 'Admin',
    value: 'admin' as const,
    icon: UserKey,
  },
  {
    label: 'Super Admin',
    value: 'superadmin' as const,
    icon: KeyRound,
  },
];
