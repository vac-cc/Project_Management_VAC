export interface FinanceTeamMember {
  name: string;
  role: string;
}

export interface FinanceCostLine {
  id: string;
  label: string;
  detail?: string;
  approved: number;
  actual: number;
}

export interface ProjectFinanceRecord {
  budget: number;
  team: FinanceTeamMember[];
  costs: FinanceCostLine[];
  note?: string;
  proBono?: boolean;
}

export const PROJECT_FINANCIALS: Record<string, ProjectFinanceRecord> = {
  "BPC-001": {
    budget: 150,
    team: [{ name: "Catarina Pinto", role: "Strategist & Designer" }],
    costs: [],
    note: "No freelancer costs recorded.",
  },
  "BPC-002": {
    budget: 120,
    team: [
      { name: "Anaís Almeida", role: "Designer" },
      { name: "Catarina Pinto", role: "Strategist & Designer" },
    ],
    costs: [],
    note: "No freelancer costs recorded.",
  },
  "SML-001": {
    budget: 800,
    team: [
      { name: "Pedro Oliveira", role: "Creative Director" },
      { name: "Catarina Pinto", role: "Strategist & Designer" },
      { name: "Íris Filipe", role: "Graphic Designer" },
    ],
    costs: [
      {
        id: "SML-001-pedro-oliveira",
        label: "Freelance Creative Director (Pedro Oliveira)",
        detail: "Pedro Oliveira — Creative Director",
        approved: 700,
        actual: 700,
      },
      {
        id: "SML-001-iris-filipe",
        label: "Freelance Graphic Designer (Íris Filipe)",
        detail: "Íris Filipe — Graphic Designer",
        approved: 240,
        actual: 240,
      },
    ],
  },
  "SML-002": {
    budget: 800,
    team: [
      { name: "Pedro Oliveira", role: "Creative Director" },
      { name: "Catarina Pinto", role: "Strategist & Designer" },
    ],
    costs: [],
    note: "No costs yet — project not started.",
  },
  "CRZ-001": {
    budget: 1300,
    team: [{ name: "Catarina Pinto", role: "Executive Producer" }],
    costs: [],
    note: "No freelancer costs recorded.",
  },
  "DIO-001": {
    budget: 0,
    team: [
      { name: "Pedro Oliveira", role: "Creative Director" },
      { name: "Catarina Pinto", role: "Strategist & Designer" },
    ],
    costs: [],
    note: "Pro bono project. Pedro Oliveira — €300 paid directly by client; no cost to VĀC.",
    proBono: true,
  },
};

export function getProjectFinancialRecord(projectId: string): ProjectFinanceRecord | null {
  return PROJECT_FINANCIALS[projectId] ?? null;
}