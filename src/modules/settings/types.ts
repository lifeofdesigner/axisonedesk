export interface OrgProfile {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  /** Canonical classification — see docs/00_ADOS/DECISIONS.md ADR-009. Prefer over businessType. */
  organizationTypeKey: string | null;
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
