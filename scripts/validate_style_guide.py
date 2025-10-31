#!/usr/bin/env python3
"""
Validate code compliance with The Dukes Engineering Style Guide.

This script checks that code files follow the standards defined in:
https://tydukes.github.io/coding-style-guide/

Key validations:
- TypeScript files should have @module metadata tags
- Proper file header comments
- Consistent formatting (enforced via ESLint/Prettier)
"""
import pathlib
import re
import sys
from typing import List, Tuple


def validate_typescript_file(file_path: pathlib.Path) -> List[str]:
    """
    Validate a TypeScript file against style guide requirements.

    Args:
        file_path: Path to the TypeScript file

    Returns:
        List of validation errors (empty if valid)
    """
    errors = []

    try:
        content = file_path.read_text(encoding="utf-8")
        lines = content.splitlines()

        # Skip empty files
        if not lines or not content.strip():
            return errors

        # Skip test files and config files (they don't need @module tags)
        if any(
            pattern in file_path.name
            for pattern in [".test.", ".spec.", ".config.", "vitest.config"]
        ):
            return errors

        # Check for @module tag in the first 20 lines (flexible header location)
        has_module_tag = False
        for i, line in enumerate(lines[:20]):
            if "@module" in line or "@module:" in line:
                has_module_tag = True
                break

        # TypeScript source files (not .d.ts) should have module tags
        if file_path.suffix == ".ts" and not file_path.name.endswith(".d.ts"):
            # Only enforce for non-trivial files (> 10 lines)
            if len(lines) > 10 and not has_module_tag:
                errors.append(
                    f"{file_path}: Missing @module metadata tag. "
                    f"Add a comment like: // @module: package-name"
                )

    except (UnicodeDecodeError, IOError) as e:
        errors.append(f"{file_path}: Error reading file - {e}")

    return errors


def validate_package_structure(root: pathlib.Path) -> List[str]:
    """
    Validate that packages follow monorepo structure conventions.

    Args:
        root: Root directory of the repository

    Returns:
        List of validation errors
    """
    errors = []
    packages_dir = root / "packages"

    if not packages_dir.exists():
        return errors

    # Each package should have package.json, tsconfig.json, src/ directory
    for package_dir in packages_dir.iterdir():
        if not package_dir.is_dir() or package_dir.name.startswith("."):
            continue

        required_files = ["package.json", "tsconfig.json"]
        for required_file in required_files:
            if not (package_dir / required_file).exists():
                errors.append(
                    f"{package_dir.name}: Missing required file: {required_file}"
                )

        # Check for src/ directory
        src_dir = package_dir / "src"
        if not src_dir.exists():
            errors.append(f"{package_dir.name}: Missing src/ directory")

    return errors


def main():
    """Main validation entry point."""
    root = pathlib.Path(__file__).resolve().parent.parent
    all_errors = []

    print("Validating code against The Dukes Engineering Style Guide...")
    print(f"Style Guide: https://tydukes.github.io/coding-style-guide/\n")

    # Validate package structure
    structure_errors = validate_package_structure(root)
    all_errors.extend(structure_errors)

    # Validate TypeScript files in packages/
    packages_dir = root / "packages"
    if packages_dir.exists():
        ts_files = list(packages_dir.rglob("*.ts")) + list(packages_dir.rglob("*.tsx"))

        # Exclude node_modules and dist directories
        ts_files = [
            f
            for f in ts_files
            if "node_modules" not in str(f) and "dist" not in str(f)
        ]

        print(f"Checking {len(ts_files)} TypeScript files...")

        for ts_file in ts_files:
            errors = validate_typescript_file(ts_file)
            all_errors.extend(errors)

    if all_errors:
        print("\n❌ Style guide validation failed:\n")
        for error in all_errors[:50]:  # Limit output
            print(f"  - {error}")
        if len(all_errors) > 50:
            print(f"\n  ... and {len(all_errors) - 50} more errors")
        print(
            f"\n💡 See style guide: https://tydukes.github.io/coding-style-guide/"
        )
        return 1

    print("✅ Style guide validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
