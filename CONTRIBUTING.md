# Contributing to umple-skills

Before contributing, review:
- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

## Installation

```bash
npx skills add umple/umple-skills
```

## Local setup

```bash
git clone https://github.com/umple/umple-skills.git
cd umple-skills
./sync-skills.sh   # optional: sync to ~/.agents/skills
```

## Repository structure

```
umple-skills/
├── README.md
├── CONTRIBUTING.md
├── sync-skills.sh
├── assets/
├── umple-diagram-generator/
│   ├── SKILL.md
│   └── references/
└── umple-code-generator/
    ├── SKILL.md
    └── references/
```

### Skill anatomy

Each skill has two layers:

| Layer | Purpose | When to modify |
|-------|---------|----------------|
| `SKILL.md` | Workflow orchestration | Changing when/how the skill triggers |
| `references/` | Domain knowledge + API docs | Updating Umple syntax, API details, or patterns |

Skills call the Umple Online API using whatever HTTP tool is available in the agent's environment. The `references/api-reference.md` in each skill documents the endpoint, parameters, and response parsing.

## Pull request guidelines

1. Explain the problem and your proposed solution.
2. Keep PRs focused and reasonably small.
3. Link related issues if available.
4. Include sample commands/output when behavior changes.
5. Update docs (`README.md`, `SKILL.md`, references) for user-facing changes.
6. Test API calls against the Umple Online endpoint before submitting.

## Review expectations

A good PR is ready to merge when:

- The change is clear and scoped
- Documentation is updated
- A maintainer review is completed
