---
  name: VAC Workspace Finance Tab conventions
  description: Patterns used in FinancePage.tsx AgencyManagementTab for adding new derived-financial sections
  ---

  - New financial sections in Tab 3 (Agency Management) should derive from the same source-of-truth helpers already used elsewhere (buildCostCenters for freelance costs, TAX_DEADLINES for fiscal dates, ssBaseline for social security), never invent parallel fake data — keeps every number traceable across tabs.
  - "Current operating month" widgets (fixed to TODAY) must NOT reuse the Monthly Ledger's navigable monthIndex state — compute a separate monthKeyOf(TODAY) filter so browsing history in one widget doesn't affect the other.
  - Per-line toggle state (Paid/Pending style) follows the existing `approvals` pattern: a Record<string, boolean> override map with a seedFrom(id+suffix) deterministic default, so toggles are stable across reloads without a backend.
  - Gotcha: HTML entities like "&amp;" only decode in literal JSX text children, not in JS string literals rendered via {variable} interpolation (e.g. object literal fields shown through props) — use a plain "&" there or it will render literally as "&amp;".
  - Despesas Fixas vs. Variáveis split (traditional ledger view): Fixas = saasOutflows + the tax-ss line only; Variáveis = productionOutflows + licensingOutflows + all other taxOutflows (tax-iva, tax-irs). Keep this split in sync if buildTaxOutflows ever adds new tax line ids.
  - Page layout ordering preference: put the "right now" daily-operations ledger/audit widget at the TOP of Tab 3, and push macro/yearly strategy widgets (Yearly Agency State) to the very BOTTOM — matches how the user wants day-to-day cash actionability prioritized over long-horizon KPIs.
  