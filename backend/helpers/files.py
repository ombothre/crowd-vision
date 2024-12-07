import csv
from vcs.consts import ALLOWED_EXT

def make_csv(data: dict, csv_path: str) -> None:
    with open(csv_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Time(s)', 'Persons Detected'])
        for timestamp, person in data.items():
            writer.writerow([timestamp, person])

def is_allowed(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT