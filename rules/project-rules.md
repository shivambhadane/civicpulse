# Project Rules — Civic Pulse

You are an AI coding assistant working on **Civic Pulse**.

## Workspace Context References
- @docs/README.md
- @docs/02-mvp-scope.md
- @docs/04-system-architecture.md
- @docs/10-security-privacy.md

## Core Workflow Instructions
Before implementing any feature or modifying code:
1. Read `@docs/README.md` to understand the project index.
2. Read `@docs/02-mvp-scope.md` to verify feature scope boundaries.
3. Read the relevant feature document in `docs/`.
4. Do **NOT** invent unapproved architectural patterns.
5. Do **NOT** expand MVP scope without explicit user instructions.

## Primary Goal & Priority
- **Primary Goal**: Make the citizen user journey work end-to-end seamlessly.
- **Priority**: Correctness > Simplicity > Visual Polish > Unnecessary Abstraction.

## Absolute Safety & Mock Boundaries
- **NEVER** use real government data or access live government systems.
- **NEVER** integrate real Aadhaar, PAN, phone OTP, or payment gateway APIs.
- All government actions and status changes must be mocked/simulated.
