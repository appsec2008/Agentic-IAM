
# Agentic IAM Fortress: A Zero-Trust Identity Framework for Agentic AI

**Agentic IAM Fortress** is a demonstration platform showcasing a novel Zero-Trust Identity and Access Management (IAM) framework specifically designed for the dynamic and complex world of AI agents and Multi-Agent Systems (MAS). This project implements key concepts from the research paper: "[A Novel Zero-Trust Identity Framework for Agentic AI: Decentralized Authentication and Fine-Grained Access Control](https://arxiv.org/abs/2505.19301)".

## The Challenge with Traditional IAM for AI Agents

Traditional IAM systems, primarily built for human users or static machine identities using protocols like OAuth, OpenID Connect (OIDC), and SAML, are fundamentally inadequate for the unique characteristics of AI agents. These agents are often:

*   **Dynamic and Ephemeral**: Created and destroyed frequently.
*   **Interdependent**: Operating within complex Multi-Agent Systems (MAS).
*   **Autonomous**: Making decisions and taking actions without direct human intervention.

Existing IAM solutions falter due to their coarse-grained controls, single-entity focus, and lack of context-awareness when applied to such sophisticated AI ecosystems.

## Our Zero-Trust Approach

Agentic IAM Fortress proposes and implements a Zero-Trust framework centered around robust, verifiable **Agent Identities (AgentIDs)**. This approach ensures that no agent is trusted by default, and access is granted on a per-request basis after rigorous verification.

Key pillars of our framework include:

1.  **Decentralized Agent Identities (DIDs)**: Each AI agent is assigned a unique Decentralized Identifier (DID), providing a globally unique, self-sovereign identity.
2.  **Verifiable Credentials (VCs)**: Agents present VCs to attest to their attributes, capabilities, compliance status, and provenance. These credentials are cryptographically verifiable.
3.  **Agent Naming Service (ANS)**: An AI-powered discovery service (based on `ansName` like `protocol://AgentFunction.CapabilityDomain.Provider.Version`) that securely resolves AgentIDs to DIDs based on verifiable agent capabilities.
4.  **Attribute-Based Access Control (ABAC)**: Fine-grained access control policies are dynamically enforced based on agent attributes derived from their AgentID and presented VCs.
5.  **Global Policy Enforcement Layer**: A centralized, AI-powered authority for real-time management and enforcement of agent session policies across diverse agent communication protocols.
6.  **Continuous Monitoring and Incident Response**: Real-time log analysis, incident detection, and automated response mechanisms, such as quarantining compromised AgentIDs.
7.  **Verifiable Audit Trails**: All agent interactions and ABAC decisions are cryptographically verifiable, ensuring accountability.
8.  **Dynamic Trust Scoring**: An AI-powered system to continuously assess and update an agent's trust score based on its behavior, credentials, and compliance.

## Core Features Implemented

This application demonstrates the following core features of the Agentic IAM Fortress framework:

*   **Agent Management**: View, register (mocked), and inspect detailed profiles of AI agents, including their DIDs, ANS names, capabilities, roles, and trust scores.
*   **Agent Discovery (ANS)**: A simulated Agent Naming Service allowing users to discover agents based on capabilities, provider, protocol, and version.
*   **Verifiable Credential (VC) Presentation**: Agents (mocked) possess and can present VCs, which are displayed in their profiles, attesting to their attributes and capabilities.
*   **AI-Powered Access Policy Generation**: Dynamically generate Attribute-Based Access Control (ABAC) policies using Genkit AI based on agent capabilities, roles, and resource descriptions.
*   **AI-Powered Incident Response Tools**:
    *   **Behavior Analysis**: Analyze agent logs for anomalous patterns using AI.
    *   **Report Summarization**: Summarize detailed incident reports using AI.
*   **AI-Powered Attestation Report Generation**: Generate compliance attestation reports for agents based on (optional) agent ID, compliance requirements, and formatting instructions using AI.
*   **Audit Logging**: Review mock cryptographically verifiable logs of agent interactions and IAM decisions.
*   **Incident Management**: Track and manage (mocked) security incidents related to agent behavior.
*   **Trust Scoring Display**: Agents are assigned a trust score, influencing access decisions (conceptual).

## Tech Stack

*   **Frontend**: Next.js (App Router), React, TypeScript
*   **UI**: ShadCN UI Components, Tailwind CSS
*   **AI/Generative Features**: Google Genkit, Google AI (via Gemini models)

## Getting Started

### Prerequisites

*   Node.js (version 18.x or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd agentic-iam-fortress
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API Key:
    ```env
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```
    You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Development Server

1.  **Start the Next.js development server:**
    This will typically run the application on `http://localhost:9002`.
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  **Start the Genkit development server (in a separate terminal):**
    Genkit flows (for AI features) are often run with a local developer server. This allows you to inspect traces and manage flows.
    ```bash
    npm run genkit:dev
    # or
    yarn genkit:dev
    ```
    This usually starts the Genkit developer UI on `http://localhost:4000`.

Now you can open `http://localhost:9002` in your browser to see the application.

## How to Contribute

We welcome contributions to enhance Agentic IAM Fortress! Please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b fix/your-bug-fix-name
    ```
3.  **Make your changes.** Ensure your code adheres to the project's style and quality guidelines.
4.  **Commit your changes** with clear and descriptive messages.
5.  **Push your branch** to your forked repository.
6.  **Open a Pull Request (PR)** to the main repository, detailing the changes you've made.

We will review your PR and provide feedback or merge it.

## How to Reference This Project

If you use concepts or code from this project in your research or work, please cite our accompanying paper:

Huang, K., Narajala, V. S., Yeoh, J., Raskar, R., Harkati, Y., Huang, J., Habler, I., & Hughes, C. (2025). *A Novel Zero-Trust Identity Framework for Agentic AI: Decentralized Authentication and Fine-Grained Access Control*. arXiv preprint arXiv:2505.19301.

**Link to ArXiv paper**: [https://arxiv.org/abs/2505.19301](https://arxiv.org/abs/2505.19301)

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 [Your Name or Organization Name - Consider replacing this]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
