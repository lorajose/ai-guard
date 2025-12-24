export type Money = {
  amount: number;
  currency?: string;
};

export type DocumentBranding = {
  primaryColor?: string;
  secondaryColor?: string;
};

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type InvoiceData = {
  status?: "created" | "sent" | "waiting" | "paid";
  branding?: DocumentBranding;
  issuer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logoUrl?: string;
  };
  client: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  invoice: {
    number: string;
    issueDate: string;
    dueDate: string;
  };
  items: InvoiceItem[];
  tax: {
    percent?: number;
    amount?: number;
  };
  total: Money;
  note?: string;
  policy?: string;
};

export type ProposalService = {
  name: string;
  price?: string;
};

export type ProposalData = {
  branding?: DocumentBranding;
  provider: {
    name: string;
    email: string;
    phone: string;
    logoUrl?: string;
  };
  client: {
    name: string;
    company?: string;
  };
  proposal: {
    title: string;
    summary: string;
  };
  services: ProposalService[];
  total: string;
  validityDays: number;
  terms?: string;
};

export type ContractData = {
  branding?: DocumentBranding;
  parties: {
    providerName: string;
    clientName: string;
  };
  service: {
    description: string;
  };
  duration: {
    startDate: string;
    endDate?: string;
    openEnded: boolean;
  };
  payment: {
    amount: string;
    frequency: "one_time" | "monthly";
  };
  clauses: {
    liability: string;
    cancellation: string;
  };
  signature: {
    signerName: string;
    date: string;
  };
};
