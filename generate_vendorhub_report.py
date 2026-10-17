import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def format_table(tbl, col_widths, headers, data, header_bg="1E3A8A", alt_bg="F8FAFC"):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    set_table_borders(tbl, color="CBD5E1")
    
    # Header row
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=130, bottom=130, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            run.font.size = Pt(9.5)
            run.font.name = "Arial"
            
    # Data rows
    for row_idx, row_data in enumerate(data):
        row_cells = tbl.add_row().cells
        bg = alt_bg if row_idx % 2 == 1 else "FFFFFF"
        for i, val in enumerate(row_data):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg)
            set_cell_margins(row_cells[i], top=90, bottom=90, left=140, right=140)
            p = row_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.size = Pt(9)
                run.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
                run.font.name = "Arial"
                
    # Width enforcement
    for row in tbl.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = Inches(width)

def add_image_placeholder(doc, fig_label, title, caption_text, width_in=6.5, height_in=2.5):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(width_in)
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=160, bottom=160, left=160, right=160)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="dashed" w:sz="12" w:space="0" w:color="64748B"/>'
        f'<w:bottom w:val="dashed" w:sz="12" w:space="0" w:color="64748B"/>'
        f'<w:left w:val="dashed" w:sz="12" w:space="0" w:color="64748B"/>'
        f'<w:right w:val="dashed" w:sz="12" w:space="0" w:color="64748B"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    
    run_icon = p.add_run("📷 [UPLOAD IMAGE HERE]\n")
    run_icon.bold = True
    run_icon.font.size = Pt(10.5)
    run_icon.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    run_icon.font.name = "Arial"
    
    run_desc = p.add_run(f"{fig_label}: {title}\n(Paste screenshot here — recommended size: {width_in}\" × {height_in}\")")
    run_desc.font.size = Pt(9)
    run_desc.font.italic = True
    run_desc.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
    run_desc.font.name = "Arial"
    
    p_caption = doc.add_paragraph()
    p_caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_caption.paragraph_format.space_before = Pt(6)
    p_caption.paragraph_format.space_after = Pt(2)
    run_fig = p_caption.add_run(f"{fig_label} {title}")
    run_fig.italic = True
    run_fig.bold = True
    run_fig.font.size = Pt(9.5)
    run_fig.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    run_fig.font.name = "Arial"
    
    if caption_text:
        p_desc = doc.add_paragraph()
        p_desc.paragraph_format.space_before = Pt(2)
        p_desc.paragraph_format.space_after = Pt(8)
        run_text = p_desc.add_run(caption_text)
        run_text.font.size = Pt(9.5)
        run_text.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        run_text.font.name = "Arial"

def add_full_page_diagram_placeholder(doc, chapter_num, chapter_title, fig_num, fig_title, instructions):
    doc.add_page_break()
    p_num = doc.add_paragraph()
    p_num.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_num.paragraph_format.space_before = Pt(36)
    p_num.paragraph_format.space_after = Pt(4)
    r1 = p_num.add_run(f"CHAPTER {chapter_num}")
    r1.bold = True
    r1.font.size = Pt(15)
    r1.font.name = "Arial"
    r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(28)
    r2 = p_title.add_run(chapter_title)
    r2.bold = True
    r2.font.size = Pt(17)
    r2.font.name = "Arial"
    r2.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    
    # Large blank box
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=1400, bottom=1400, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="dashed" w:sz="16" w:space="0" w:color="94A3B8"/>'
        f'<w:bottom w:val="dashed" w:sz="16" w:space="0" w:color="94A3B8"/>'
        f'<w:left w:val="dashed" w:sz="16" w:space="0" w:color="94A3B8"/>'
        f'<w:right w:val="dashed" w:sz="16" w:space="0" w:color="94A3B8"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_ph = p.add_run(f"🖼️ [FULL-PAGE DIAGRAM PLACEHOLDER]\n\n")
    r_ph.bold = True
    r_ph.font.size = Pt(14)
    r_ph.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    r_ph.font.name = "Arial"
    
    r_inst = p.add_run(f"PASTE YOUR COMPLETED {chapter_title.upper()} HERE\n\n{instructions}")
    r_inst.font.size = Pt(10)
    r_inst.font.italic = True
    r_inst.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)
    r_inst.font.name = "Arial"
    
    p_fig = doc.add_paragraph()
    p_fig.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_fig.paragraph_format.space_before = Pt(24)
    p_fig.paragraph_format.space_after = Pt(24)
    r_f = p_fig.add_run(f"Fig {fig_num} {fig_title}")
    r_f.italic = True
    r_f.bold = True
    r_f.font.size = Pt(10)
    r_f.font.name = "Arial"
    r_f.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

def add_chapter_heading(doc, num, title):
    doc.add_page_break()
    p_num = doc.add_paragraph()
    p_num.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_num.paragraph_format.space_before = Pt(20)
    p_num.paragraph_format.space_after = Pt(4)
    r1 = p_num.add_run(f"CHAPTER {num}")
    r1.bold = True
    r1.font.size = Pt(14)
    r1.font.name = "Arial"
    r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(18)
    r2 = p_title.add_run(title)
    r2.bold = True
    r2.font.size = Pt(16)
    r2.font.name = "Arial"
    r2.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

def add_subheading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(11.5)
    r.font.name = "Arial"
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

def add_p(doc, text, bold=False, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.size = Pt(10)
    r.font.name = "Arial"
    r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
    return p

def add_bullet(doc, title, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.line_spacing = 1.15
    
    r_dot = p.add_run("● ")
    r_dot.font.size = Pt(8.5)
    r_dot.font.name = "Arial"
    r_dot.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    
    r_title = p.add_run(f"{title}: ")
    r_title.bold = True
    r_title.font.size = Pt(9.5)
    r_title.font.name = "Arial"
    r_title.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    r_text = p.add_run(text)
    r_text.font.size = Pt(9.5)
    r_text.font.name = "Arial"
    r_text.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

def build_full_report():
    doc = Document()
    
    # Page setup
    for sec in doc.sections:
        sec.top_margin = Inches(0.8)
        sec.bottom_margin = Inches(0.8)
        sec.left_margin = Inches(0.9)
        sec.right_margin = Inches(0.9)
        
    style_normal = doc.styles['Normal']
    font_normal = style_normal.font
    font_normal.name = 'Arial'
    font_normal.size = Pt(10)
    font_normal.color.rgb = RGBColor(0x1F, 0x29, 0x37)
    
    # ==================== PAGE 1: TITLE PAGE ====================
    p_t = doc.add_paragraph()
    p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t.paragraph_format.space_before = Pt(72)
    p_t.paragraph_format.space_after = Pt(6)
    r = p_t.add_run("VENDORHUB: MULTI-VENDOR MARKETPLACE PLATFORM\nWITH ZERO-GHOST INVENTORY & ROLE-BASED GOVERNANCE")
    r.bold = True
    r.font.size = Pt(17)
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    p_c = doc.add_paragraph()
    p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c.paragraph_format.space_before = Pt(18)
    p_c.paragraph_format.space_after = Pt(36)
    r = p_c.add_run("23CS54C – MODERN WEB TECHNOLOGIES")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(8)
    r = p_sub.add_run("Submitted by")
    r.italic = True
    r.font.size = Pt(12)
    
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_after = Pt(36)
    r = p_name.add_run("Hariharasudhan M - 2403957610421120")
    r.bold = True
    r.font.size = Pt(14)
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    
    p_deg = doc.add_paragraph()
    p_deg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_deg.paragraph_format.space_after = Pt(4)
    r = p_deg.add_run("In partial fulfillment for the award of the degree\nof\n")
    r.italic = True
    r.font.size = Pt(11)
    r_deg = p_deg.add_run("BACHELOR OF ENGINEERING\nin\nCOMPUTER SCIENCE AND ENGINEERING")
    r_deg.bold = True
    r_deg.font.size = Pt(13)
    
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(48)
    p_inst.paragraph_format.space_after = Pt(0)
    r = p_inst.add_run("NATIONAL ENGINEERING COLLEGE\n(An Autonomous Institution affiliated to Anna University, Chennai)\nK.R.NAGAR, KOVILPATTI - 628503\n\nOCTOBER - 2026")
    r.bold = True
    r.font.size = Pt(11.5)
    
    # ==================== PAGE 2: BONAFIDE CERTIFICATE ====================
    doc.add_page_break()
    p_p2 = doc.add_paragraph()
    p_p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_p2.add_run("1")
    r.font.size = Pt(10)
    
    p_inst2 = doc.add_paragraph()
    p_inst2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst2.paragraph_format.space_before = Pt(36)
    p_inst2.paragraph_format.space_after = Pt(28)
    r = p_inst2.add_run("NATIONAL ENGINEERING COLLEGE\n(An Autonomous Institution affiliated to Anna University, Chennai)\nK.R.NAGAR, KOVILPATTI - 628503\n\nBONAFIDE CERTIFICATE")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    p_cert = doc.add_paragraph()
    p_cert.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert.paragraph_format.space_before = Pt(24)
    p_cert.paragraph_format.space_after = Pt(48)
    p_cert.paragraph_format.line_spacing = 1.3
    r = p_cert.add_run("This is to certify that this project report, ")
    r.font.size = Pt(11)
    r_t = p_cert.add_run("“VendorHub: Multi-Vendor Marketplace Platform”")
    r_t.bold = True
    r_t.font.size = Pt(11)
    r = p_cert.add_run(", is the bonafide work of ")
    r.font.size = Pt(11)
    r_n = p_cert.add_run("Hariharasudhan M (2403957610421120)")
    r_n.bold = True
    r_n.font.size = Pt(11)
    r = p_cert.add_run(" who carried out the project work under my supervision.")
    r.font.size = Pt(11)
    
    p_guide = doc.add_paragraph()
    p_guide.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_guide.paragraph_format.space_before = Pt(40)
    p_guide.paragraph_format.space_after = Pt(64)
    r = p_guide.add_run("Course Instructor / Guide\n\n\n________________________________")
    r.bold = True
    r.font.size = Pt(11)
    
    p_viva = doc.add_paragraph()
    p_viva.paragraph_format.space_after = Pt(48)
    r = p_viva.add_run("Submitted to the ")
    r.font.size = Pt(11)
    r_c = p_viva.add_run("23CS54C – MODERN WEB TECHNOLOGIES")
    r_c.bold = True
    r_c.font.size = Pt(11)
    r = p_viva.add_run(" Viva-Voce examination held at National Engineering College, K.R.Nagar, Kovilpatti on ___________________")
    r.font.size = Pt(11)
    
    tbl_sign = doc.add_table(rows=1, cols=2)
    tbl_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sign.autofit = False
    tbl_sign.rows[0].cells[0].width = Inches(3.2)
    tbl_sign.rows[0].cells[1].width = Inches(3.2)
    p_int = tbl_sign.rows[0].cells[0].paragraphs[0]
    p_int.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p_int.add_run("Internal Examiner\n\n___________________________")
    r.bold = True
    r.font.size = Pt(11)
    p_ext = tbl_sign.rows[0].cells[1].paragraphs[0]
    p_ext.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_ext.add_run("Co Examiner\n\n___________________________")
    r.bold = True
    r.font.size = Pt(11)
    
    # ==================== PAGE 3: TABLE OF CONTENTS ====================
    doc.add_page_break()
    p_p3 = doc.add_paragraph()
    p_p3.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_p3.add_run("2")
    r.font.size = Pt(10)
    
    p_toc = doc.add_paragraph()
    p_toc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc.paragraph_format.space_before = Pt(24)
    p_toc.paragraph_format.space_after = Pt(20)
    r = p_toc.add_run("TABLE OF CONTENTS")
    r.bold = True
    r.font.size = Pt(15)
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    toc_data = [
        ["1", "INTRODUCTION", "3"],
        ["2", "OBJECTIVES", "4"],
        ["3", "DESCRIPTION", "5"],
        ["4", "CLASS DIAGRAM", "6"],
        ["5", "TABLE STRUCTURES", "7"],
        ["6", "ER DIAGRAM", "13"],
        ["7", "TECH STACK & ARCHITECTURE", "14"],
        ["8", "MODULES", "15"],
        ["", "8.0 Design Approach & Shared System Baseline", "15"],
        ["", "8.1 Folder Structure", "17"],
        ["", "8.2 User Authentication & Multi-Role Access Control (RBAC)", "22"],
        ["", "8.3 Vendor Onboarding, Storefront Builder & Catalog Governance", "29"],
        ["", "8.4 Physical Product Catalog & Warehouse Inventory Management", "35"],
        ["", "8.5 Multi-Vendor Cart, Split Orders & Checkout (Razorpay/UPI/COD)", "42"],
        ["", "8.6 Real-Time Logistics Dispatch & 4-Digit OTP Doorstep Handover", "49"],
        ["", "8.7 Post-Delivery Dispute Resolution, Claims & Warranty Arbitration", "56"],
        ["", "8.8 Executive Dashboard, Vendor Settlements & Subscriptions", "62"],
        ["", "8.9 Hub Assistant AI, Real-Time Messaging & Multilingual Localization", "69"],
        ["9", "CONCLUSION", "75"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [0.8, 4.7, 1.0], ["CH NO", "TITLE", "PAGE NO"], toc_data, header_bg="1E3A8A")
    
    # ==================== CHAPTER 1: INTRODUCTION ====================
    add_chapter_heading(doc, "1", "INTRODUCTION")
    add_p(doc, "In the fast-growing e-commerce and retail sector, modern digital commerce has evolved from single-merchant webshops into distributed, multi-vendor marketplaces. In conventional marketplaces, retail operations face severe friction: disjointed vendor onboarding, high incidence of 'ghost inventory' (where unverified sellers list out-of-stock or non-existent items), lack of transparent administrative product verification, uncoordinated multi-vendor fulfillment, and vulnerable delivery handoffs prone to customer claim disputes. Handling catalog governance, merchant commissions, physical stock reservations, and post-delivery claims through disparate spreadsheets and unintegrated software causes severe delivery delays, financial leakage, and eroded customer trust.")
    add_p(doc, "VendorHub is an enterprise-grade, full-stack multi-vendor marketplace and logistics governance platform engineered to digitize, unify, and automate the end-to-end lifecycle of multi-merchant commerce. Built exclusively for physical inventory, VendorHub bridges local independent merchants, automated warehouse logistics, administrative quality auditors, and end consumers under a synchronized digital ecosystem.")
    add_p(doc, "The platform is architected into four core functional domains: Multi-Tenant Master Data Management, which governs verified merchant profiles, tax identifiers (GSTIN), categorized physical products, and customer directories; Transaction Management, which coordinates multi-vendor cart splitting, atomic warehouse stock decrements, Razorpay payment capture, dynamic UPI QR generation, and Cash on Delivery (COD) workflows; Logistics & Delivery Governance, which enforces tamper-proof doorstep handoffs authenticated through automated 4-digit one-time passwords (OTP); and Mediation & Analytics, providing two-tier dispute resolution, merchant revenue settlements, subscription tier control, and real-time executive telemetry.")
    add_p(doc, "VendorHub is constructed as a modern Single-Page Application (SPA) leveraging React 18 and Vite for ultra-fast client reactivity, coupled with a stateless Node.js and Express RESTful API backend, and a high-throughput MongoDB Atlas document database. The application incorporates Role-Based Access Control (RBAC) across Customer, Vendor, and Super Administrator portals, dual-mode resilient in-memory database fallback, native multilingual support in six Indian languages, and comprehensive audit activity logging. This report details the complete engineering specification, schema design, architectural patterns, and functional modules of VendorHub.")
    
    # ==================== CHAPTER 2: OBJECTIVES ====================
    add_chapter_heading(doc, "2", "OBJECTIVES")
    add_bullet(doc, "To Digitize and Unify Multi-Vendor Retail", "Replace fragmented seller software, manual order books, and disparate delivery tools with a unified digital multi-merchant platform to maximize operational transparency.")
    add_bullet(doc, "To Enforce Physical Inventory Integrity (Zero-Ghost Inventory)", "Ensure every listed SKU represents physically stocked merchandise in verified merchant warehouses, backed by real-time atomic decrements on checkout to eliminate overselling.")
    add_bullet(doc, "To Centralize Master Data Management", "Maintain strict, synchronized records across multi-tenant merchant storefronts, product specifications, physical SKU barcodes, categories, and customer accounts.")
    add_bullet(doc, "To Implement Two-Tier Product Catalog Governance", "Enforce an administrative inspection and approval queue where every merchant submission is scrutinized before public marketplace publication, with complete rejection audit trails.")
    add_bullet(doc, "To Deliver High-Speed Omnichannel Checkout", "Support seamless customer transactions through Razorpay payment gateway integration, instant dynamic UPI QR codes, and Cash on Delivery.")
    add_bullet(doc, "To Enforce Tamper-Proof Doorstep Delivery Handover", "Protect merchant shipments and customer orders against fraudulent claims by automating encrypted 4-digit doorstep delivery OTP verification during handover.")
    add_bullet(doc, "To Automate Courier Dispatch and Order Tracking", "Provide automated dispatch stage transitions (Confirmed, Packed, Out for Delivery, Delivered) with live status timelines for customers and vendors.")
    add_bullet(doc, "To Provide Post-Delivery Dispute Mediation & Claims Arbitration", "Implement a formal dispute resolution portal allowing customers to file claims with evidence, enabling vendors to offer explanations, and empowering administrators to arbitrate settlements.")
    add_bullet(doc, "To Enforce Role-Based Access Control (RBAC)", "Protect sensitive operations using JSON Web Tokens (JWT) and guarded routing across Customer, Merchant Vendor, and Super Administrator tiers.")
    add_bullet(doc, "To Deliver Real-Time Executive & Vendor Financial Analytics", "Present live dashboards with Gross Merchandise Value (GMV), platform fee cuts, merchant payouts, low-stock alerts, and automated GST-compliant tax invoices.")
    add_bullet(doc, "To Provide Multilingual Regional Accessibility", "Deliver 100% UI translation and regional accessibility across six Indian languages (English, Tamil, Hindi, Malayalam, Telugu, Kannada) to empower diverse merchant and consumer demographics.")
    add_bullet(doc, "To Deploy a Modular, Scalable, and Resilient Architecture", "Implement a decoupled MERN stack with stateless REST APIs, MongoDB connection pooling, automated in-memory fallback, and rate limiting to ensure 99.9% operational uptime.")
    
    # ==================== CHAPTER 3: DESCRIPTION ====================
    add_chapter_heading(doc, "3", "DESCRIPTION")
    add_p(doc, "VendorHub is a full-stack, enterprise-grade web application developed to coordinate and automate multi-tenant merchant commerce, physical warehouse inventory, and secure delivery logistics. The system comprises five primary operational pillars:")
    add_subheading(doc, "1. Master Data & Multi-Tenant Merchant Management")
    add_p(doc, "This pillar governs verified merchant profiles, business licensing credentials, GSTIN identifiers, customer directories, and multi-level product categories. It provides vendors with an interactive Storefront Builder to customize their digital storefront branding while maintaining strict platform compliance.")
    add_subheading(doc, "2. Inventory & Physical Warehouse Operations")
    add_p(doc, "This module enforces a zero-ghost inventory model. Every listed SKU is tracked with warehouse location tags, physical stock counts, and low-stock reorder thresholds. The system executes atomic MongoDB decrements upon checkout and logs all adjustments into an immutable stock movement audit trail.")
    add_subheading(doc, "3. Checkout, Split Payments & Secure Logistics Delivery")
    add_p(doc, "Customers browse products from multiple merchants within a unified cart. The checkout engine calculates item taxes, platform commissions, and multi-vendor splits. Transactions are fulfilled via Razorpay, dynamic UPI QR, or Cash on Delivery. Orders are linked to automated dispatch workflows requiring an encrypted 4-digit OTP at the customer's doorstep.")
    add_subheading(doc, "4. Dispute Governance, Invoicing & Financial Settlement")
    add_p(doc, "Post-delivery customer grievances (damaged goods, incorrect items) are processed through an interactive dispute resolution center with document evidence upload. Platform administrators inspect audit logs, arbitrate claims, and execute vendor chargebacks or refunds. The module also generates GST-compliant invoices and calculates vendor subscription tiers.")
    add_subheading(doc, "5. Technology, Security & Scalable Deployment")
    add_p(doc, "The application combines React 18, Vite, and custom CSS tokens on the client with Node.js, Express, and MongoDB on the server. Security is fortified with bcrypt password hashing, stateless JWT session tokens, Helmet security headers, CORS origin whitelisting, and express-rate-limit brute force guards.")
    
    # ==================== CHAPTER 4: CLASS DIAGRAM ====================
    add_full_page_diagram_placeholder(doc, "4", "CLASS DIAGRAM", "4.1", "VendorHub Unified Object-Oriented Class Architecture Diagram", "Please paste your high-resolution Class Diagram image in the area above.\nThe diagram illustrates the relationships between User (Base), Customer, Vendor, Admin, Product, Order, OrderItem, Dispute, Invoice, StockMovement, VendorSubscription, and ActivityLog classes.")
    
    # ==================== CHAPTER 5: TABLE STRUCTURES ====================
    add_chapter_heading(doc, "5", "TABLE STRUCTURES")
    add_p(doc, "VendorHub utilizes a highly normalized and performant MongoDB document schema managed through Mongoose ODM. Schemas are architected for rapid catalog reads, multi-vendor order aggregations, and strict atomic consistency during stock reservations. The detailed schema definitions are tabulated below:")
    
    # Users
    add_subheading(doc, "Users Collection (users) :")
    users_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the user account"],
        ["name", "String", "Required, Trim", "Full name of the user or authorized representative"],
        ["email", "String", "Required, Unique, Lowercase", "Unique login email address"],
        ["password", "String", "Required (Hashed)", "Bcrypt hashed password (cost factor = 10)"],
        ["role", "String", "Enum (customer, vendor, admin)", "Role-based access level for system authorization"],
        ["phone", "String", "Optional", "Contact phone number for notifications and OTP"],
        ["vendorProfile", "Subdoc", "Optional", "Business name, GSTIN, store description, logo, address"],
        ["status", "String", "Enum (active, suspended, pending)", "Account status; default is active"],
        ["isVerified", "Boolean", "Default: false", "Email / KYC verification status flag"],
        ["createdAt / updatedAt", "Date", "Timestamps", "Automatic creation and audit modification timestamps"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], users_data)
    
    # Products
    add_subheading(doc, "Products Collection (products) :")
    products_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the product item"],
        ["vendor", "ObjectId", "Ref: User, Required, Index", "Merchant owning the listed merchandise"],
        ["name", "String", "Required, Index", "Official product title and trade name"],
        ["sku", "String", "Required, Unique, Uppercase", "Unique merchant Stock Keeping Unit identifier"],
        ["barcode", "String", "Required, Unique, Index", "EAN-13 / UPC physical barcode string"],
        ["category", "String", "Required, Index", "Category taxonomy (Electronics, Fashion, Grocery...)"],
        ["price", "Number", "Required, Min: 0", "Selling retail price in INR (₹)"],
        ["mrp", "Number", "Required, Min: 0", "Maximum Retail Price for discount calculations"],
        ["stock", "Number", "Required, Min: 0", "Current physical warehouse quantity on-hand"],
        ["lowStockThreshold", "Number", "Default: 5", "Trigger threshold for low-stock vendor notifications"],
        ["approvalStatus", "String", "Enum (pending, approved, rejected)", "Admin catalog governance status; default: pending"],
        ["rejectionReason", "String", "Optional", "Mandatory audit explanation when admin rejects listing"],
        ["images", "Array[String]", "Required", "Array of high-resolution product image URLs"],
        ["isPhysical", "Boolean", "Default: true", "Enforces physical inventory logistics compliance"],
        ["createdAt / updatedAt", "Date", "Timestamps", "Automatic creation and audit modification timestamps"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], products_data)
    
    # Orders
    add_subheading(doc, "Orders Collection (orders) :")
    orders_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the order record"],
        ["orderNumber", "String", "Required, Unique, Index", "Human-readable order tracking ID (e.g., ORD-2026-9821)"],
        ["customer", "ObjectId", "Ref: User, Required, Index", "Customer who placed the purchase"],
        ["items", "Array[Subdoc]", "Required, Non-empty", "List of SKUs, vendor ID, quantity, unit price, tax"],
        ["totalAmount", "Number", "Required, Min: 0", "Net payable order value in INR (₹)"],
        ["paymentMethod", "String", "Enum (razorpay, upi, cod)", "Chosen payment channel for the order"],
        ["paymentStatus", "String", "Enum (pending, paid, failed)", "Payment gateway confirmation state"],
        ["deliveryStatus", "String", "Enum (Processing, Dispatched, Delivered, Cancelled)", "Logistics fulfillment lifecycle status"],
        ["deliveryOtp", "String", "4-digit String, Encrypted", "Tamper-proof OTP required for doorstep handover"],
        ["deliveryAddress", "Subdoc", "Required", "Street, city, postal code, recipient phone"],
        ["courierPartner", "String", "Optional", "Assigned logistics carrier (BlueDart, Delhivery, etc.)"],
        ["trackingNumber", "String", "Optional", "Consignment tracking number for courier dispatch"],
        ["createdAt / updatedAt", "Date", "Timestamps, Index", "Transaction and modification timestamps"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], orders_data)
    
    # Vendor Applications
    add_subheading(doc, "Vendor Applications Collection (vendorapplications) :")
    vendor_apps_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the onboarding application"],
        ["userId", "ObjectId", "Ref: User, Required, Unique", "User account requesting merchant registration"],
        ["businessName", "String", "Required, Trim", "Registered enterprise or storefront name"],
        ["gstin", "String", "Required, 15-char Regex", "Government GST Identification Number"],
        ["panNumber", "String", "Required, 10-char Regex", "Permanent Account Number for tax audits"],
        ["storeCategory", "String", "Required", "Primary business merchandise category"],
        ["pickupAddress", "Subdoc", "Required", "Physical warehouse address for courier pickups"],
        ["status", "String", "Enum (pending, approved, rejected)", "Application review status; default: pending"],
        ["rejectionNotes", "String", "Optional", "Auditor feedback explaining rejection reason"],
        ["reviewedBy", "ObjectId", "Ref: User, Optional", "Admin account that reviewed the application"],
        ["createdAt / updatedAt", "Date", "Timestamps", "Application submission and decision dates"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], vendor_apps_data)
    
    # Stock Movements
    add_subheading(doc, "Stock Movements Collection (stockmovements) :")
    stock_mov_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the stock movement ledger entry"],
        ["product", "ObjectId", "Ref: Product, Required, Index", "Target product SKU modified"],
        ["vendor", "ObjectId", "Ref: User, Required", "Merchant owning the inventory"],
        ["movementType", "String", "Enum (intake, order_deduct, audit_adjust, return_restock)", "Categorization of stock balance change"],
        ["quantityDelta", "Number", "Required", "Signed change in inventory (+/- integer units)"],
        ["stockAfter", "Number", "Required, Min: 0", "Resulting physical balance after the movement"],
        ["referenceId", "String", "Optional", "Order ID, intake consignment, or dispute ticket"],
        ["reason", "String", "Optional", "Audit explanation for manual corrections"],
        ["performedBy", "ObjectId", "Ref: User, Required", "User or automated worker initiating update"],
        ["createdAt", "Date", "Index, Default: Date.now", "Timestamp of inventory transaction"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], stock_mov_data)
    
    # Disputes
    add_subheading(doc, "Disputes Collection (disputes) :")
    disputes_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the customer dispute ticket"],
        ["order", "ObjectId", "Ref: Order, Required, Index", "Associated order containing disputed items"],
        ["customer", "ObjectId", "Ref: User, Required", "Customer who initiated the grievance"],
        ["vendor", "ObjectId", "Ref: User, Required", "Merchant responsible for the merchandise"],
        ["reason", "String", "Enum (Damaged, Wrong Item, Missing Item, Defective)", "Official category of customer grievance"],
        ["description", "String", "Required", "Detailed explanation of customer claim"],
        ["evidenceImages", "Array[String]", "Optional", "URLs of unboxing photos or damage evidence"],
        ["status", "String", "Enum (open, vendor_responded, resolved, rejected)", "Lifecycle status of dispute ticket"],
        ["vendorResponse", "String", "Optional", "Merchant's clarification or resolution offer"],
        ["resolutionOutcome", "String", "Enum (Refund Issued, Replacement Sent, Claim Dismissed)", "Final arbitration decision by Admin"],
        ["resolvedBy", "ObjectId", "Ref: User, Optional", "Admin superuser who resolved the claim"],
        ["createdAt / updatedAt", "Date", "Timestamps", "Filing and resolution audit timestamps"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], disputes_data)
    
    # Invoices
    add_subheading(doc, "Invoices Collection (invoices) :")
    invoices_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the tax invoice document"],
        ["invoiceNumber", "String", "Required, Unique, Index", "Sequential GST invoice ID (e.g., INV-2026-0045)"],
        ["order", "ObjectId", "Ref: Order, Required", "Order reference for the invoice"],
        ["vendor", "ObjectId", "Ref: User, Required", "Merchant entity issuing the tax invoice"],
        ["customer", "ObjectId", "Ref: User, Required", "Billing customer recipient"],
        ["subtotal", "Number", "Required", "Taxable merchandise total (₹)"],
        ["cgstAmount", "Number", "Required", "Central GST tax calculated (e.g., 9%)"],
        ["sgstAmount", "Number", "Required", "State GST tax calculated (e.g., 9%)"],
        ["totalAmount", "Number", "Required", "Gross invoice value inclusive of all taxes"],
        ["pdfUrl", "String", "Optional", "Storage URL for downloadable PDF tax invoice"],
        ["createdAt", "Date", "Timestamps, Index", "Date and time of invoice generation"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], invoices_data)
    
    # Vendor Subscriptions
    add_subheading(doc, "Vendor Subscriptions Collection (vendorsubscriptions) :")
    sub_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for merchant subscription tier"],
        ["vendor", "ObjectId", "Ref: User, Required, Unique", "Subscribed merchant user account"],
        ["planName", "String", "Enum (Starter, Professional, Enterprise)", "Active tier determining catalog SKU limits"],
        ["productLimit", "Number", "Required", "Maximum physical SKUs allowed (50 / 500 / Unlimited)"],
        ["commissionRate", "Number", "Required", "Platform commission percentage (e.g., 5%, 8%, 12%)"],
        ["startDate", "Date", "Required", "Start timestamp of current billing cycle"],
        ["renewalDate", "Date", "Required, Index", "Expiration and renewal due date"],
        ["paymentStatus", "String", "Enum (Active, Past Due, Cancelled)", "Subscription billing status"],
        ["createdAt / updatedAt", "Date", "Timestamps", "Automatic audit timestamps"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], sub_data)
    
    # Platform Activity Logs & Otps
    add_subheading(doc, "Platform Activity Logs Collection (platformactivitylogs) :")
    logs_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for the audit event log"],
        ["actionType", "String", "Required, Index", "Category: LOGIN, PRODUCT_APPROVAL, DISPUTE_RESOLVE..."],
        ["user", "ObjectId", "Ref: User, Optional", "Account performing the action"],
        ["ipAddress", "String", "Optional", "Client IPv4 / IPv6 address for security audit"],
        ["details", "Object", "Optional", "Arbitrary structured JSON metadata of the event"],
        ["createdAt", "Date", "Index, Default: Date.now", "Timestamp of audit event creation"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], logs_data)
    
    add_subheading(doc, "Otps Collection (otps) :")
    otps_data = [
        ["_id", "ObjectId", "Primary Key", "Unique identifier for temporary OTP record"],
        ["emailOrPhone", "String", "Required, Index", "Recipient target for OTP delivery"],
        ["otpCode", "String", "Required (Hashed)", "Bcrypt hashed 4-digit or 6-digit verification code"],
        ["purpose", "String", "Enum (signup, password_reset, delivery_handover)", "Context of verification"],
        ["expiresAt", "Date", "TTL Index (expires: 0)", "Automatic MongoDB expiry eviction time (5-15 mins)"]
    ]
    format_table(doc.add_table(rows=1, cols=4), [1.2, 1.1, 1.8, 2.4], ["Field Name", "Data Type", "Constraints", "Description"], otps_data)
    
    # ==================== CHAPTER 6: ER DIAGRAM ====================
    add_full_page_diagram_placeholder(doc, "6", "ER DIAGRAM", "6.1", "VendorHub Entity-Relationship (ER) Schema Diagram", "Please paste your high-resolution Entity-Relationship (ER) Diagram image in the area above.\nThe diagram illustrates entities including User, VendorApplication, Product, Category, Order, OrderItem, StockMovement, Dispute, Invoice, Subscription, and ActivityLog with primary/foreign keys and cardinality relationships.")
    
    # ==================== CHAPTER 7: TECH STACK ====================
    add_chapter_heading(doc, "7", "TECH STACK")
    add_subheading(doc, "7.1 TECH STACK BREAKDOWN")
    tech_data = [
        ["Frontend SPA Framework", "React.js 18 (Vite Bundler)", "Component-driven reactive user interface, fast hot module replacement, and modern virtual DOM"],
        ["Styling & Design System", "Vanilla CSS + Custom Design Tokens", "Ultra-responsive CSS variables, glassmorphic accents, dark/light theme engine, and zero CSS runtime overhead"],
        ["Icons & Assets", "Lucide React", "Comprehensive SVG icons for status badges, logistics pins, currency symbols, and navigational drawers"],
        ["State Management", "React Context API (8 Providers)", "Modular stores: AuthContext, ProductContext, CartContext, DisputeContext, LanguageContext, ThemeContext, CompareContext, ToastContext"],
        ["HTTP Client", "Axios", "REST communication with automatic JWT Authorization header injection and 401 unauthenticated interceptor"],
        ["Payment Gateway", "Razorpay.js + Dynamic UPI QR", "PCI-DSS compliant hosted checkout, card tokenization, UPI intent deep-linking, and server-side HMAC-SHA256 signature verification"],
        ["Backend Runtime & API", "Node.js (LTS) + Express.js 4", "High-throughput asynchronous non-blocking event-driven RESTful micro-controllers"],
        ["ODM & Data Layer", "Mongoose 8 + MongoDB Atlas", "Schema validation, strict type casting, compound indexing, population of references, and resilient in-memory fallback"],
        ["Authentication & Security", "JWT (jsonwebtoken) + bcryptjs", "Stateless bearer token authentication with 12-hour validity and salted password hashing (cost factor = 10)"],
        ["Security Hardening", "Helmet, CORS, express-rate-limit", "HTTP security headers, restrictive origin whitelisting, and brute-force protection (15 attempts / 15 min per IP)"],
        ["Internationalization (i18n)", "Custom Multilingual Engine", "Native 6-language dictionary (English, Tamil, Hindi, Malayalam, Telugu, Kannada) with instant zero-reload script switching"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 1.8, 2.9], ["Layer", "Technology", "Purpose / Architectural Role"], tech_data)
    
    add_subheading(doc, "7.2 ARCHITECTURE OVERVIEW (MVC PATTERN)")
    arch_data = [
        ["Model", "Mongoose ODM + MongoDB Atlas", "Defines relational document schemas, enforces validation rules, manages indexes, and handles data persistence"],
        ["View", "React.js 18 + Context API", "Renders component UI across Customer, Vendor, and Admin portals; handles reactive state and emits Axios HTTP requests"],
        ["Controller", "Node.js + Express.js Micro-Controllers", "Processes incoming API calls, executes business rules (stock decrements, OTP generation, payment verification), and returns JSON payloads"],
        ["Middleware", "Auth Guards, Rate Limiter, Error Interceptors", "Verifies JWT tokens, enforces RBAC route protection, throttles requests, and captures exceptions centrally"],
        ["Services", "Razorpay, OTP Hasher, Activity Logger", "Encapsulates reusable external integrations and transactional business helper functions"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.5, 2.0, 3.0], ["Layer", "Technology", "Purpose"], arch_data)
    
    # ==================== CHAPTER 8: MODULES ====================
    add_chapter_heading(doc, "8", "MODULES")
    add_subheading(doc, "8.0 Design Approach & System-Wide Baseline")
    add_p(doc, "Each module of VendorHub is documented here using a standardized, seven-step system design methodology. This rigorous format ensures architectural comparability, highlights trade-offs, and details both the algorithmic backend design and client-facing interfaces.")
    
    steps_data = [
        ["1. Functional Requirements", "What must the module accomplish?", "Section x.1"],
        ["2. Non-Functional Requirements", "Performance latency, availability, security, and CAP theorem trade-offs", "Section x.2"],
        ["3. Tech Stack Breakdown", "Which frameworks and libraries solve this domain, and why?", "Section x.3"],
        ["4. Back-of-the-Envelope Estimation", "Capacity planning: users, requests/sec, payload size, and storage growth", "Section x.4"],
        ["5. Low-Level Architecture", "Component interaction flow, middleware chain, and request lifecycle", "Section x.5 (Diagram + Flow)"],
        ["6. API Design", "REST endpoints, HTTP methods, authorization, and JSON contracts", "Section x.6"],
        ["7. DB Design", "Collections, indexes, schema references, and consistency semantics", "Section x.7"],
        ["8. Screenshots & User Interface", "Visual output screens and feature interface walkthrough", "Section x.8 (Image Placeholders)"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 3.5, 1.2], ["Step", "Question it answers", "Presented in each module as"], steps_data)
    
    add_p(doc, "System-Wide Shared Baseline: Every HTTP request travels through Helmet security headers, CORS origin verification, JSON payload size capping (10MB), express-rate-limit throttling, and JWT authentication middleware before reaching business controllers. VendorHub prioritizes Strong Consistency over Availability (CP in CAP theorem): an order or inventory operation is immediately aborted rather than allowing conflicting or oversold physical inventory balances.")
    
    add_subheading(doc, "Sizing Baseline (Working Assumptions) :")
    sizing_data = [
        ["Registered Vendors", "≈ 500 active merchants", "Regional multi-vendor onboarding projection"],
        ["Active Customers", "≈ 50,000 users", "Target regional marketplace consumers"],
        ["Orders per Day", "≈ 2,500 orders / day", "Combined multi-merchant daily order throughput"],
        ["Vendor Inventory Updates", "≈ 5,000 operations / day", "Warehouse stock intake, adjustments, and updates"],
        ["Peak Transaction Load", "≈ 35 - 50 req / second", "Festival flash sales and evening shopping spikes"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Metric", "Estimate", "Basis"], sizing_data)
    
    add_p(doc, "A single clustered Node.js instance backed by MongoDB Atlas handles this load comfortably. Because session authentication is completely stateless (via client-held JWT tokens), horizontal scaling is achieved effortlessly by deploying additional containerized Node.js workers behind an Nginx reverse proxy.")
    
    # Fig 8.0 Request flow placeholder
    add_image_placeholder(doc, "Fig 8.0", "Overall System Request & Middleware Flow of VendorHub", "The client application emits HTTPS requests with Bearer JWT tokens, passing through Helmet, CORS, Rate Limiting, and Auth Middleware before reaching route controllers and MongoDB Atlas collections.")
    
    # 8.1 FOLDER STRUCTURE
    add_subheading(doc, "8.1 FOLDER STRUCTURE")
    add_p(doc, "VendorHub adopts a clean separation of concerns with isolated backend and frontend directory structures.")
    
    add_subheading(doc, "8.1.1 Backend Directory Architecture :")
    be_folder_data = [
        ["config/", "Database connection scripts (db.js) and environment configuration"],
        ["controllers/", "Micro-controllers: auth, product, order, dispute, inventory, analytics, vendorApplication, store, subscription, invoice, message"],
        ["middleware/", "authMiddleware (JWT & RBAC verification), rateLimiters, uploadMiddleware, errorHandler"],
        ["models/", "Mongoose schemas: User, Product, Order, Dispute, StockMovement, VendorApplication, VendorSubscription, Invoice, ActivityLog, OTP"],
        ["routes/", "Express routers: /api/auth, /api/products, /api/orders, /api/disputes, /api/inventory, /api/analytics, /api/vendor-applications"],
        ["utils/", "activityLogger.js, razorpay.js, tokenGenerator.js, otpGenerator.js, emailService.js"],
        ["server.js", "Main application entry point configuring middleware pipeline, database connection, and API mounting"]
    ]
    format_table(doc.add_table(rows=1, cols=2), [1.8, 4.7], ["Directory / File", "Contents & Architectural Role"], be_folder_data)
    
    add_image_placeholder(doc, "Fig 8.1.1", "Backend Folder Structure in IDE", "High-level view of the backend directory showing modular controllers, middleware, models, routes, and utilities.")
    
    add_subheading(doc, "8.1.2 Frontend Directory Architecture :")
    fe_folder_data = [
        ["src/components/admin/", "AdminDashboard.jsx, AdminVendors.jsx, AdminProducts.jsx, AdminDisputes.jsx, AdminLogin.jsx"],
        ["src/components/vendor/", "VendorDashboard.jsx, VendorProducts.jsx, AddProduct.jsx, SmartInventory.jsx, VendorOrders.jsx, StoreBuilder.jsx, VendorAnalytics.jsx, VendorDisputes.jsx"],
        ["src/components/customer/", "ProductListing.jsx, ProductDetail.jsx, Cart.jsx, Orders.jsx, UpiQrCode.jsx, ProductComparison.jsx, DisputeModal.jsx, StoreDirectory.jsx"],
        ["src/contexts/", "AuthContext, ProductContext, CartContext, DisputeContext, LanguageContext, ThemeContext, ComparisonContext, ToastContext"],
        ["src/services/", "api.js (Axios instance configured with Bearer JWT interceptors and error handling)"],
        ["src/styles/ & index.css", "Modern vanilla CSS design tokens, responsive variables, dark/light theme properties, and micro-animations"],
        ["src/App.jsx & main.jsx", "Root application shell configuring React Router DOM v6 role-guarded routes and global context providers"]
    ]
    format_table(doc.add_table(rows=1, cols=2), [1.8, 4.7], ["Directory / File", "Contents & Architectural Role"], fe_folder_data)
    
    add_image_placeholder(doc, "Fig 8.1.2", "Frontend Folder Structure in IDE", "High-level view of the frontend directory showing components segregated into admin, vendor, and customer domains alongside context providers.")
    
    # ── MODULE 8.2: USER AUTHENTICATION & ACCESS CONTROL (RBAC) ──
    add_subheading(doc, "8.2 USER AUTHENTICATION & MULTI-ROLE ACCESS CONTROL (RBAC)")
    add_p(doc, "8.2.0 Purpose & Scope: Provides secure user authentication, role-based authorization (Customer, Vendor, Super Administrator), credential encryption, and session preservation. Guarantees endpoint isolation so that merchants cannot access other vendors' data and customers cannot invoke administrative APIs.")
    add_bullet(doc, "8.2.1 Functional Requirements", "Users authenticate with email/password; receives signed JWT token (12-hour expiry) with user profile; automated role detection routes users to customer storefront, vendor merchant suite, or admin console; password changes require old credential validation; new customer signups support instant account creation.")
    add_bullet(doc, "8.2.2 Non-Functional Requirements", "Passwords hashed via bcryptjs with salt rounds = 10; brute-force protection caps login attempts at 15 per 15 minutes per IP address; token verification completes in under 1 ms; strict CORS prevents unauthorized cross-origin credential sharing.")
    
    auth_tech = [
        ["Password Hashing", "bcryptjs (10 rounds)", "Pure JS implementation providing salted password hashing resistant to rainbow table attacks"],
        ["Tokenization", "jsonwebtoken (JWT)", "Stateless bearer tokens carrying user ID, role, and expiration timestamp in Authorization header"],
        ["Rate Limiting", "express-rate-limit", "Memory-efficient IP-based request throttling against brute-force attacks"],
        ["Route Guards", "React Router v6 + ProtectedRoute", "Client-side guard components redirecting unauthorized roles to appropriate login screens"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], auth_tech)
    
    auth_est = [
        ["Active User Accounts", "≈ 50,000 documents (≈ 30 MB)", "50k customers + 500 merchants + 5 administrators"],
        ["Daily Login Invocations", "≈ 6,000 logins / day", "Customer shopping sessions and merchant dashboard logins"],
        ["Bcrypt Verification Latency", "≈ 80 - 120 ms CPU time", "Intentionally compute-intensive to thwart brute-force cracking"],
        ["JWT Token Size", "≈ 220 bytes", "Compact token footprint stored in localStorage"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], auth_est)
    
    add_image_placeholder(doc, "Fig 8.2.A", "Low-Level Architecture Flow — User Authentication & RBAC", "Request lifecycle showing client login dispatch, rate limiter middleware, bcrypt password comparison, JWT token signing, and client-side storage.")
    
    auth_api = [
        ["POST", "/api/auth/login", "Public. Body: {email, password, role}. Validates credentials and returns JWT bearer token + user profile."],
        ["POST", "/api/auth/register", "Public. Body: {name, email, password, role, phone}. Creates new customer or vendor account."],
        ["GET", "/api/auth/profile", "Protected (JWT). Returns current authenticated user profile, role, and vendor metadata."],
        ["PUT", "/api/auth/change-password", "Protected (JWT). Body: {currentPassword, newPassword}. Verifies old password and saves new hash."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.2, 3.3], ["Method", "Endpoint", "Purpose / Contract"], auth_api)
    
    auth_db = [
        ["users", "PK: _id, UNIQUE: email", "_id, name, email, password (hashed), role, phone, vendorProfile, status, createdAt"],
        ["platformactivitylogs", "PK: _id, Index: actionType, createdAt", "_id, actionType (LOGIN), user, ipAddress, details, createdAt"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], auth_db)
    
    add_image_placeholder(doc, "Fig 8.2.1", "Secure Authentication and Role Selection Portal", "Login interface featuring role switching tabs (Customer / Vendor / Admin), email and password input fields, and secure JWT session creation.")
    add_image_placeholder(doc, "Fig 8.2.2", "Customer and Merchant Registration Screen", "Onboarding registration form capturing full name, email, mobile number, password, and account role selection.")
    
    # ── MODULE 8.3: VENDOR ONBOARDING, STOREFRONT BUILDER & CATALOG GOVERNANCE ──
    add_subheading(doc, "8.3 VENDOR ONBOARDING, STOREFRONT BUILDER & CATALOG GOVERNANCE")
    add_p(doc, "8.3.0 Purpose & Scope: Coordinates merchant KYC registration, GSTIN verification, custom storefront customization, and administrative product catalog moderation to guarantee zero-counterfeit listings.")
    add_bullet(doc, "8.3.1 Functional Requirements", "Vendors submit business profiles including GSTIN, PAN, and warehouse pickup addresses; admin reviews vendor applications with approve/reject options; vendors access Store Builder to define banner graphics, store bio, and featured SKUs; newly added SKUs enter a pending governance queue; admin audits and approves/rejects with mandatory feedback.")
    add_bullet(doc, "8.3.2 Non-Functional Requirements", "GSTIN validation enforced via 15-character statutory regex; catalog approvals reflect instantaneously across marketplace; audit trail logs all admin decisions.")
    
    gov_tech = [
        ["Form Validation", "Regex + Schema Rules", "Strict client and server validation of 15-digit GSTIN and 10-digit PAN tax identifiers"],
        ["Storefront Branding", "Vanilla CSS Custom Tokens", "Dynamic brand theme injection allowing vendors to customize store accent colors"],
        ["Governance Audit", "PlatformActivityLog", "Immutable audit logging capturing admin ID, timestamp, and rejection reasons"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], gov_tech)
    
    gov_est = [
        ["Merchant Applications", "≈ 500 records (≈ 1 MB)", "Total registered merchant storefront applications"],
        ["Catalog Submissions", "≈ 100 new SKUs / day", "Daily batch submissions requiring administrative auditing"],
        ["Admin Audit Queue", "< 25 pending items at peak", "Two-tier verification queue maintained by platform moderators"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], gov_est)
    
    add_image_placeholder(doc, "Fig 8.3.A", "Low-Level Architecture Flow — Vendor Onboarding & Catalog Governance", "Request flow showing vendor KYC application submission, admin review queue, status update to approved, and catalog visibility unlock.")
    
    gov_api = [
        ["POST", "/api/vendor-applications", "Protected (Vendor). Body: {businessName, gstin, pan, address}. Submits merchant KYC application."],
        ["GET", "/api/vendor-applications", "Protected (Admin). Query: {status}. Fetches pending or approved vendor applications."],
        ["PUT", "/api/vendor-applications/:id/status", "Protected (Admin). Body: {status, rejectionNotes}. Approves or rejects merchant application."],
        ["PUT", "/api/products/:id/approval", "Protected (Admin). Body: {approvalStatus, rejectionReason}. Moderates physical catalog SKU."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.4, 3.1], ["Method", "Endpoint", "Purpose / Contract"], gov_api)
    
    gov_db = [
        ["vendorapplications", "PK: _id, UNIQUE: userId", "_id, userId, businessName, gstin, panNumber, pickupAddress, status, rejectionNotes"],
        ["products", "PK: _id, Index: approvalStatus, vendor", "_id, vendor, name, sku, price, stock, approvalStatus, rejectionReason"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], gov_db)
    
    add_image_placeholder(doc, "Fig 8.3.1", "Vendor Onboarding and KYC Verification Screen", "Interface for submitting business name, GSTIN, PAN, and warehouse pickup location for administrative review.")
    add_image_placeholder(doc, "Fig 8.3.2", "Admin Catalog Governance & Product Moderation Queue", "Admin panel displaying pending merchant product submissions with actions to approve, reject with notes, or inspect specifications.")
    add_image_placeholder(doc, "Fig 8.3.3", "Vendor Storefront Builder Interface", "Merchant portal enabling store banner customization, storefront bio editing, and featured product selection.")
    
    # ── MODULE 8.4: PHYSICAL PRODUCT CATALOG & WAREHOUSE INVENTORY MANAGEMENT ──
    add_subheading(doc, "8.4 PHYSICAL PRODUCT CATALOG & WAREHOUSE INVENTORY MANAGEMENT")
    add_p(doc, "8.4.0 Purpose & Scope: Coordinates physical SKU specifications, barcode indexing, category filters, and real-time warehouse inventory balances. Enforces the platform's core zero-ghost inventory promise.")
    add_bullet(doc, "8.4.1 Functional Requirements", "Vendors create, update, and manage physical products with unique SKUs and barcodes; products categorized across Electronics, Fashion, Grocery, etc.; real-time stock balances displayed with Low Stock (< 5) and Out of Stock badges; merchants execute manual stock adjustments with mandatory audit reason logging.")
    add_bullet(doc, "8.4.2 Non-Functional Requirements", "Product list paginated (12 items per page) to ensure < 200 ms response times; unique indexes on SKU and barcode prevent inventory collisions; atomic updates prevent race conditions during concurrent orders.")
    
    inv_tech = [
        ["Catalog Browsing", "React Virtual Cards + Search", "Responsive product cards with live search, price filters, and stock badges"],
        ["Atomic Decrements", "Mongoose findOneAndUpdate", "Guarantees race-condition-free stock reservations: {$inc: {stock: -qty}}"],
        ["Audit Tracking", "StockMovement Collection", "Immutable audit log recording every inventory intake, sale decrement, and adjustment"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], inv_tech)
    
    inv_est = [
        ["Total Marketplace SKUs", "≈ 10,000 products (≈ 15 MB)", "Inventory across 500 active merchant stores"],
        ["Catalog Browsing Requests", "≈ 80,000 requests / day", "Customer shopping, search, and category filter views"],
        ["Stock Balance Query Latency", "< 25 ms", "Served via indexed MongoDB queries on category, vendor, and approvalStatus"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], inv_est)
    
    add_image_placeholder(doc, "Fig 8.4.A", "Low-Level Architecture Flow — Product Catalog & Inventory Reservation", "Flow diagram showing product creation by vendor, barcode lookup, and atomic inventory update upon customer order placement.")
    
    inv_api = [
        ["GET", "/api/products", "Public. Query: {search, category, vendor, page, limit}. Fetches approved products with pagination."],
        ["POST", "/api/products", "Protected (Vendor). Body: {name, sku, barcode, price, mrp, stock, category, images}. Creates new SKU."],
        ["PUT", "/api/products/:id", "Protected (Vendor). Body: updated product fields. Modifies pricing, stock threshold, or imagery."],
        ["POST", "/api/inventory/adjust", "Protected (Vendor). Body: {productId, delta, reason}. Records stock movement and updates balance."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.2, 3.3], ["Method", "Endpoint", "Purpose / Contract"], inv_api)
    
    inv_db = [
        ["products", "PK: _id, UNIQUE: sku, barcode, Index: category", "_id, vendor, name, sku, barcode, price, mrp, stock, approvalStatus"],
        ["stockmovements", "PK: _id, Index: product, vendor, createdAt", "_id, product, vendor, movementType, quantityDelta, stockAfter, reason"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], inv_db)
    
    add_image_placeholder(doc, "Fig 8.4.1", "Enterprise Product Catalog Grid with Multi-Facet Filters", "Marketplace product catalog displaying product image, price, discount badge, stock availability, and merchant name.")
    add_image_placeholder(doc, "Fig 8.4.2", "Add Physical Product & SKU Creation Portal", "Merchant form capturing product name, brand, SKU code, barcode, warehouse stock count, pricing, and image upload.")
    add_image_placeholder(doc, "Fig 8.4.3", "Smart Inventory Management & Stock Adjustment Console", "Warehouse stock table with low-stock badges, current balance, and quick stock adjustment modal.")
    
    # ── MODULE 8.5: MULTI-VENDOR CART, SPLIT ORDERS & CHECKOUT ──
    add_subheading(doc, "8.5 MULTI-VENDOR CART, SPLIT ORDERS & CHECKOUT (RAZORPAY / UPI / COD)")
    add_p(doc, "8.5.0 Purpose & Scope: Coordinates multi-merchant shopping baskets, calculates taxes and delivery fees, provides flexible payments (Razorpay, UPI QR, COD), and generates cryptographically protected 4-digit handover OTPs.")
    add_bullet(doc, "8.5.1 Functional Requirements", "Customers add items from multiple merchants into a unified cart; cart groups line items per merchant; checkout calculates subtotal, GST, and total; payment choices include Razorpay online payment, dynamic UPI QR code, and Cash on Delivery (COD); order creation triggers 4-digit delivery OTP generation.")
    add_bullet(doc, "8.5.2 Non-Functional Requirements", "Razorpay webhook / signature verification validates payment tamper-proofing; checkout execution completes in < 150 ms; atomic stock deduction rollback occurs if payment authorization fails.")
    
    chk_tech = [
        ["Cart State", "React Context API (CartContext)", "Persistent client-side basket preserved across browser navigation and refreshes"],
        ["Payment Gateway", "Razorpay API + Webhooks", "Industry-standard payment processing supporting UPI, credit/debit cards, and netbanking"],
        ["Dynamic UPI QR", "Custom SVG QR Generator", "Encodes merchant UPI VPA, order amount, and transaction reference into instant scannable QR"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], chk_tech)
    
    chk_est = [
        ["Daily Checkout Invocations", "≈ 2,500 completed orders / day", "Combined online transactions across the platform"],
        ["Cart Items per Order", "≈ 3.5 items average", "Typical multi-merchant shopping basket"],
        ["Payment Verification Latency", "< 300 ms round-trip", "Server-to-Razorpay API cryptographic signature check"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], chk_est)
    
    add_image_placeholder(doc, "Fig 8.5.A", "Low-Level Architecture Flow — Checkout & Multi-Channel Payment", "Request sequence: Cart submission, Razorpay order generation, client signature capture, server-side HMAC validation, and order database insertion.")
    
    chk_api = [
        ["POST", "/api/payment/create-order", "Protected (Customer). Body: {amount, currency}. Generates a Razorpay order ID."],
        ["POST", "/api/payment/verify", "Protected (Customer). Body: {razorpay_order_id, razorpay_payment_id, razorpay_signature}. Verifies HMAC."],
        ["POST", "/api/orders", "Protected (Customer). Body: {items, shippingAddress, paymentMethod, paymentDetails}. Creates order & OTP."],
        ["GET", "/api/orders/my-orders", "Protected (Customer). Fetches logged-in customer's complete order history with live status."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.2, 3.3], ["Method", "Endpoint", "Purpose / Contract"], chk_api)
    
    chk_db = [
        ["orders", "PK: _id, UNIQUE: orderNumber, Index: customer", "_id, orderNumber, customer, items, totalAmount, paymentMethod, paymentStatus, deliveryOtp"],
        ["invoices", "PK: _id, UNIQUE: invoiceNumber, Index: order", "_id, invoiceNumber, order, vendor, customer, subtotal, cgstAmount, sgstAmount, totalAmount"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], chk_db)
    
    add_image_placeholder(doc, "Fig 8.5.1", "Multi-Vendor Interactive Cart & Price Summary Panel", "Shopping cart screen showing items grouped with quantity counters, price breakdown, and checkout action.")
    add_image_placeholder(doc, "Fig 8.5.2", "Dynamic UPI QR Code Payment Modal", "Instant UPI payment dialog displaying dynamic QR code with order reference and transaction amount.")
    add_image_placeholder(doc, "Fig 8.5.3", "Razorpay Hosted Payment Gateway Checkout Screen", "Razorpay secure payment checkout modal with cards, UPI, netbanking, and wallet options.")
    
    # ── MODULE 8.6: REAL-TIME LOGISTICS DISPATCH & 4-DIGIT OTP HANDOVER ──
    add_subheading(doc, "8.6 REAL-TIME LOGISTICS DISPATCH & 4-DIGIT OTP DOORSTEP DELIVERY")
    add_p(doc, "8.6.0 Purpose & Scope: Automates courier logistics dispatch, provides real-time shipment status tracking, and enforces tamper-proof delivery completion via 4-digit OTP verification at the customer's doorstep.")
    add_bullet(doc, "8.6.1 Functional Requirements", "Vendors pack orders and assign courier partners; tracking lifecycle transitions: Processing -> Dispatched -> Out for Delivery -> Delivered; customer view displays tracking timeline; delivery agent enters customer's 4-digit OTP to complete handover; successful verification marks order as Delivered.")
    add_bullet(doc, "8.6.2 Non-Functional Requirements", "OTP stored using bcrypt hash to prevent inspection; verification requests rate-limited to 5 tries to prevent brute-forcing; tracking timeline polls every 15 seconds.")
    
    disp_tech = [
        ["Logistics Tracking", "SVG Timeline Component", "Visual milestone tracker representing fulfillment stages with timestamp tooltips"],
        ["OTP Handover Verification", "Bcrypt Comparison Engine", "Ensures delivery agent cannot finalize delivery without customer providing physical OTP"],
        ["Courier Integration", "Consignment Reference Tracker", "Stores courier partner metadata and external AWB tracking codes"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], disp_tech)
    
    disp_est = [
        ["Active Deliveries in Transit", "≈ 800 packages concurrently", "Daily active delivery pipeline across regions"],
        ["OTP Verifications / Day", "≈ 2,500 handoffs / day", "One verification attempt per successful delivery"],
        ["Tracking Page Refresh Calls", "≈ 15,000 requests / day", "Customer order tracking page visits and status checks"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], disp_est)
    
    add_image_placeholder(doc, "Fig 8.6.A", "Low-Level Architecture Flow — Logistics Dispatch & Doorstep OTP Handover", "Flow showing vendor dispatch assignment, customer receiving 4-digit OTP, delivery agent submitting OTP, server bcrypt check, and order completion.")
    
    disp_api = [
        ["PUT", "/api/orders/:id/dispatch", "Protected (Vendor). Body: {courierPartner, trackingNumber}. Advances order to Dispatched."],
        ["GET", "/api/orders/:id/tracking", "Protected (Customer/Vendor). Returns fulfillment milestone history and tracking details."],
        ["POST", "/api/orders/:id/verify-delivery", "Protected. Body: {otp}. Compares provided OTP with order hash and marks Delivered."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.4, 3.1], ["Method", "Endpoint", "Purpose / Contract"], disp_api)
    
    disp_db = [
        ["orders", "PK: _id, Index: deliveryStatus, trackingNumber", "_id, orderNumber, deliveryStatus, deliveryOtp, courierPartner, trackingNumber, updatedAt"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], disp_db)
    
    add_image_placeholder(doc, "Fig 8.6.1", "Real-Time Order Tracking Timeline & Delivery Status", "Customer tracking view displaying fulfillment progress from Order Placed to Out for Delivery.")
    add_image_placeholder(doc, "Fig 8.6.2", "Vendor Order Fulfillment & Courier Dispatch Console", "Merchant management panel for packing orders, printing shipping labels, and updating carrier details.")
    add_image_placeholder(doc, "Fig 8.6.3", "Doorstep Delivery 4-Digit OTP Handover Verification Dialog", "Delivery confirmation dialog prompting courier agent for the customer's 4-digit verification code.")
    
    # ── MODULE 8.7: POST-DELIVERY DISPUTE RESOLUTION & WARRANTY CLAIMS ──
    add_subheading(doc, "8.7 POST-DELIVERY DISPUTE RESOLUTION, AUDIT & WARRANTY CLAIMS")
    add_p(doc, "8.7.0 Purpose & Scope: Provides a centralized dispute arbitration system allowing customers to report damaged or incorrect items, enabling vendors to respond, and empowering administrators to resolve claims.")
    add_bullet(doc, "8.7.1 Functional Requirements", "Customers file disputes within 7 days of delivery with reason and photo evidence; vendor alerted and submits explanation; admin reviews case history and arbitrates outcome (Refund, Replacement, Dismissal); platform automatically executes ledger updates upon refund approval.")
    add_bullet(doc, "8.7.2 Non-Functional Requirements", "Evidence image URLs securely stored; dispute status changes trigger immutable audit logs; dispute resolution SLA monitored on admin dashboard.")
    
    disp_res_tech = [
        ["Dispute Workflow", "React Context (DisputeContext)", "Synchronizes active claim status across customer, merchant, and admin consoles"],
        ["Evidence Storage", "Cloudinary / S3 Image URLs", "Secure hosted image assets displaying unboxing photos and damage proof"],
        ["Arbitration Engine", "Mongoose Dispute Controller", "Enforces state machine transitions: Open -> Vendor Responded -> Resolved"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], disp_res_tech)
    
    disp_res_est = [
        ["Dispute Claims Ratio", "≈ 1.5% of total orders", "Industry standard return/damage claim frequency (≈ 35 claims/day)"],
        ["Average Resolution Time", "< 24 hours", "Platform SLA for dispute mediation and arbitration"],
        ["Evidence Payload Size", "≈ 2 - 4 MB per ticket", "2-3 compressed photos documenting packaging and product damage"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], disp_res_est)
    
    add_image_placeholder(doc, "Fig 8.7.A", "Low-Level Architecture Flow — Dispute Mediation & Resolution", "Flow diagram: Customer grievance submission, merchant notification, vendor response, admin arbitration, and financial ledger settlement.")
    
    disp_res_api = [
        ["POST", "/api/disputes", "Protected (Customer). Body: {orderId, reason, description, evidenceImages}. Creates dispute ticket."],
        ["GET", "/api/disputes/vendor", "Protected (Vendor). Returns disputes raised against the merchant's orders."],
        ["PUT", "/api/disputes/:id/respond", "Protected (Vendor). Body: {vendorResponse}. Submits merchant rebuttal or explanation."],
        ["PUT", "/api/disputes/:id/resolve", "Protected (Admin). Body: {outcome, notes}. Arbitrates claim and issues refund or closure."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.2, 3.3], ["Method", "Endpoint", "Purpose / Contract"], disp_res_api)
    
    disp_res_db = [
        ["disputes", "PK: _id, Index: order, customer, vendor, status", "_id, order, customer, vendor, reason, description, evidenceImages, status, resolutionOutcome"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], disp_res_db)
    
    add_image_placeholder(doc, "Fig 8.7.1", "Customer Dispute Filing Modal with Evidence Upload", "Customer modal allowing selection of dispute category (Damaged / Wrong Item), description, and photo attachments.")
    add_image_placeholder(doc, "Fig 8.7.2", "Vendor Dispute Management & Response Portal", "Merchant console showing incoming customer claims with options to provide counter-evidence or accept returns.")
    add_image_placeholder(doc, "Fig 8.7.3", "Admin Dispute Arbitration & Refund Resolution Console", "Administrative panel displaying full case history, evidence gallery, and arbitration actions (Issue Refund / Dismiss).")
    
    # ── MODULE 8.8: EXECUTIVE DASHBOARD, VENDOR SETTLEMENTS & SUBSCRIPTIONS ──
    add_subheading(doc, "8.8 EXECUTIVE DASHBOARD, VENDOR REVENUE SETTLEMENTS & SUBSCRIPTIONS")
    add_p(doc, "8.8.0 Purpose & Scope: Delivers real-time executive analytics for platform administrators and merchants, tracking Gross Merchandise Value (GMV), platform fee commissions, net payouts, subscription tiers, and tax invoices.")
    add_bullet(doc, "8.8.1 Functional Requirements", "Admin dashboard displays total revenue, active vendors, orders, and dispute rates; vendor dashboard presents net sales, payout balance, and sales velocity; system automates platform commission deductions based on subscription tier (Starter, Pro, Enterprise); generates downloadable GST tax invoices.")
    add_bullet(doc, "8.8.2 Non-Functional Requirements", "Dashboard analytics compute in < 150 ms using MongoDB $facet aggregations; financial numbers rounded to two decimal places; role guards restrict executive figures to authorized personnel.")
    
    fin_tech = [
        ["Analytics Engine", "MongoDB $facet Pipeline", "Executes multi-dimensional KPI aggregations, revenue trends, and top vendor metrics in a single database round-trip"],
        ["Charts & Visuals", "Custom SVG Interactive Charts", "Lightweight, responsive line, bar, and donut charts with zero external charting library bloat"],
        ["Tax Invoicing", "Automated GST Calculation", "Enforces 9% CGST + 9% SGST split on intra-state merchant transactions"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], fin_tech)
    
    fin_est = [
        ["Daily Financial Aggregations", "≈ 2,500 transactions / day", "Aggregated across 500 merchant accounts"],
        ["Commission Invoices / Month", "≈ 500 vendor payout statements", "Generated at the conclusion of monthly settlement cycles"],
        ["Analytics Query Latency", "< 60 ms", "Optimized with compound indexes on orders: {createdAt: -1, totalAmount: 1}"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], fin_est)
    
    add_image_placeholder(doc, "Fig 8.8.A", "Low-Level Architecture Flow — Analytics & Merchant Financial Settlement", "Flow showing transaction aggregation pipeline, platform fee calculation, merchant wallet crediting, and invoice document generation.")
    
    fin_api = [
        ["GET", "/api/analytics/admin", "Protected (Admin). Returns platform-wide GMV, vendor counts, order volume, and dispute metrics."],
        ["GET", "/api/analytics/vendor", "Protected (Vendor). Returns merchant sales trend, net earnings, and fast-moving SKUs."],
        ["GET", "/api/subscriptions", "Protected (Vendor). Fetches active subscription plan, product limits, and renewal dates."],
        ["GET", "/api/invoices/:id", "Protected. Returns GST tax invoice details with tax breakdown."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.2, 3.3], ["Method", "Endpoint", "Purpose / Contract"], fin_api)
    
    fin_db = [
        ["vendorsubscriptions", "PK: _id, UNIQUE: vendor", "_id, vendor, planName, productLimit, commissionRate, startDate, renewalDate"],
        ["invoices", "PK: _id, UNIQUE: invoiceNumber, Index: order, vendor", "_id, invoiceNumber, order, vendor, customer, subtotal, cgstAmount, sgstAmount, totalAmount"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], fin_db)
    
    add_image_placeholder(doc, "Fig 8.8.1", "Super Administrator Executive Overview Dashboard", "Admin console presenting platform GMV, active merchant counts, live order totals, and critical platform alerts.")
    add_image_placeholder(doc, "Fig 8.8.2", "Vendor Merchant Financial Analytics & Sales Performance", "Merchant dashboard displaying monthly earnings, commission deductions, net payout balances, and sales velocity charts.")
    add_image_placeholder(doc, "Fig 8.8.3", "GST-Compliant Official Tax Invoice Preview", "Formal tax invoice showing buyer/seller GSTIN, line-item pricing, CGST/SGST tax split, and authorized digital stamp.")
    
    # ── MODULE 8.9: HUB ASSISTANT AI, REAL-TIME MESSAGING & LOCALIZATION ──
    add_subheading(doc, "8.9 HUB ASSISTANT AI, REAL-TIME MESSAGING & MULTILINGUAL LOCALIZATION")
    add_p(doc, "8.9.0 Purpose & Scope: Powers an intelligent automated customer assistant, enables real-time customer-to-vendor messaging, and delivers native multilingual localization in 6 Indian languages for regional inclusivity.")
    add_bullet(doc, "8.9.1 Functional Requirements", "Hub Assistant answers queries regarding order tracking, return policies, and stock availability; customer-vendor chat enables direct communication; 6-language switcher provides instant UI translation in English, Tamil, Hindi, Malayalam, Telugu, and Kannada with zero reload.")
    add_bullet(doc, "8.9.2 Non-Functional Requirements", "Language switching updates state in < 10 ms across the entire component tree; translation dictionary stored in client bundle for zero latency; chat message payloads sanitized to prevent XSS.")
    
    ai_tech = [
        ["Assistant Engine", "Rule & Pattern Matching NLP", "Instant client-side query classifier resolving FAQs, delivery ETAs, and policy inquiries"],
        ["Localization (i18n)", "LanguageContext + JSON Dictionaries", "Native multi-script language engine supporting 6 regional Indian languages"],
        ["Messaging UI", "Real-Time Chat Components", "Clean message drawer with timestamps, read receipts, and role identification"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.6, 2.0, 2.9], ["Concern", "Choice", "Why it fits this module"], ai_tech)
    
    ai_est = [
        ["Assistant Queries Handled", "≈ 4,000 inquiries / day", "Automated FAQ and order tracking resolutions"],
        ["Supported Languages", "6 Indian Languages", "English, Tamil, Hindi, Malayalam, Telugu, Kannada"],
        ["Translation Lookup Latency", "< 1 ms in-memory", "Zero API calls required for UI translation switching"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [2.0, 1.8, 2.7], ["Quantity", "Estimate", "Basis"], ai_est)
    
    add_image_placeholder(doc, "Fig 8.9.A", "Low-Level Architecture Flow — Assistant NLP & Multilingual Dispatch", "Request sequence: User query entry, client intent classification, order database lookup, translated response rendering.")
    
    ai_api = [
        ["POST", "/api/chatbot/query", "Public / Protected. Body: {query, context}. Evaluates customer query and returns contextual assistance."],
        ["GET", "/api/messages/:conversationId", "Protected. Fetches message history between customer and vendor."],
        ["POST", "/api/messages", "Protected. Body: {recipientId, content}. Sends real-time message."]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.0, 2.2, 3.3], ["Method", "Endpoint", "Purpose / Contract"], ai_api)
    
    ai_db = [
        ["conversations", "PK: _id, Index: participants", "_id, participants, lastMessage, updatedAt"],
        ["messages", "PK: _id, Index: conversationId, createdAt", "_id, conversationId, sender, content, readStatus, createdAt"]
    ]
    format_table(doc.add_table(rows=1, cols=3), [1.8, 2.0, 2.7], ["Collection", "Keys & Indexes", "Key Fields Stored"], ai_db)
    
    add_image_placeholder(doc, "Fig 8.9.1", "Hub Assistant Intelligent Automated Chatbot Interface", "Floating chat drawer responding to customer queries with suggested quick actions, order lookup, and store links.")
    add_image_placeholder(doc, "Fig 8.9.2", "Six-Language Regional Script Switcher in Action", "Marketplace header showing active language dropdown and the UI rendered in native Tamil, Hindi, and Malayalam scripts.")
    add_image_placeholder(doc, "Fig 8.9.3", "Customer to Merchant Direct Messaging Console", "Interactive messaging dialog facilitating product queries and custom order discussions between buyer and vendor.")
    
    # ==================== CHAPTER 9: CONCLUSION ====================
    add_chapter_heading(doc, "9", "CONCLUSION")
    add_p(doc, "VendorHub delivers an end-to-end, enterprise-grade digital solution designed to overcome the critical operational challenges of contemporary multi-vendor e-commerce. By establishing a rigorous zero-ghost physical inventory framework, the platform guarantees that every listed product corresponds to verified stock residing within merchant warehouses. The implementation of an administrative two-tier verification queue successfully eliminates counterfeit listings and elevates catalog standards across all merchant storefronts.")
    add_p(doc, "The platform's three-tier client-server architecture—leveraging React 18 and Vite for an ultra-responsive frontend, Node.js and Express for scalable RESTful backend services, and MongoDB Atlas for high-throughput document persistence—provides robust performance, maintainability, and horizontal elasticity. Security has been engineered into every tier through salted bcrypt password hashing, stateless JSON Web Token authentication, granular Role-Based Access Control, Helmet HTTP hardening, and express-rate-limit brute force defense.")
    add_p(doc, "Through features such as flexible multi-channel payments (Razorpay, dynamic UPI QR, and Cash on Delivery), tamper-proof doorstep delivery verification using encrypted 4-digit OTPs, post-delivery dispute arbitration, and native multilingual accessibility across six Indian languages, VendorHub bridges the divide between local merchants and digital consumers. The system effectively mitigates shipping fraud, reduces operational friction, and provides management with real-time financial transparency. VendorHub stands as a scalable, secure, and modern foundation for next-generation multi-merchant retail commerce.")
    
    # Output file
    out_path = r"c:\Users\Admin\Desktop\Multi-Vendour-Platform\VendorHub_Professional_Project_Report.docx"
    doc.save(out_path)
    print(f"Report generated successfully at: {out_path}")

if __name__ == "__main__":
    build_full_report()
