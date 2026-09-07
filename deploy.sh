#!/bin/bash
# push the game to itch, excluding everything listed in butler-ignore.txt
set -e

target="patrickmck/spyboat:html5"
butler="/usr/local/bin/butler/butler"

args=()
while IFS= read -r pattern; do
   [ -z "$pattern" ] && continue
   case "$pattern" in \#*) continue ;; esac
   args+=(--ignore="$pattern")
done < butler-ignore.txt

"$butler" push "${args[@]}" "$@" . "$target"
