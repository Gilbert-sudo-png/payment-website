import openpyxl
import os
import sqlite3
import re

excel_path = r"C:\Users\Gilbert\Documents\code files\payment website\Untitled form (Responses).xlsx"
txt_output_path = r"c:\Users\Gilbert\Documents\code files\payment website\backend\extracted_users.txt"
db_path = r"c:\Users\Gilbert\Documents\code files\payment website\backend\payments.db"

def process():
    if not os.path.exists(excel_path):
        print(f"ERROR: Excel file not found at {excel_path}")
        return

    print("Loading Excel workbook...")
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    sheet = wb.active
    print(f"Active sheet: {sheet.title}")

    # Read all rows
    rows = list(sheet.iter_rows(values_only=True))
    if not rows:
        print("ERROR: Excel sheet is empty")
        return

    headers = [str(h).strip().lower() if h is not None else "" for h in rows[0]]
    print(f"Detected Headers: {headers}")

    # Find column indices
    email_idx = -1
    matric_idx = -1
    name_idx = -1

    for idx, h in enumerate(headers):
        if "email" in h or "username" in h or "mail" in h:
            email_idx = idx
        elif "matric" in h or "matric number" in h or "matric no" in h:
            matric_idx = idx
        elif "name" in h or "fullname" in h:
            name_idx = idx

    # If some are not matched, look for fallbacks
    if email_idx == -1:
        # search for any header containing mail
        for idx, h in enumerate(headers):
            if "mail" in h:
                email_idx = idx
                break
    if matric_idx == -1:
        for idx, h in enumerate(headers):
            if "number" in h or "no" in h:
                matric_idx = idx
                break

    print(f"Mapped Column Indices -> Name: {name_idx}, Matric: {matric_idx}, Email: {email_idx}")

    if email_idx == -1 or matric_idx == -1 or name_idx == -1:
        print("ERROR: Could not map all required columns (Name, Matric, Email). Please check Excel headers.")
        return

    parsed_users = []
    for r_idx, row in enumerate(rows[1:], 2):
        if all(val is None for val in row):
            continue  # empty row
        
        name = str(row[name_idx]).strip() if row[name_idx] is not None else ""
        matric = str(row[matric_idx]).strip() if row[matric_idx] is not None else ""
        email = str(row[email_idx]).strip() if row[email_idx] is not None else ""

        # Basic cleanup
        if not name or not matric or not email:
            print(f"  Warning: Row {r_idx} is missing Name, Matric, or Email. Skipped.")
            continue

        # Format matric number cleanly (e.g. 25EG04011, replacing O with 0)
        matric = matric.upper().replace("O", "0")
        email = email.lower()

        parsed_users.append((name, matric, email))

    print(f"\nSuccessfully parsed {len(parsed_users)} students from Excel.")
    if parsed_users:
        print("Preview of first 3 students:")
        for u in parsed_users[:3]:
            print(f"  - Name: {u[0]} | Matric: {u[1]} | Email: {u[2]}")

    # 1. Write to extracted_users.txt
    print(f"\nWriting to {txt_output_path}...")
    with open(txt_output_path, "w", encoding="utf-8") as f:
        for name, matric, email in parsed_users:
            f.write(f"Name: {name}\n")
            f.write(f"Matric: {matric}\n")
            f.write(f"Email: {email}\n\n")
    print("Write complete.")

    # 2. Reset database and load new users
    if not os.path.exists(db_path):
        print(f"WARNING: SQLite database not found at {db_path}. Skip database reset.")
        return

    print(f"Connecting to database at {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Clear votes, student sessions, and existing students (except Admin)
        print("Clearing old votes and student sessions...")
        cursor.execute("DELETE FROM votes")
        cursor.execute("DELETE FROM sessions")
        
        print("Removing old student records...")
        cursor.execute("DELETE FROM users WHERE matric != 'ADMIN001'")
        
        # Reset system settings
        print("Resetting results visibility to hidden...")
        cursor.execute("INSERT OR REPLACE INTO system_settings (setting_key, setting_value) VALUES ('results_released', 'false')")

        # Let's import the new students directly!
        import bcrypt
        dummy_hash = bcrypt.hashpw(b"password123", bcrypt.gensalt(10)).decode('utf-8')
        
        print("Inserting new students into the database...")
        inserted_count = 0
        skipped_count = 0
        for name, matric, email in parsed_users:
            try:
                cursor.execute(
                    "INSERT INTO users (name, matric, email, password_hash) VALUES (?, ?, ?, ?)",
                    (name, matric, email, dummy_hash)
                )
                inserted_count += 1
            except sqlite3.IntegrityError:
                skipped_count += 1

        conn.commit()
        print(f"Database Reset Complete! Imported {inserted_count} new students. (Skipped duplicate matric/email: {skipped_count})")
    except Exception as dbe:
        conn.rollback()
        print(f"Database Error: {dbe}")
    finally:
        conn.close()

if __name__ == "__main__":
    process()
