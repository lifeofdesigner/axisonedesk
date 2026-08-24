export type DealStage = "lead" | "qualified" | "proposal" | "won" | "lost";

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface Deal {
  id: string;
  customerId: string | null;
  title: string;
  value: number;
  stage: DealStage;
  expectedCloseDate: string | null;
  ownerId: string | null;
  createdAt: string;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export const dealStages: { key: DealStage; label: string }[] = [
  { key: "lead", label: "Lead" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];
