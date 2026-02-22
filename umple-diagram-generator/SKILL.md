---
name: umple-diagram-generator
description: "Generate diagrams (state machines, class diagrams) and source code (Java, PHP, Python) from natural language requirements using Umple. Use when user requests: (1) Visual diagrams, (2) Source code generation from models, (3) Syntax validation of Umple code, (4) Model-to-code transformation. Outputs organized folders containing models and generated artifacts."
allowed-tools: Bash(npx -y bun:*), Bash(command -v umple:*), Bash(umple:*), Bash(mktemp:*), Bash(mkdir:*), Bash(cat:*), Bash(cp:*), Bash(command -v dot:*), Bash(dot:*), Bash(date:*)
---

# Umple Diagram Generator Skill

## Overview

Generate Umple `.ump` models from requirements and transform them into visual diagrams (SVG) or source code (Java, PHP, Python).

## Supported generation types

| Type            | Umple generator  | Output artifact      | Description                               |
| --------------- | ---------------- | -------------------- | ----------------------------------------- |
| `state-machine` | `GvStateDiagram` | SVG Diagram          | Visual state machine representation       |
| `class-diagram` | `GvClassDiagram` | SVG Diagram          | Visual UML class diagram representation   |
| `java`          | `Java`           | `.java` files        | Full Java source code generation          |
| `php`           | `Php`            | `.php` files         | Full PHP source code generation           |
| `python`        | `Python`         | `.py` files          | Full Python source code generation        |
| `validate`      | `None`           | Console Output       | Syntax check only (use for self-repair)   |

## Script

Entry point: `scripts/main.ts` (run with Bun via `npx -y bun`).

## Quick start

```bash
# Folder mode: organized output with all files (.ump, .gv, .svg)
npx -y bun ${SKILL_DIR}/scripts/main.ts --input model.ump --output ./diagrams --name "light-controller"

# Exact path mode: save SVG to specific file path
npx -y bun ${SKILL_DIR}/scripts/main.ts --input model.ump --output ./my-diagram.svg

# Class diagram with custom name
npx -y bun ${SKILL_DIR}/scripts/main.ts --input model.ump --output ./diagrams --name "user-system" --type class-diagram
```

Replace `${SKILL_DIR}` with the absolute path to this skill directory.

### Script options

| Option                  | Description                                                                      |
| ----------------------- | -------------------------------------------------------------------------------- |
| `-i, --input <path>`    | Input `.ump` file (required)                                                     |
| `-o, --output <path>`   | Output path: directory for folder mode, or `.svg` file for exact path (required) |
| `-n, --name <name>`     | Diagram name for folder mode (optional, triggers folder mode)                    |
| `-t, --type <type>`     | Diagram type: `state-machine` (default), `class-diagram`                         |
| `-s, --suboption <opt>` | GvStateDiagram suboption (repeatable)                                            |
| `--json`                | JSON output with details                                                         |
| `-h, --help`            | Show help                                                                        |

### Output modes

**Folder Mode** (when `--name` is specified or `--output` is a directory):

- Creates organized folder with timestamped name
- Includes all files: `.ump` (source), `.gv` (graphviz), `.svg` (diagram)

**Folder naming**:

- With `--name`: `<sanitized-name>_<timestamp>/`
- Without `--name`: `<diagram-type>_<timestamp>/`

**Example**:

```
diagrams/
└── light-controller_20260121_183045/
    ├── model.ump
    ├── model.gv
    └── model.svg
```

**Exact Path Mode** (when `--output` ends with `.svg`):

- Saves only the SVG file to the exact specified path
- Useful when user specifies a specific output location

**Example**:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts --input model.ump --output /path/to/my-diagram.svg
# Result: /path/to/my-diagram.svg (only SVG, no folder created)
```

### Exit codes

| Code | Meaning                                           |
| ---- | ------------------------------------------------- |
| 0    | Success                                           |
| 1    | Missing dependencies (umple or dot)               |
| 2    | Umple validation/compilation failed               |
| 3    | SVG generation failed or unsupported diagram type |

## Workflow

1. Pre-flight: verify deps
   - `command -v umple`
   - `command -v dot`
     If missing, stop and ask the user to install them.
2. Clarify only what you must
   - State machine: initial state, events, finals, guards/actions
   - Class diagram: entities, attributes, relationships, multiplicities
3. Write Umple
   - Read the relevant guidance file (table above) before writing.
4. Render
   - Prefer folder mode unless the user explicitly provides an `.svg` output path.
5. Validate
   - On failure: fix Umple and retry up to 3 times.

## Repair loop

If rendering fails: read script output, apply a focused fix, re-run the same command.

## Output contract

1. Diagram type
2. Generated Umple (single `umple` block)
3. Exact command run
4. Output paths (folder + SVG, or exact SVG path)

## Guardrails

- Prefer a smaller valid Umple model over guessing syntax.
- Use exact path mode only when the user provides an `.svg` path.
- Do not install system dependencies.
- Keep actions/guards minimal (no secrets, no I/O).
