#!/usr/bin/env bash
# Load the Fintrack remote database connection into the current shell.
#
# Usage (must be sourced, so the variables stay in your terminal):
#   source scripts/setup-db.sh
#   npx supabase db push --remote="$DBURL" --dry-run
#
# Reads DBPW from .env.supabase (git-ignored, one line: DBPW=yourpassword).
# The password must be URL-safe (letters and digits), or percent-encoded.
# Clear it when done: unset DBPW DBURL

if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  echo "Run this with: source scripts/setup-db.sh" >&2
  exit 1
fi

_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
_env="$_root/.env.supabase"

if [ ! -f "$_env" ]; then
  echo "Missing $_env (create it with a line: DBPW=yourpassword)" >&2
  unset _root _env
  return 1
fi

set -a
# shellcheck disable=SC1090
source "$_env"
set +a

if [ -z "${DBPW:-}" ]; then
  echo "DBPW is not set in $_env" >&2
  unset _root _env
  return 1
fi

export DBURL="postgresql://postgres.wemabjrblculecxohumm:${DBPW}@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
echo "DBURL loaded for Fintrack (wemabjrblculecxohumm). Password hidden."

unset _root _env
