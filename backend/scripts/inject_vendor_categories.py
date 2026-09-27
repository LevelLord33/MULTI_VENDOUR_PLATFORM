import re

for filepath in ['backend/data/seedData.js', 'frontend/src/data/seedData.js']:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    categories = {
        'v1': 'Electronics',
        'v2': 'Fashion',
        'v3': 'Grocery',
        'v4': 'Home & Living',
        'v5': 'Sports',
        'v6': 'Beauty',
        'v7': 'Home & Living',
        'v8': 'Home & Living',
        'v9': 'Home & Living',
        'v10': 'Electronics'
    }

    for vid, cat in categories.items():
        pattern = rf'("id":\s*"{vid}",\s*\n\s*"businessName":\s*"[^"]+",)'
        replacement = rf'\1\n    "category": "{cat}",'
        if f'"id": "{vid}"' in content and f'"category": "{cat}"' not in content:
            content = re.sub(pattern, replacement, content, count=1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Successfully injected vendor categories!")
