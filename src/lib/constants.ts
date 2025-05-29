import type { Agent, Policy, Incident, AuditLog, NavItem, VerifiableCredential } from './types';
import { LayoutDashboard, Users2, SearchCode, FileSliders, AlertTriangle, ScrollText, FileCheck2, GitBranch } from 'lucide-react';

export const APP_NAME = "Agentic IAM Fortress";

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Agents', href: '/agents', icon: Users2 },
  { title: 'Agent Discovery', href: '/discovery', icon: SearchCode },
  { title: 'Access Policies', href: '/policies', icon: FileSliders },
  { title: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { title: 'Attestation', href: '/attestation', icon: FileCheck2 },
  { title: 'Audit Logs', href: '/audits', icon: ScrollText },
];

const sampleVCs: VerifiableCredential[] = [
  {
    id: 'vc:example:role:financial-analyst',
    type: ['VerifiableCredential', 'RoleCredential'],
    issuer: 'did:example:hr:acme-corp',
    issuanceDate: '2024-01-15T00:00:00Z',
    credentialSubject: {
      id: 'did:example:agent:financial-analyzer-001',
      role: 'FinancialRiskAnalystRole',
      department: 'Finance',
    },
     proof: { type: "Ed25519Signature2018", proofPurpose: "assertionMethod", verificationMethod: "did:example:hr:acme-corp#key-1", created: "2024-01-15T00:00:00Z", jws: "..." }
  },
  {
    id: 'vc:example:capability:sales-data-analytics',
    type: ['VerifiableCredential', 'CapabilityCredential'],
    issuer: 'did:example:datascience:acme-corp',
    issuanceDate: '2024-02-01T00:00:00Z',
    credentialSubject: {
      id: 'did:example:agent:financial-analyzer-001',
      capability: 'SalesDataAnalyticsCapability',
      skillLevel: 'expert',
    },
    proof: { type: "Ed25519Signature2018", proofPurpose: "assertionMethod", verificationMethod: "did:example:datascience:acme-corp#key-1", created: "2024-02-01T00:00:00Z", jws: "..." }
  },
  {
    id: 'vc:example:compliance:sox',
    type: ['VerifiableCredential', 'ComplianceCredential'],
    issuer: 'did:example:audit:external-auditors-inc',
    issuanceDate: '2023-12-01T00:00:00Z',
    expirationDate: '2024-12-01T00:00:00Z',
    credentialSubject: {
      id: 'did:example:agent:financial-analyzer-001',
      standard: 'SOX Section 404',
      status: 'Compliant',
    },
    proof: { type: "Ed25519Signature2018", proofPurpose: "assertionMethod", verificationMethod: "did:example:audit:external-auditors-inc#key-1", created: "2023-12-01T00:00:00Z", jws: "..." }
  },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'did:example:agent:financial-analyzer-001',
    ansName: 'acp://RiskAnalyzerBot.FinancialRiskAnalysis.AcmeFinanceServices.v2.1.3.prod',
    name: 'RiskAnalyzer Bot',
    status: 'active',
    trustScore: 92,
    capabilities: ['FinancialRiskAnalysis', 'CorporateReporting', 'SalesDataAnalyticsCapability'],
    roles: ['FinancialRiskAnalystRole'],
    vcs: sampleVCs,
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'robot face',
    description: 'Performs financial risk analysis based on sales and market data for corporate reporting.',
    creator: 'did:example:user:alice-dev',
    modelInfo: 'Proprietary Financial Model v3.2',
    didDocument: {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: 'did:example:agent:financial-analyzer-001',
      verificationMethod: [{ id: 'did:example:agent:financial-analyzer-001#key-1', type: 'Ed25519VerificationKey2018', controller: 'did:example:agent:financial-analyzer-001', publicKeyBase58: '...' }],
      authentication: ['did:example:agent:financial-analyzer-001#key-1'],
      service: [{ id: '#ans', type: 'AgentNamingService', serviceEndpoint: 'acp://RiskAnalyzerBot.FinancialRiskAnalysis.AcmeFinanceServices.v2.1.3.prod' }]
    }
  },
  {
    id: 'did:example:agent:support-agent-alpha',
    ansName: 'helpdesk://SupportAgent.ProductQuery.CustomerFacing.v1.AcmeSupport',
    name: 'SupportAgent Alpha',
    status: 'active',
    trustScore: 85,
    capabilities: ['CustomerSupport', 'ProductKnowledgeLookup', 'TicketManagement'],
    roles: ['CustomerSupportTier1'],
    vcs: [sampleVCs[0]],
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'support headset',
    description: 'Handles customer support queries for Product X, accessing knowledge base and ticket systems.',
    creator: 'did:example:user:bob-manager',
    modelInfo: 'FAQ Retrieval LLM v1.5',
  },
  {
    id: 'did:example:agent:inventory-checker-007',
    ansName: 'a2a://InventoryCheck.RetailStoreXYZ.Ops.v1.hourly',
    name: 'Inventory Checker 007',
    status: 'quarantined',
    trustScore: 45,
    capabilities: ['InventoryLookup', 'StockUpdateReporting'],
    roles: ['StoreOperationsAssistant'],
    vcs: [],
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'barcode scanner',
    description: 'Hourly checks inventory levels for Retail Store XYZ and reports to InventoryMasterAgent. Currently quarantined due to anomalous activity.',
    creator: 'did:example:system:ops-automation',
    modelInfo: 'Simple Logic Bot v2.0',
  },
  {
    id: 'did:example:agent:data-pipeline-etl',
    ansName: 'mcp://ETL.DataWarehouseLoading.DataOps.v2.nightly',
    name: 'DataPipeline ETL Agent',
    status: 'inactive',
    trustScore: 70,
    capabilities: ['DataExtraction', 'DataTransformation', 'DataLoading'],
    roles: ['ETLOperator'],
    vcs: [sampleVCs[1]],
    avatar: 'https://placehold.co/128x128.png',
    dataAiHint: 'data flow',
    description: 'Nightly ETL agent responsible for loading data into the data warehouse. Currently inactive during maintenance window.',
    creator: 'did:example:user:charlie-dataeng',
    modelInfo: 'Apache NiFi Flow Agent v1.3',
  },
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'policy-001',
    name: 'Financial Data Access Policy',
    description: 'Controls access to sensitive financial databases and APIs.',
    rules: [
      {
        effect: 'allow',
        conditions: ['agent.role == "FinancialRiskAnalystRole"', 'resource.sensitivity == "high"'],
        actions: ['read', 'query'],
        resources: ['db:InternalDB-SalesFigures', 'api:ExternalAPI-MarketSentiment'],
      },
      {
        effect: 'deny',
        conditions: ['agent.trustScore < 75'],
        actions: ['write', 'delete'],
        resources: ['db:InternalDB-SalesFigures'],
      }
    ],
  },
  {
    id: 'policy-002',
    name: 'Customer Support Agent Policy',
    description: 'Defines permissions for customer support agents.',
    rules: [
      {
        effect: 'allow',
        conditions: ['agent.role == "CustomerSupportTier1"'],
        actions: ['read', 'update'],
        resources: ['system:CustomerTicketSystem', 'kb:ProductKnowledgeBase'],
      }
    ],
  },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    agentId: 'did:example:agent:inventory-checker-007',
    agentAnsName: 'a2a://InventoryCheck.RetailStoreXYZ.Ops.v1.hourly',
    summary: 'Anomalous data access patterns detected.',
    timestamp: '2024-07-28T10:30:00Z',
    status: 'active',
    severity: 'high',
    details: 'Agent attempted to access employee payroll data multiple times outside of its defined capabilities.',
    logs: "Log line 1...\nLog line 2 attempted access to /api/payroll...",
    analysisResult: { anomalous: true, reason: "Attempted access to unauthorized resource 'payroll_data' multiple times."}
  },
  {
    id: 'inc-002',
    agentId: 'did:example:agent:financial-analyzer-001',
    agentAnsName: 'acp://RiskAnalyzerBot.FinancialRiskAnalysis.AcmeFinanceServices.v2.1.3.prod',
    summary: 'High volume of failed login attempts.',
    timestamp: '2024-07-27T15:00:00Z',
    status: 'resolved',
    severity: 'medium',
    details: 'Detected 50 failed login attempts in 5 minutes. Agent was temporarily locked. Investigation found it was a misconfigured downstream service.',
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2024-07-29T09:00:00Z',
    agentId: 'did:example:agent:financial-analyzer-001',
    agentAnsName: 'acp://RiskAnalyzerBot.FinancialRiskAnalysis.AcmeFinanceServices.v2.1.3.prod',
    action: 'QUERY_TABLE',
    targetResource: 'db:InternalDB-SalesFigures (QuarterlySummaries)',
    status: 'success',
    policyIds: ['policy-001'],
    presentedVcIds: ['vc:example:role:financial-analyst', 'vc:example:capability:sales-data-analytics'],
    details: 'Query executed successfully.',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'log-002',
    timestamp: '2024-07-29T09:05:00Z',
    agentId: 'did:example:agent:inventory-checker-007',
    agentAnsName: 'a2a://InventoryCheck.RetailStoreXYZ.Ops.v1.hourly',
    action: 'ACCESS_RESOURCE',
    targetResource: 'api:EmployeePayroll',
    status: 'failure',
    policyIds: ['policy-global-deny-unauthorized'], // Example
    details: 'Access denied due to policy violation. Agent lacks required permissions.',
    ipAddress: '10.0.5.23'
  },
  {
    id: 'log-003',
    timestamp: '2024-07-29T09:10:00Z',
    agentId: 'did:example:agent:support-agent-alpha',
    agentAnsName: 'helpdesk://SupportAgent.ProductQuery.CustomerFacing.v1.AcmeSupport',
    action: 'UPDATE_TICKET',
    targetResource: 'system:CustomerTicketSystem (Ticket #7890)',
    status: 'success',
    policyIds: ['policy-002'],
    presentedVcIds: ['vc:example:role:customer-support-t1'],
    details: 'Ticket status updated to "Resolved".',
    ipAddress: '192.168.2.55'
  },
];
