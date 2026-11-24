
from pathlib import Path
from datetime import datetime
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from pprint import pformat
import json


# ==========================================================
# PROJECT EXPORT CONFIGURATION
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parent

OUTPUT_FILE = PROJECT_ROOT / "MoneyMind_AI_Project_Code.docx"

PROJECT_NAME = "MoneyMind AI"

# Folders that should never be exported.
EXCLUDED_DIRECTORIES = {
    "node_modules",
    "dist",
    "build",
    ".git",
    ".venv",
    "venv",
    "__pycache__",
    ".idea",
    ".vscode",
    "coverage",
    ".pytest_cache",
}

# File extensions to include.
INCLUDED_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".css",
    ".scss",
    ".html",
    ".json",
    ".md",
    ".txt",
    ".py",
    ".sql",
    ".cjs",
    ".mjs",
    ".yaml",
    ".yml",
    ".toml",
    ".xml",
    ".svg",
}

# Additional useful files without extensions.
INCLUDED_FILENAMES = {
    ".gitignore",
    ".npmrc",
    ".prettierrc",
    ".eslintrc",
    "Dockerfile",
    "Makefile",
}

# Never export these files.
EXCLUDED_FILENAMES = {
    ".env",
    "id_rsa",
    "id_ed25519",
}

# Allow example environment files, but never actual .env files.
MAX_FILE_SIZE = 1 * 1024 * 1024  # 1 MB per file


# ==========================================================
# FILE SCANNER
# ==========================================================

def should_include_file(file_path: Path) -> bool:
    relative_path = file_path.relative_to(PROJECT_ROOT)

    if any(part in EXCLUDED_DIRECTORIES for part in relative_path.parts):
        return False

    if file_path.name in EXCLUDED_FILENAMES:
        return False

    if file_path.name.startswith(".env") and file_path.name != ".env.example":
        return False

    if file_path.suffix.lower() in {".pem", ".key", ".p12", ".pfx"}:
        return False

    if file_path.suffix.lower() in INCLUDED_EXTENSIONS:
        return True

    if file_path.name in INCLUDED_FILENAMES:
        return True

    return False


def collect_project_files():
    files = {}
    skipped_files = []

    for file_path in sorted(PROJECT_ROOT.rglob("*")):

        if not file_path.is_file():
            continue

        if not should_include_file(file_path):
            continue

        relative_path = file_path.relative_to(PROJECT_ROOT).as_posix()

        try:
            if file_path.stat().st_size > MAX_FILE_SIZE:
                skipped_files.append({
                    "file_path": relative_path,
                    "reason": "File exceeds 1 MB limit"
                })
                continue

            content = file_path.read_text(
                encoding="utf-8",
                errors="strict"
            )

            files[relative_path] = {
                "type": "file",
                "file_path": relative_path,
                "file_type": file_path.suffix.lower() or "extensionless",
                "last_modified": datetime.fromtimestamp(
                    file_path.stat().st_mtime
                ).isoformat(timespec="seconds"),
                "content": content,
            }

        except (UnicodeDecodeError, OSError) as error:
            skipped_files.append({
                "file_path": relative_path,
                "reason": str(error)
            })

    return files, skipped_files


# ==========================================================
# BUILD FOLDER STRUCTURE
# ==========================================================

def build_file_structure(files):
    structure = {}

    for relative_path in files:
        parts = Path(relative_path).parts
        current = structure

        for part in parts[:-1]:
            current = current.setdefault(part, {})

        current[parts[-1]] = {
            "type": "file",
            "file_path": relative_path
        }

    return structure


# ==========================================================
# CREATE PROJECT DATA VARIABLE
# ==========================================================

def create_project_data(files, skipped_files):

    return {
        "project_name": PROJECT_NAME,

        "export_timestamp": datetime.now().astimezone().isoformat(
            timespec="seconds"
        ),

        "project_root_name": PROJECT_ROOT.name,

        "file_count": len(files),

        "file_structure": build_file_structure(files),

        "files": files,

        "skipped_files": skipped_files,
    }


# ==========================================================
# WORD DOCUMENT FORMATTING
# ==========================================================

def add_code_paragraph(document, code):

    for line in code.splitlines() or [""]:

        paragraph = document.add_paragraph()

        paragraph.paragraph_format.space_after = Pt(0)
        paragraph.paragraph_format.space_before = Pt(0)

        run = paragraph.add_run(line if line else " ")

        run.font.name = "Consolas"
        run.font.size = Pt(8)


def create_word_document(project_data):

    document = Document()

    section = document.sections[0]

    section.top_margin = Inches(0.6)
    section.bottom_margin = Inches(0.6)
    section.left_margin = Inches(0.7)
    section.right_margin = Inches(0.7)

    # ------------------------------------------------------
    # COVER PAGE
    # ------------------------------------------------------

    title = document.add_heading(PROJECT_NAME, 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    subtitle = document.add_paragraph(
        "Complete Project Source Code Archive"
    )
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER

    document.add_paragraph()

    document.add_heading("Export Information", level=1)

    document.add_paragraph(
        f"Project: {project_data['project_name']}"
    )

    document.add_paragraph(
        f"Files included: {project_data['file_count']}"
    )

    document.add_paragraph(
        f"Exported: {project_data['export_timestamp']}"
    )

    document.add_paragraph(
        "This document contains a structured PROJECT_DATA "
        "variable with the project structure and complete "
        "contents of the included files."
    )

    document.add_page_break()

    # ------------------------------------------------------
    # STRUCTURED PROJECT DATA
    # ------------------------------------------------------

    document.add_heading("PROJECT_DATA", level=1)

    document.add_paragraph(
        "The following is a Python-compatible variable. "
        "It contains the complete exported project snapshot."
    )

    project_data_code = (
        "PROJECT_DATA = "
        + pformat(
            project_data,
            width=100,
            sort_dicts=False
        )
    )

    add_code_paragraph(document, project_data_code)

    # ------------------------------------------------------
    # READABLE FILE INDEX
    # ------------------------------------------------------

    document.add_page_break()

    document.add_heading("Project File Index", level=1)

    for file_path in project_data["files"]:

        document.add_heading(file_path, level=2)

        document.add_paragraph(
            f"Type: {project_data['files'][file_path]['file_type']}"
        )

    # ------------------------------------------------------
    # SKIPPED FILES
    # ------------------------------------------------------

    if project_data["skipped_files"]:

        document.add_page_break()

        document.add_heading("Skipped Files", level=1)

        for item in project_data["skipped_files"]:
            document.add_paragraph(
                f"{item['file_path']} — {item['reason']}"
            )

    # ------------------------------------------------------
    # SAVE DOCUMENT
    # ------------------------------------------------------

    document.save(OUTPUT_FILE)


# ==========================================================
# MAIN EXECUTION
# ==========================================================

def main():

    print("Starting MoneyMind AI project export...")

    files, skipped_files = collect_project_files()

    if not files:
        print("No supported project files were found.")
        return

    project_data = create_project_data(
        files,
        skipped_files
    )

    create_word_document(project_data)

    print("\nExport completed successfully.")

    print(f"Files included: {len(files)}")

    print(f"Files skipped: {len(skipped_files)}")

    print(f"\nGenerated document:\n{OUTPUT_FILE}")


if __name__ == "__main__":
    main()
