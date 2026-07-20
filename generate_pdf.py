from fpdf import FPDF
import re

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 15)
        self.cell(0, 10, "Nexus AI - Project Interview Report", border=0, ln=1, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def markdown_to_pdf(md_file, pdf_file):
    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            pdf.ln(5)
            continue
            
        if line.startswith("# "):
            pdf.set_font("Arial", "B", 20)
            pdf.multi_cell(0, 10, line.replace("# ", ""))
            pdf.ln(5)
        elif line.startswith("## "):
            pdf.set_font("Arial", "B", 16)
            pdf.multi_cell(0, 10, line.replace("## ", ""))
            pdf.ln(5)
        elif line.startswith("### "):
            pdf.set_font("Arial", "B", 14)
            pdf.multi_cell(0, 8, line.replace("### ", ""))
            pdf.ln(3)
        elif line.startswith("- "):
            pdf.set_font("Arial", "", 11)
            pdf.multi_cell(0, 6, "- " + line[2:].replace("**", ""))
        else:
            pdf.set_font("Arial", "", 11)
            # Remove markdown bolding
            line = re.sub(r'\*\*(.*?)\*\*', r'\1', line)
            # Remove markdown italics
            line = re.sub(r'\_(.*?)\_', r'\1', line)
            # Remove inline code blocks
            line = re.sub(r'`(.*?)`', r'\1', line)
            pdf.multi_cell(0, 6, line)

    pdf.output(pdf_file)

if __name__ == "__main__":
    md_path = r"C:\Users\ankum\.gemini\antigravity-ide\brain\9d91ed3f-9997-4683-a57e-e43f6d4c851d\interview_report.md"
    pdf_path = r"v:\AI-powered Data Analyst\interview_report.pdf"
    markdown_to_pdf(md_path, pdf_path)
    print(f"PDF generated successfully at {pdf_path}")
