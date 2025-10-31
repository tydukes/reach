#!/usr/bin/env python3
"""
Validate documentation structure and metadata for REACH.

This script checks that documentation files follow project standards.
"""
import pathlib
import sys


def validate_markdown_file(file_path: pathlib.Path) -> list[str]:
    """
    Validate a markdown file for basic requirements.

    Args:
        file_path: Path to the markdown file

    Returns:
        List of validation errors (empty if valid)
    """
    errors = []

    try:
        content = file_path.read_text(encoding="utf-8")
        lines = content.splitlines()

        # Skip empty files
        if not lines:
            return errors

        # Check for title (first non-empty line should be h1)
        first_non_empty = next((line for line in lines if line.strip()), None)
        if first_non_empty and not first_non_empty.startswith("# "):
            errors.append(f"{file_path}: Missing h1 title at start of file")

    except (UnicodeDecodeError, IOError) as e:
        errors.append(f"{file_path}: Error reading file - {e}")

    return errors


def main():
    """Main validation entry point."""
    root = pathlib.Path(__file__).resolve().parent.parent
    docs_dir = root / "docs"

    if not docs_dir.exists():
        print("Warning: docs/ directory does not exist yet")
        return 0

    all_errors = []

    # Validate markdown files in docs/
    for md_file in docs_dir.rglob("*.md"):
        # Skip hidden files and macOS resource forks
        if md_file.name.startswith(".") or md_file.name.startswith("._"):
            continue

        errors = validate_markdown_file(md_file)
        all_errors.extend(errors)

    if all_errors:
        print("Documentation validation failed:")
        for error in all_errors:
            print(f"  - {error}")
        return 1

    print("Documentation validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
