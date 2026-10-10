#!/usr/bin/env bash
# VIBE Teacher installer for macOS / Linux.
# Copies skills/vibe-teacher into the folders AI coding tools read skills from.
# No admin rights, no symlinks. Read it before running - piping scripts into a shell is a trust decision.
#
#   curl -fsSL https://raw.githubusercontent.com/tawsifar/vibe-teacher/main/install/install.sh | bash
#   curl -fsSL .../install.sh | bash -s -- --only claude
#
# Options:
#   --only claude|agents|antigravity   install into one family of tools only
#   --project                          install into ./.claude/skills and ./.agents/skills of this folder
#   --uninstall                        remove VIBE Teacher from the target folders
#   --source DIR                       use a local copy of the repo instead of downloading
#   --help                             show this help

set -euo pipefail

REPO="tawsifar/vibe-teacher"
BRANCH="${VIBE_TEACHER_BRANCH:-main}"
SKILL="vibe-teacher"
ONLY=""
MODE="install"
SCOPE="global"
SOURCE=""

say()  { printf '%s\n' "$*"; }
die()  { printf 'Oops: %s\n' "$*" >&2; exit 1; }

usage() { sed -n '2,17p' "$0" 2>/dev/null | sed 's/^# \{0,1\}//' || true; }

while [ $# -gt 0 ]; do
  case "$1" in
    --only)      [ $# -ge 2 ] || die "--only needs a value: claude, agents or antigravity"; ONLY="$2"; shift 2 ;;
    --only=*)    ONLY="${1#*=}"; shift ;;
    --project)   SCOPE="project"; shift ;;
    --uninstall) MODE="uninstall"; shift ;;
    --source)    [ $# -ge 2 ] || die "--source needs a folder"; SOURCE="$2"; shift 2 ;;
    --help|-h)   usage; exit 0 ;;
    *)           die "unknown option '$1' (try --help)" ;;
  esac
done

case "$ONLY" in
  ""|claude|agents|antigravity) ;;
  *) die "--only must be claude, agents or antigravity" ;;
esac

# ---------------------------------------------------------------- targets
TARGETS=()
add_target() { TARGETS+=("$1"); }

if [ "$SCOPE" = "project" ]; then
  { [ -z "$ONLY" ] || [ "$ONLY" = "claude" ]; } && add_target "$PWD/.claude/skills"
  { [ -z "$ONLY" ] || [ "$ONLY" = "agents" ] || [ "$ONLY" = "antigravity" ]; } && add_target "$PWD/.agents/skills"
else
  [ -n "${HOME:-}" ] || die "HOME is not set"
  { [ -z "$ONLY" ] || [ "$ONLY" = "claude" ]; } && add_target "$HOME/.claude/skills"
  { [ -z "$ONLY" ] || [ "$ONLY" = "agents" ]; } && add_target "$HOME/.agents/skills"
  if [ -z "$ONLY" ] || [ "$ONLY" = "antigravity" ]; then
    add_target "$HOME/.gemini/config/skills"
    add_target "$HOME/.gemini/antigravity/skills"
  fi
fi

# ---------------------------------------------------------------- uninstall
if [ "$MODE" = "uninstall" ]; then
  say "Removing VIBE Teacher..."
  for t in "${TARGETS[@]}"; do
    if [ -d "$t/$SKILL" ]; then rm -rf "$t/$SKILL"; say "  removed  $t/$SKILL"; fi
    if [ -d "$t/$SKILL.bak" ]; then say "  (kept backup $t/$SKILL.bak - delete it if you don't need it)"; fi
  done
  say "Done. Restart your AI tool."
  exit 0
fi

# ---------------------------------------------------------------- get the files
TMP=""
cleanup() { if [ -n "$TMP" ]; then rm -rf "$TMP"; fi; }
trap cleanup EXIT

if [ -n "$SOURCE" ]; then
  SRC="$(cd "$SOURCE" && pwd)/skills/$SKILL"
else
  TMP="$(mktemp -d 2>/dev/null || mktemp -d -t vibe-teacher)"
  ZIP_URL="https://github.com/$REPO/archive/refs/heads/$BRANCH.zip"
  say "Downloading VIBE Teacher from github.com/$REPO ..."
  got=""
  if command -v unzip >/dev/null 2>&1; then
    if command -v curl >/dev/null 2>&1; then
      curl -fsSL "$ZIP_URL" -o "$TMP/repo.zip" && got="zip"
    elif command -v wget >/dev/null 2>&1; then
      wget -qO "$TMP/repo.zip" "$ZIP_URL" && got="zip"
    fi
  fi
  if [ "$got" = "zip" ]; then
    unzip -q "$TMP/repo.zip" -d "$TMP"
    SRC="$(find "$TMP" -maxdepth 4 -type f -path "*/skills/$SKILL/SKILL.md" | head -n 1 | xargs -I{} dirname {})"
  elif command -v git >/dev/null 2>&1; then
    git clone --quiet --depth 1 --branch "$BRANCH" "https://github.com/$REPO.git" "$TMP/repo"
    SRC="$TMP/repo/skills/$SKILL"
  else
    die "need curl (or wget) + unzip, or git. Install one of them and try again."
  fi
fi

[ -n "${SRC:-}" ] && [ -f "$SRC/SKILL.md" ] || die "could not find skills/$SKILL/SKILL.md in the download"

# ---------------------------------------------------------------- copy
say "Installing VIBE Teacher..."
for t in "${TARGETS[@]}"; do
  mkdir -p "$t"
  dest="$t/$SKILL"
  if [ -e "$dest" ]; then
    rm -rf "$dest.bak"
    mv "$dest" "$dest.bak"
  fi
  cp -R "$SRC" "$dest"
  say "  installed  $dest"
done

say ""
say "All set! VIBE Teacher is installed in ${#TARGETS[@]} place(s)."
say "Restart your AI tool, then type:  vibe teacher"
say "(Claude Code: /vibe-teacher   Codex: \$vibe-teacher   Others: just ask 'vibe teacher, give me a tour')"
