export interface OrgProfile {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  timezone: string;
  currency: string;
  status: string;
}

export interface Role {
  id: string;
  name: string;
  isSystemRole: boolean;
}

export interface Member {
  id: string;
  userId: string;
  fullName: string | null;
  roleId: string;
  roleName: string;
  status: string;
  joinedAt: string | null;
}
