<div align="center">
  <img src="assets/umple_logo.svg" alt="Umple Logo" width="200">
</div>

# Skills

A collection of AI skills for working with Umple - a Model-Oriented Programming technology that allows you to create textual UML models, add UML constructs directly into your code (Java, Python, PHP, C++, Ruby), generate high-quality code from UML models, and visualize models as UML diagrams.

## Installation

```bash
# Install via skills command (requires NPX)
npx skills add umple/umple-skills
```

## umple-diagram-generator

This skill enables AI agents to generate UML diagrams (class diagrams, state machines, ER diagrams) from natural-language requirements using Umple's textual modeling format.

Uses the Umple Online API — no local Umple CLI, Graphviz, or Bun installation needed.

## What This Skill Does

This skill helps AI agents convert textual requirements into visual UML diagrams by:
1. Reading diagram-specific guidance from the `references/` folder
2. Generating valid Umple code based on user requirements
3. Using the Umple Online API to produce SVG diagrams

## See Also

- `SKILL.md` for detailed agent instructions
- `references/` for domain-specific guidance
- Other skills in the umple-skills repository

```bash
# Sync to agents directory
./sync-skills.sh
```
Use the script when you're managing local skills at ~/.agents (Recommended if you're using multiple harnesses)
