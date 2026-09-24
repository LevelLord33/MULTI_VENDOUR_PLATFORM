import json
import os
import random

# Helper to create product dict
def make_product(
    p_id, vendor_id, sku, name, category, brand, price, mrp, stock,
    images, description, specs, weight, colors=None, options=None
):
    discount = round(((mrp - price) / mrp) * 100)
    rating = round(random.uniform(4.3, 4.9), 1)
    rev_count = random.randint(18, 95)
    
    if not colors:
        colors = [{"name": "Default", "hex": "#4F46E5", "inStock": True}]
    if not options:
        options = [{"label": "Standard Edition", "priceDelta": 0, "stock": stock}]
        
    reviews = [
        {
            "id": f"rev-{sku}-1",
            "customerName": "Arun Mehta",
            "rating": 5,
            "title": "Outstanding quality & fast doorstep courier dispatch",
            "comment": f"The {name} arrived sealed in original packaging with tax invoice. Verified authentic and performing flawlessly.",
            "date": "2024-09-02",
            "verified": True
        },
        {
            "id": f"rev-{sku}-2",
            "customerName": "Neha Singh",
            "rating": 5,
            "title": "Very impressed with seller packaging",
            "comment": "Secure courier delivery with live tracking via BlueDart. Genuine product as described.",
            "date": "2024-09-10",
            "verified": True
        },
        {
            "id": f"rev-{sku}-3",
            "customerName": "Siddharth Verma",
            "rating": 4,
            "title": "Excellent build quality",
            "comment": "Solid quality, premium materials, and fast dispatch from the merchant warehouse.",
            "date": "2024-09-15",
            "verified": True
        }
    ]
    
    inquiries = [
        {
            "id": f"qa-{sku}-1",
            "customerName": "Ramesh Gupta",
            "date": "2024-09-01",
            "question": f"Is this {name} brand new with official manufacturer warranty across India?",
            "answer": "Yes! Every single unit dispatched from our warehouse is brand new, sealed, and comes with an official GST tax invoice for full warranty coverage.",
            "answeredAt": "2024-09-01"
        }
    ]
    
    return {
        "id": p_id,
        "sku": sku,
        "name": name,
        "category": category,
        "brand": brand,
        "price": price,
        "mrp": mrp,
        "discountPercent": discount,
        "stock": stock,
        "quantity": stock,
        "barcode": f"890{random.randint(1000000000, 9999999999)}",
        "lowStockThreshold": 5,
        "reservedStock": 0,
        "warehouseLocation": f"Shelf {chr(65 + (int(p_id[1:]) % 8))}-{int(p_id[1:]) % 20 + 1}",
        "restockLeadDays": 3,
        "vendorId": vendor_id,
        "status": "approved",
        "images": images,
        "description": description,
        "condition": "Brand New (Sealed)",
        "specifications": specs,
        "shipping": {
            "weight": weight,
            "dispatchTime": "Ships within 24 hours",
            "estimatedDays": "2 - 4 days",
            "courierPartners": ["BlueDart Express", "Delhivery Surface", "DTDC Air"],
            "codAvailable": True,
            "returnWindowDays": 7
        },
        "variants": {
            "colors": colors,
            "options": options,
            "customization": {
                "allowGiftWrap": True,
                "allowEngraving": False,
                "warrantyPlans": [
                    {"id": "w1", "name": "1-Year Direct Brand Warranty", "price": 0, "duration": "1 Year"},
                    {"id": "w2", "name": "2-Year Extended Protection Plan", "price": 499, "duration": "2 Years"}
                ]
            }
        },
        "rating": rating,
        "reviewsCount": rev_count,
        "reviews": reviews,
        "inquiries": inquiries,
        "createdAt": f"2024-0{random.randint(6, 9)}-{random.randint(10, 28):02d}"
    }

print("make_product helper loaded.")
