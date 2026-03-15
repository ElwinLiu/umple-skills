---
name: umple-code-generator
description: "Generate production-quality code (Java, Python, PHP, Ruby, C++, SQL) from Umple models. Use when user requests: (1) Code generation from UML/class models (2) Java/Python/PHP/Ruby/C++ class generation (3) SQL schema from a domain model (4) Boilerplate-free implementation of classes with associations and state machines (5) Converting a domain model to working code. Produces complete implementations with constructors, getters/setters, association management, and state machine logic."
---

# Umple Code Generator

## Supported languages

| Language | `language` value | Notes                          |
| -------- | ---------------- | ------------------------------ |
| Java     | `Java`           | Full-featured, default target  |
| Python   | `Python`         | Some limitations               |
| PHP      | `Php`            | Full implementations           |
| Ruby     | `Ruby`           | Experimental                   |
| C++      | `RTCpp`          | Real-time C++ with headers     |
| SQL      | `Sql`            | CREATE TABLE DDL + foreign keys|

## Workflow

1. Read `references/umple-modeling-syntax.md`.
2. Write a valid Umple model for the user's domain.
3. Call the Umple Online API (see below).
4. Parse the generated code from the response.
5. On error, read the message, fix the code, retry (up to 3 times).
6. Split into per-class files and present to the user.
7. If helpful, read `references/generated-api-patterns.md` to explain what was generated.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Value                |
| --------------- | -------------------- |
| `language`      | See table above      |
| `languageStyle` | `codegen`            |
| `umpleCode`     | The Umple source code|
| `filename`      | `model.ump`          |

Use whatever HTTP tool is available (WebFetch, curl, fetch, etc.).

### Response parsing

**Success:** code appears after a `<p>URL_SPLIT` delimiter. Strip HTML tags and decode entities (`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`, `&quot;` → `"`). Files separated by `//%% NEW FILE ClassName BEGINS HERE %%`.

**Error:** response contains `<span class="umple-message-error">`. Strip HTML tags to read the error.

## Output

1. Show the Umple source in an `umple` code block.
2. Present generated code split into per-class files.
3. Save files: `<name>/model.ump` and `<name>/<ClassName>.java` (etc.).

Same model can generate multiple languages — only the `language` parameter changes.

## Guardrails

- Always read the syntax reference before writing Umple code.
- Prefer a smaller valid model over guessing syntax.
- One association per class pair — never define the same relationship from both sides.
