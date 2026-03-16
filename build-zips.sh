#!/bin/bash
#
# Build zip files for each skill (for uploading to Claude Desktop).
# Zips are placed in dist/ at the repo root.
#

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$REPO_DIR/dist"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Find all skill directories (those containing SKILL.md)
find "$REPO_DIR" -maxdepth 2 -type f -name "SKILL.md" | while read -r skill_file; do
    skill_dir="$(dirname "$skill_file")"
    skill_name="$(basename "$skill_dir")"

    echo "Zipping: $skill_name"
    (cd "$REPO_DIR" && zip -r "$DIST_DIR/$skill_name.zip" "$skill_name/" -x "$skill_name/evals/*")
done

echo "---"
echo "Built zips in $DIST_DIR:"
ls -lh "$DIST_DIR"
