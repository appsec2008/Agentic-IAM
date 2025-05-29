export interface VerifiableCredential {
  id: string;
  type: string[];
  issuer: string; // DID of the issuer
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id: string; // DID of the subject (agent)
    [key: string]: any; // Claims
  };
  proof?: { // Optional proof details
    type: string;
    jwt?: string;
    proofPurpose: string;
    verificationMethod: string;
    created: string;
    jws?: string;
  };
}

export interface Agent {
  id: string; // DID format, e.g., did:example:agent:123
  ansName: string; // ANS format, e.g., acp://RiskAnalyzerBot.FinancialRiskAnalysis.AcmeFinanceServices.v2.1.3.prod
  name: string; // Human-readable name
  status: 'active' | 'inactive' | 'quarantined' | 'revoked';
  trustScore: number; // 0-100
  capabilities: string[];
  roles: string[];
  vcs: VerifiableCredential[];
  avatar?: string; // URL to placeholder image
  description?: string;
  creator?: string; // DID of creator
  modelInfo?: string; // e.g. "GPT-4 Turbo v2.1"
  didDocument?: Record<string, any>; // Simplified DID Document
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  rules: Array<{
    effect: 'allow' | 'deny';
    conditions: string[]; // Simplified conditions
    actions: string[];
    resources: string[];
  }>;
  generatedPolicy?: string; // For AI generated policies
}

export interface Incident {
  id: string;
  agentId: string; // DID of involved agent
  agentAnsName?: string;
  summary: string;
  timestamp: string;
  status: 'active' | 'under_investigation' | 'resolved' | 'false_positive';
  severity: 'critical' | 'high' | 'medium' | 'low';
  details?: string;
  logs?: string; // Raw logs for analysis
  analysisResult?: {
    anomalous: boolean;
    reason: string;
  };
}

export interface AuditLog {
  id:string;
  timestamp: string;
  agentId: string; // DID of agent
  agentAnsName?: string;
  action: string;
  targetResource?: string;
  targetAgentId?: string;
  targetAgentAnsName?: string;
  status: 'success' | 'failure';
  policyIds?: string[]; // Policies that applied
  presentedVcIds?: string[]; // IDs of VCs presented
  details?: string;
  ipAddress?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}
