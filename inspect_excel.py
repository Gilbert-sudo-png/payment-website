import openpyxl

file_path = r"C:\Users\Gilbert\Documents\code files\payment website\Untitled form (Responses).xlsx"
try:
    wb = openpyxl.load_workbook(file_path, read_only=True)
    sheet = wb.active
    print("Sheet name:", sheet.title)
    
    # Get first 3 rows
    for r_idx, row in enumerate(sheet.iter_rows(values_only=True), 1):
        if r_idx > 3:
            break
        print(f"Row {r_idx}:", row)
except Exception as e:
    print("Error:", e)
