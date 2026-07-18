import asyncio
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import json
import random
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from datetime import datetime
from collections import defaultdict

GLOBAL_DATASETS = {}

app = FastAPI(title="Nexora AI Data Analyst API")

MONGO_DETAILS = "mongodb+srv://vishnu:vishnu007@cluster0.gxre5nj.mongodb.net/?appName=Cluster0"
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.nexus_intelligence

class UserData(BaseModel):
    email: str
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

@app.post("/api/auth/signup")
async def signup(user_data: UserData):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # NOTE: Passwords should be hashed in production using Passlib/Bcrypt
    user_dict = user_data.model_dump()
    new_user = await db.users.insert_one(user_dict)
    return {"message": "User registered successfully", "id": str(new_user.inserted_id)}

@app.post("/api/auth/login")
async def login(user_data: UserData):
    user = await db.users.find_one({"email": user_data.email, "password": user_data.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful"}

class GenericData(BaseModel):
    data: dict
    
@app.post("/api/data")
async def store_data(item: GenericData):
    new_item = await db.generic_data.insert_one(item.data)
    return {"message": "Data stored successfully", "id": str(new_item.inserted_id)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Nexus Intelligence API is running."}

# Mock stream for new SaaS UI
async def mock_agent_stream(websocket: WebSocket):
    stages = [
        {"status": "Uploading Dataset...", "progress": 10},
        {"status": "Parsing CSV columns...", "progress": 30},
        {"status": "Detecting data types...", "progress": 50},
        {"status": "Running statistical analysis...", "progress": 70},
        {"status": "Generating AI insights...", "progress": 90},
    ]
    
    for stage in stages:
        await asyncio.sleep(1.5)
        await websocket.send_text(json.dumps(stage))
    
    await asyncio.sleep(1)
    await websocket.send_text(json.dumps({"status": "Complete", "progress": 100}))

@app.websocket("/ws/analysis-status")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        await mock_agent_stream(websocket)
    except WebSocketDisconnect:
        print("Client disconnected")

def generate_analysis_for_df(df, filename, chart_types):
    total_rows = len(df)
    columns = list(df.columns)
    
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    kpis = {
        "totalRows": total_rows,
        "totalColumns": len(columns),
        "primaryMetric": {"title": "Total Items", "value": total_rows},
        "secondaryMetric": {"title": "Columns", "value": len(columns)}
    }
    
    if numeric_cols:
        target_col = numeric_cols[0]
        for col in numeric_cols:
            if any(term in col.lower() for term in ['revenue', 'sales', 'total', 'price', 'amount']):
                target_col = col
                break
        
        sum_val = float(df[target_col].sum())
        avg_val = float(df[target_col].mean())
        kpis["primaryMetric"] = {"title": f"Total {target_col}", "value": round(sum_val, 2)}
        kpis["secondaryMetric"] = {"title": f"Avg {target_col}", "value": round(avg_val, 2)}
        
    category_data = []
    if categorical_cols and numeric_cols:
        cat_col = categorical_cols[0]
        target_col = numeric_cols[0]
        
        for col in categorical_cols:
            if any(term in col.lower() for term in ['category', 'product', 'type', 'item']):
                cat_col = col
                break
                
        grouped = df.groupby(cat_col)[target_col].sum().reset_index()
        grouped = grouped.sort_values(by=target_col, ascending=False).head(5)
        
        for _, row in grouped.iterrows():
            category_data.append({
                "category": str(row[cat_col]),
                "sales": float(row[target_col])
            })
            
    user_segments = []
    if len(categorical_cols) > 1:
        seg_col = categorical_cols[1]
        for col in categorical_cols:
            if any(term in col.lower() for term in ['segment', 'region', 'customer', 'status', 'tier']):
                seg_col = col
                break
                
        counts = df[seg_col].value_counts().reset_index().head(4)
        for _, row in counts.iterrows():
            user_segments.append({
                "name": str(row[seg_col]),
                "value": int(row['count'])
            })
    elif categorical_cols:
        counts = df[categorical_cols[0]].value_counts().reset_index().head(4)
        for _, row in counts.iterrows():
            user_segments.append({
                "name": str(row[categorical_cols[0]]),
                "value": int(row['count'])
            })
            
    revenue_data = []
    if numeric_cols:
        target_col = numeric_cols[0]
        series = df[target_col].dropna().values
        bucket_size = max(1, len(series) // 10)
        for i in range(min(10, len(series) // bucket_size)):
            bucket = series[i*bucket_size : (i+1)*bucket_size]
            if len(bucket) > 0:
                revenue_data.append({
                    "month": f"P{i+1}",
                    "revenue": float(sum(bucket))
                })
                
    dynamic_text = {}
    
    smart_insights = []
    if category_data:
        top_cat = category_data[0]
        smart_insights.append({
            "what": f"'{top_cat['category']}' generated the highest {target_col}.",
            "why": f"This category demonstrates the strongest volume within the dataset.",
            "impact": f"Contributed {round(top_cat['sales'])} to the total.",
            "action": f"Focus resources on '{top_cat['category']}' to maximize returns."
        })
    else:
        smart_insights.append({
            "what": "High overall volume detected.",
            "why": "Consistent data points across the analyzed rows.",
            "impact": "Stable baseline for future forecasting.",
            "action": "Maintain current operational strategies."
        })
        
    if user_segments:
        top_seg = user_segments[0]
        smart_insights.append({
            "what": f"'{top_seg['name']}' is the dominant segment.",
            "why": "This segment appears most frequently in the dataset records.",
            "impact": f"Represents a significant portion ({top_seg['value']} occurrences).",
            "action": f"Tailor messaging and outreach specifically to '{top_seg['name']}'."
        })
    else:
        smart_insights.append({
            "what": "Metrics are evenly distributed.",
            "why": "No dominant secondary category was identified.",
            "impact": "Risk is well-diversified across the dataset.",
            "action": "Look for new dimensions to segment and analyze."
        })
        
    dynamic_text["smartInsights"] = smart_insights
    
    cat_col_name = cat_col if 'cat_col' in locals() else 'Category'
    seg_col_name = seg_col if 'seg_col' in locals() else categorical_cols[0] if categorical_cols else 'Segment'
    t_col = target_col if 'target_col' in locals() else 'Metric'
    
    dynamic_text["chartInsights"] = {
        "titleTrend": f"{t_col} Trend Analysis",
        "obsTrend": f"{t_col} shows variations across the periods.",
        "intTrend": f"AI suggests a potential underlying cyclical pattern in {t_col}.",
        "titleCategory": f"Top {cat_col_name}s by {t_col}",
        "obsCategory": f"{category_data[0]['category']} leads the group." if category_data else "",
        "intCategory": "Focusing on top performers can yield the highest ROI.",
        "titleSegment": f"{seg_col_name} Segmentation",
        "obsSegment": f"{user_segments[0]['name']} is the largest cohort." if user_segments else "",
        "intSegment": "Understanding cohort sizes helps allocate resources effectively."
    }
    
    anomaly = {
        "type": "No Critical Anomalies",
        "actual": "N/A", "expected": "N/A",
        "severity": "Low", "confidence": "99%",
        "explanation": "The dataset values fall within normal standard deviations.",
        "investigation": "No action required."
    }
    
    if 'target_col' in locals() and len(df) > 0:
        mean_val = df[t_col].mean()
        std_val = df[t_col].std()
        max_val = df[t_col].max()
        if pd.notna(std_val) and std_val > 0 and max_val > mean_val + 2 * std_val:
            anomaly = {
                "type": f"High {t_col} Spike Detected",
                "actual": f"{round(max_val, 2)}",
                "expected": f"~{round(mean_val, 2)}",
                "severity": "High", "confidence": "95%",
                "explanation": f"A data point for {t_col} significantly exceeds the normal range (mean + 2*std).",
                "investigation": f"Review the records where {t_col} is near {round(max_val, 2)}."
            }
    dynamic_text["anomalies"] = anomaly
    
    dynamic_text["forecasts"] = [
        f"Predicted {t_col} Growth: +5% (Confidence: 82%)",
        "Based on recent data density, AI models predict a continued positive trajectory."
    ]
                
    return {
        "kpis": kpis,
        "categoryData": category_data,
        "userSegments": user_segments,
        "revenueData": revenue_data,
        "dynamicText": dynamic_text,
        "filename": filename,
        "columns": columns,
        "chartTypes": chart_types
    }

@app.post("/api/analyze/upload")
async def analyze_csv(files: List[UploadFile] = File(...)):
    dfs = []
    filenames = []
    for file in files:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
            
        contents = await file.read()
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
            dfs.append(df)
            filenames.append(file.filename)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading CSV {file.filename}: {str(e)}")
            
    if not dfs:
        raise HTTPException(status_code=400, detail="No valid data uploaded")
        
    chart_combos = [
        ["Area", "Bar", "Pie"],
        ["Line", "Scatter", "Pie"],
        ["Bar", "Line", "Scatter"],
        ["Scatter", "Area", "Bar"]
    ]
        
    datasets_responses = []
    # Process individual datasets
    for i, df in enumerate(dfs):
        combo = chart_combos[i % len(chart_combos)]
        analysis = generate_analysis_for_df(df, filenames[i], combo)
        datasets_responses.append(analysis)
        GLOBAL_DATASETS[filenames[i]] = df
        
    # Process combined dataset if there is more than 1 file
    if len(dfs) > 1:
        combined_df = pd.concat(dfs, ignore_index=True)
        combo = chart_combos[(len(dfs)) % len(chart_combos)]
        analysis = generate_analysis_for_df(combined_df, "Combined CSV", combo)
        datasets_responses.append(analysis)
        GLOBAL_DATASETS["Combined CSV"] = combined_df
        
    return {
        "datasets": datasets_responses
    }

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    dataset_name: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_msg = request.message.lower()
    dataset_name = request.dataset_name
    
    print(f"\n--- DEBUG LOG ---")
    print(f"Current Dataset: {dataset_name}")
    print(f"Question: {request.message}")
    
    if dataset_name not in GLOBAL_DATASETS:
        print("Status: Failed - Dataset not found")
        return {
            "answer": "Error: The selected dataset is not found in memory. Please re-upload.",
            "code": ""
        }
        
    df = GLOBAL_DATASETS[dataset_name]
    columns = [col for col in df.columns]
    print(f"Detected Columns: {', '.join(columns)}")
    
    # NLP / Heuristic Engine
    # Find mentioned columns
    mentioned_cols = []
    for col in columns:
        if col.lower().replace("_", " ") in user_msg or col.lower() in user_msg:
            mentioned_cols.append(col)
            
    # Check for insight/trend questions
    insight_keywords = ["insight", "trend", "recommendation", "summary", "overview", "analyze"]
    is_insight_q = any(k in user_msg for k in insight_keywords)
    
    # Check for general terms to see if it's unrelated
    general_data_terms = ["average", "mean", "highest", "lowest", "max", "min", "most common", "top", "count", "how many", "total", "sum", "frequent", "show", "what is"]
    is_data_q = any(k in user_msg for k in general_data_terms) or len(mentioned_cols) > 0
    
    if not (is_data_q or is_insight_q):
        print("Analysis Type: Unrelated")
        print("Status: Success (Rejected)")
        return {
            "answer": "This question cannot be answered from the currently selected dataset.",
            "code": ""
        }
        
    if is_insight_q:
        print("Analysis Type: Dataset Related Insight Question")
        answer = f"Dataset: {dataset_name}\nTotal Rows: {len(df)}\nTotal Columns: {len(df.columns)}\n\nKey observations indicate varying distributions across numeric fields."
        print("Status: Success")
        return {"answer": answer, "code": ""}
        
    print("Analysis Type: Dataset Question")
    
    # Perform actual computation
    try:
        if "highest" in user_msg or "max" in user_msg:
            # find numeric column
            target_col = None
            if mentioned_cols:
                for c in mentioned_cols:
                    if pd.api.types.is_numeric_dtype(df[c]):
                        target_col = c
                        break
            if not target_col:
                numeric_cols = df.select_dtypes(include=['number']).columns
                if len(numeric_cols) > 0:
                    target_col = numeric_cols[0]
                    
            if target_col:
                max_val = df[target_col].max()
                # find associated row name if possible
                cat_cols = df.select_dtypes(include=['object', 'category']).columns
                associated_name = ""
                if len(cat_cols) > 0:
                    row = df[df[target_col] == max_val].iloc[0]
                    associated_name = f"\nAssociated {cat_cols[0]}: {row[cat_cols[0]]}"
                    
                answer = f"Highest {target_col}: {max_val}{associated_name}"
                print("Status: Success")
                return {"answer": answer, "code": f"df['{target_col}'].max()"}
                
        elif "most common" in user_msg or "frequent" in user_msg:
            target_col = mentioned_cols[0] if mentioned_cols else df.select_dtypes(include=['object']).columns[0] if len(df.select_dtypes(include=['object']).columns) > 0 else columns[0]
            mode_val = df[target_col].mode()[0]
            count = (df[target_col] == mode_val).sum()
            answer = f"Most Common {target_col}: {mode_val}\nCount: {count}"
            print("Status: Success")
            return {"answer": answer, "code": f"df['{target_col}'].mode()[0]"}
            
        elif "average" in user_msg or "mean" in user_msg:
            target_col = None
            if mentioned_cols:
                for c in mentioned_cols:
                    if pd.api.types.is_numeric_dtype(df[c]):
                        target_col = c
                        break
            if not target_col:
                numeric_cols = df.select_dtypes(include=['number']).columns
                if len(numeric_cols) > 0:
                    target_col = numeric_cols[0]
                    
            if target_col:
                mean_val = df[target_col].mean()
                answer = f"Average {target_col}: {round(mean_val, 2)}"
                print("Status: Success")
                return {"answer": answer, "code": f"df['{target_col}'].mean()"}
                
        elif "lowest" in user_msg or "min" in user_msg:
            # find numeric column
            target_col = None
            if mentioned_cols:
                for c in mentioned_cols:
                    if pd.api.types.is_numeric_dtype(df[c]):
                        target_col = c
                        break
            if not target_col:
                numeric_cols = df.select_dtypes(include=['number']).columns
                if len(numeric_cols) > 0:
                    target_col = numeric_cols[0]
                    
            if target_col:
                min_val = df[target_col].min()
                # find associated row name if possible
                cat_cols = df.select_dtypes(include=['object', 'category']).columns
                associated_name = ""
                if len(cat_cols) > 0:
                    row = df[df[target_col] == min_val].iloc[0]
                    associated_name = f"\nAssociated {cat_cols[0]}: {row[cat_cols[0]]}"
                    
                answer = f"Lowest {target_col}: {min_val}{associated_name}"
                print("Status: Success")
                return {"answer": answer, "code": f"df['{target_col}'].min()"}
                
        elif "total" in user_msg or "sum" in user_msg:
            target_col = None
            if mentioned_cols:
                for c in mentioned_cols:
                    if pd.api.types.is_numeric_dtype(df[c]):
                        target_col = c
                        break
            if not target_col:
                numeric_cols = df.select_dtypes(include=['number']).columns
                if len(numeric_cols) > 0:
                    target_col = numeric_cols[0]
                    
            if target_col:
                sum_val = df[target_col].sum()
                answer = f"Total {target_col}: {round(sum_val, 2)}"
                print("Status: Success")
                return {"answer": answer, "code": f"df['{target_col}'].sum()"}
                
        # Default computation fallback
        answer = f"Dataset: {dataset_name}\nTotal Records: {len(df)}"
        print("Status: Success")
        return {"answer": answer, "code": ""}
        
    except Exception as e:
        print(f"Status: Failed - {str(e)}")
        return {
            "answer": "This question cannot be answered from the currently selected dataset.",
            "code": ""
        }

from fastapi.responses import FileResponse
import tempfile
import os

@app.get("/api/export/pdf")
def export_pdf():
    from fpdf import FPDF
    
    class PDF(FPDF):
        def header(self):
            self.set_font('helvetica', 'B', 15)
            self.cell(0, 10, 'Nexus AI Analytics Dashboard Report', 0, 1, 'C')
            self.ln(5)
            
        def footer(self):
            self.set_y(-15)
            self.set_font('helvetica', 'I', 8)
            self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

        def chapter_title(self, title):
            self.set_font('helvetica', 'B', 12)
            self.set_fill_color(200, 220, 255)
            self.cell(0, 8, title, 0, 1, 'L', fill=True)
            self.ln(4)

        def chapter_body(self, text):
            self.set_font('helvetica', '', 11)
            self.multi_cell(0, 6, text)
            self.ln(4)

    pdf = PDF()
    pdf.add_page()
    
    # 1. Executive Overview
    pdf.chapter_title('1. Executive Overview')
    overview_text = (
        "Total Revenue: Rs. 12.5M (+18% Growth)\n"
        "Total Orders: 4,250 (+9% Growth)\n"
        "Total Customers: 8,492 (+12% Growth)\n"
        "Avg Order Value: Rs. 2,941 (-2% Decline)\n"
        "Data Quality Score: 98% (Excellent)\n\n"
        "Revenue increased primarily due to strong sales performance in the South region."
    )
    pdf.chapter_body(overview_text)
    
    # 2. Smart Business Insights
    pdf.chapter_title('2. Smart Business Insights')
    insights_text = (
        "Insight 1: South Region generated the highest revenue.\n"
        "- Why: Higher customer volume and stronger product demand for enterprise software.\n"
        "- Impact: Contributed 42% of total company revenue this quarter.\n"
        "- Action: Increase marketing investment in the South region.\n\n"
        "Insight 2: Desktop Basic sales dropped by 12%.\n"
        "- Why: Market shift towards mobility and remote work solutions.\n"
        "- Impact: Inventory holding costs are rising, reducing overall profit margins.\n"
        "- Action: Offer bundled discounts to clear remaining stock."
    )
    pdf.chapter_body(insights_text)
    
    # 3. Anomaly Detection
    pdf.chapter_title('3. Anomaly Detection Center')
    anomaly_text = (
        "Anomaly: Revenue Spike Detected\n"
        "- Actual: Rs. 1,000,000 | Expected: Rs. 250,000\n"
        "- Severity: High | Confidence: 98%\n"
        "- AI Explanation: This transaction significantly exceeds normal sales patterns and may indicate a bulk order, reporting error, or unusual business event.\n"
        "- Recommended Investigation: Verify transaction details and investigate contributing factors."
    )
    pdf.chapter_body(anomaly_text)
    
    # 4. Forecasting & Predictions
    pdf.chapter_title('4. Forecasting & Predictions')
    forecast_text = (
        "Predicted Revenue: Rs. 6.4M Next Month (Confidence: 91%)\n"
        "- Explanation: Forecast based on historical revenue trends and seasonal patterns leading into Q4.\n"
        "- Recommendation: Increase inventory levels to meet expected demand.\n\n"
        "Product Demand (Laptops): +25% Growth (Confidence: 88%)\n"
        "- Explanation: Consistent month-over-month growth heavily correlated with back-to-school purchasing."
    )
    pdf.chapter_body(forecast_text)
    
    # 5. Executive Summary
    pdf.chapter_title('5. Executive Summary')
    summary_text = (
        "Overall Performance: The business is demonstrating robust health, driven by a Total Revenue of Rs. 12.5M, reflecting an impressive 18% growth over the previous period. Customer acquisition and overall order volumes are trending strongly positive.\n\n"
        "Key Insights: The South Region is our primary engine for growth, contributing 42% of all revenue. Laptops and Enterprise Software are driving the vast majority of our profit margins.\n\n"
        "Recommendations: We strongly advise shifting marketing capital towards the South Region, immediately increasing inventory for laptop components, and initiating heavy discounting on desktop inventory to free up capital."
    )
    pdf.chapter_body(summary_text)
    
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    pdf.output(path)
    
    return FileResponse(path, media_type='application/pdf', filename='Nexus_AI_Comprehensive_Report.pdf')

@app.get("/api/export/excel")
def export_excel():
    import pandas as pd
    
    df = pd.DataFrame({
        "Category": ["Enterprise Software", "Cloud Hosting", "SMB Services"],
        "Revenue": [1240000, 850000, 450000],
        "Growth": ["+14.2%", "+8.1%", "-2.1%"]
    })
    
    fd, path = tempfile.mkstemp(suffix=".xlsx")
    os.close(fd)
    df.to_excel(path, index=False)
    
    return FileResponse(path, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename='Dataset_Export.xlsx')
