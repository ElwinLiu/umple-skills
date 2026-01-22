# umple-diagram-generator

An AI skill that generates UML diagrams from natural-language requirements.

## What This Skill Does

This skill helps AI agents convert textual requirements into visual UML diagrams by:
1. Reading diagram-specific guidance from the `references/` folder
2. Generating valid Umple code based on user requirements
3. Running Umple CLI to produce SVG diagrams

## Architecture

This skill follows the umple-skills pattern:

```
skill-name/
├── SKILL.md              ← Agent instructions (what to do)
├── README.md             ← This file (overview)
├── scripts/              ← CLI tools
│   └── main.ts
└── references/           ← Domain-specific guidance
    ├── class-diagram-guidance.md
    └── state-machine-guidance.md
```

## For AI Agents

1. Read `SKILL.md` for task instructions
2. Load relevant guidance from `references/`
3. Execute scripts with appropriate parameters
4. Report results to user

## Dependencies

- **Umple CLI**: Diagram generation engine
- **Graphviz**: SVG conversion
- **Bun**: TypeScript runtime

## Installation

```bash
# Sync to agents directory
./sync-skills.sh

# Or manually
cp -r skill-name ~/.agents/skills/
```

## See Also

- `SKILL.md` for detailed agent instructions
- `references/` for domain-specific guidance
- Other skills in the umple-skills repository
