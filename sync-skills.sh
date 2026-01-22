 #!/bin/bash
 #
 # Sync Umple skills from this repository to ~/.agents/skills
 #

 set -e

 # Source and destination directories
 SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
 DEST_DIR="$HOME/.agents/skills"

 # Ensure destination exists
 mkdir -p "$DEST_DIR"

 echo "Syncing Umple skills from $SOURCE_DIR to $DEST_DIR"
 echo "---"

 # Find all skill directories (those containing SKILL.md)
 find "$SOURCE_DIR" -maxdepth 2 -type f -name "SKILL.md" | while read -r skill_file; do
     skill_dir="$(dirname "$skill_file")"
     skill_name="$(basename "$skill_dir")"

     echo "Syncing: $skill_name"

     # Use rsync to sync the skill directory
     # -a: archive mode (preserves permissions, timestamps, etc.)
     # -v: verbose
     # --delete: remove files in dest that don't exist in source
     rsync -av --delete "$skill_dir/" "$DEST_DIR/$skill_name/"
 done

 echo "---"
 echo "Sync complete!"
