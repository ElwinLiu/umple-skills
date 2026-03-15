<div align="center">
  <img src="assets/umple_logo.svg" alt="Umple Logo" width="200">
</div>

# Umple Skills

AI skills for [Umple](https://www.umple.org) — a Model-Oriented Programming technology for textual UML modeling and code generation.

## Installation

```bash
npx skills add umple/umple-skills
```

## Skills

### umple-diagram-generator

Generate UML diagrams from natural-language requirements.

- Class diagrams, state machine diagrams, ER diagrams, trait diagrams
- Outputs clean SVG via the Umple Online API
- No local dependencies (no Umple CLI, Graphviz, or Bun)

### umple-code-generator

Generate production-quality code from Umple models.

- Java, Python, PHP, Ruby, C++, SQL
- Complete class implementations with constructors, getters/setters, association management, state machine logic
- One model, multiple language targets

## Architecture

Each skill is self-contained with two layers:

```
<skill>/
├── SKILL.md         # Workflow — when and how to use the skill
└── references/      # Knowledge — Umple syntax, API details, patterns
```

- **SKILL.md** orchestrates the workflow
- **references/** provides domain knowledge — Umple syntax, API usage, generated code patterns

Both skills use the [Umple Online API](https://cruise.umple.org/umpleonline/) via whatever HTTP tool is available in the agent's environment — no local tooling required.

## Local development

```bash
git clone https://github.com/umple/umple-skills.git
cd umple-skills
./sync-skills.sh    # Sync skills to ~/.agents/skills
```
