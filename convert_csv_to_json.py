#!/usr/bin/env python3
"""
Convert data.csv to data.json
"""
import csv
import json

def csv_to_json(csv_file, json_file):
    data = []
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        # Skip BOM if present
        content = f.read()
        if content.startswith('\ufeff'):
            content = content[1:]
        
        # Parse CSV
        csv_reader = csv.DictReader(content.splitlines())
        
        for row in csv_reader:
            # Skip empty rows or duplicate headers
            if row.get('ID') and row['ID'].strip() and not row['ID'].startswith('ID'):
                try:
                    data.append({
                        'id': int(row['ID'].strip()),
                        'category': row['Category'].strip(),
                        'content': row['Content'].strip(),
                        'penalty': row['Penalty'].strip(),
                        'difficulty': row['Difficulty'].strip()
                    })
                except (ValueError, KeyError) as e:
                    print(f"Skipping invalid row: {row} - Error: {e}")
                    continue
    
    # Write JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Converted {len(data)} cards from {csv_file} to {json_file}")

if __name__ == '__main__':
    csv_to_json('data.csv', 'data.json')
