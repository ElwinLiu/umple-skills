# Contributing to umple-skills

This repository contains reusable AI skills for Umple workflows.

Before contributing, make sure you understand the basic idea of Skills:
- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

If you are unsure about any point in these best practices, ask your agent to read the linked docs and explain how the guidance applies to your change.

## Prerequisites and installation

### Install the skills package

Use this exact command:

```bash
npx skills add umple/umple-skills
```

### Install required tools

Install the runtime tools used by this repository:

- **Umple CLI**
  - Source (all platforms): https://cruise.umple.org/umpleonline/download_umple.shtml
- **Graphviz** (`dot`)
  - macOS (Homebrew): `brew install graphviz`
  - Ubuntu/Debian: `sudo apt-get update && sudo apt-get install -y graphviz`
  - Windows source/packages: https://graphviz.org/download/
- **Bun** (used through `npx -y bun`)
  - macOS/Linux: `curl -fsSL https://bun.sh/install | bash`
  - Windows source/packages: https://bun.sh/docs/installation
- **Node.js / npx**
  - Source/packages (including Windows): https://nodejs.org/en/download

Quick verification:

```bash
umple -h
dot -V
bun --version
npx --version
```

## Local setup

```bash
git clone https://github.com/umple/umple-skills.git
cd umple-skills
```

### Optional: sync skills into a local agent directory

Most agent harnesses keep skills in their own local folder. This script syncs skills into `~/.agents/skills`, which you can also use as a source to copy/link into harness-specific directories (for example `~/.claude`, `~/.codexs`, or `~/.pi`).

```bash
./sync-skills.sh
```

## Repository structure

```text
umple-skills/
├── README.md
├── CONTRIBUTING.md
├── sync-skills.sh
├── assets/
└── <skill-name>/
    ├── SKILL.md
    ├── scripts/
    └── references/
```

## Pull request guidelines

When opening a PR:

1. Explain the problem and your proposed solution.
2. Keep PRs focused and reasonably small.
3. Link related issues if available.
4. Include sample commands/output when behavior changes.
5. Update docs (`README.md`, `SKILL.md`, references) for user-facing changes.

## Review expectations

A good PR is ready to merge when:

- The change is clear and scoped
- Documentation is updated
- A maintainer review is completed
