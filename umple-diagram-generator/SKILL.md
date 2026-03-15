---
name: umple-diagram-generator
description: "Generate diagrams (state machines, class diagrams, ER diagrams) from natural language requirements using Umple. Uses the Umple Online API — no local installs needed. Use when user requests: (1) State machine diagrams (2) UML class diagrams (3) ER diagrams (4) Diagram generation from text descriptions, (5) Any mention of Umple diagram generation, (6) Visual representation of states, transitions, events, classes, or relationships. Outputs SVG diagrams."
---

# Umple Diagram Generator

Generate an Umple `.ump` model from requirements and render it to SVG via the Umple Online API. No local dependencies required.

## Supported diagram types

| Type             | API `language` value          | Read before writing Umple              |
| ---------------- | ----------------------------- | -------------------------------------- |
| State machine    | `stateDiagram`                | `references/state-machine-guidance.md` |
| Class diagram    | `classDiagram`                | `references/class-diagram-guidance.md` |
| Trait diagram    | `traitDiagram`                | `references/class-diagram-guidance.md` |
| ER diagram       | `entityRelationshipDiagram`   | `references/class-diagram-guidance.md` |

## Workflow

1. Read the relevant reference file for the diagram type (see table above).
2. Clarify only what you must:
   - State machine: initial state, events, transitions, guards/actions
   - Class diagram: entities, attributes, relationships, multiplicities
3. Write valid Umple code based on the guidance.
4. Call the Umple Online API (see below) to compile and generate the diagram.
5. Extract the SVG from the response.
6. If compilation fails, read the error, fix the Umple code, and retry (up to 3 times).
7. Render the SVG diagram inline for the user. Display it visually — do not just describe it.

## Umple Online API

### Endpoint

```
POST https://cruise.umple.org/umpleonline/scripts/compiler.php
Content-Type: application/x-www-form-urlencoded
```

### Parameters (form-encoded body)

| Parameter       | Value                                                                              |
| --------------- | ---------------------------------------------------------------------------------- |
| `language`      | One of: `classDiagram`, `stateDiagram`, `traitDiagram`, `entityRelationshipDiagram` |
| `languageStyle` | `diagramUpdate`                                                                     |
| `error`         | `true`                                                                              |
| `umpleCode`     | The Umple source code                                                               |
| `filename`      | `model.ump`                                                                         |

### Example

To generate a class diagram for `class Student { String name; Integer id; }`:

```
POST https://cruise.umple.org/umpleonline/scripts/compiler.php

language=classDiagram&languageStyle=diagramUpdate&error=true&umpleCode=class+Student+%7B+String+name%3B+Integer+id%3B+%7D&filename=model.ump
```

### Response handling

The API returns HTML containing an embedded SVG diagram.

1. **Check for errors**: If the response contains `<p>URL_SPLIT`, everything before that marker may contain warnings/errors. Strip HTML tags to read them.
2. **Extract SVG**: Find the `<svg ... viewBox="...">...</svg>` block in the response. This is the diagram.
3. **Clean up**: Remove any `transform="scale(...) rotate(0)"` attributes, replacing with just `transform="rotate(0)"` for proper rendering.
4. **Error case**: If no `<svg` tag is found, the compilation failed. The response text (with HTML stripped) contains the error message.

## Output contract

1. State the diagram type generated.
2. Show the Umple source code in an `umple` code block.
3. Render the SVG diagram visually for the user.

## Guardrails

- Prefer a smaller valid Umple model over guessing syntax.
- Always read the reference file before writing Umple code.
- Keep actions/guards minimal (no secrets, no I/O).
