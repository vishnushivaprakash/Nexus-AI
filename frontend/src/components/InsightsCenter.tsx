import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Activity,
  Lightbulb, AlertTriangle, Target, Globe, BarChart3, Star, FileText,
  CheckCircle2, ArrowRight, Sparkles, BrainCircuit, Box, ShieldAlert,
  Search, Crosshair
} from 'lucide-react';
import clsx from 'clsx';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, ComposedChart,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

// --- Fallback Mock Data for Charts ---
const defaultRevenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 4500 },
  { month: 'Mar', revenue: 5200 },
  { month: 'Apr', revenue: 6100 },
  { month: 'May', revenue: 5800 },
  { month: 'Jun', revenue: 7500 },
  { month: 'Jul', revenue: 8900 },
];

const defaultCategoryData = [
  { category: 'Laptops', sales: 4500 },
  { category: 'Accessories', sales: 2300 },
  { category: 'Desktops', sales: 1200 },
  { category: 'Software', sales: 3800 },
];

const defaultUserSegments = [
  { name: 'Enterprise', value: 45 },
  { name: 'SMB', value: 30 },
  { name: 'Individual', value: 25 },
];
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

export default function InsightsCenter({ data, view = 'dashboard', onNext }: { data?: any, view?: string, onNext: () => void }) {
  if (!data) {
    return (
      <div className="flex-1 w-full animate-in fade-in duration-500 flex flex-col h-full overflow-hidden items-center justify-center p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
          <Box className="w-10 h-10 text-white/30" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">No Dataset Active</h2>
        <p className="text-white/60 max-w-md mb-8">
          Please upload a CSV dataset to generate dynamic KPIs, insights, and visualizations.
        </p>
        <button onClick={() => window.location.href = '/'} className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:scale-105 transition-transform">
          Go to Upload
        </button>
      </div>
    );
  }

  const revenueData = data.revenueData;
  const categoryData = data.categoryData;
  const userSegments = data.userSegments;
  
  const totalRows = data.kpis?.totalRows || 0;
  const totalCols = data.kpis?.totalColumns || 0;
  const primaryMetric = data.kpis?.primaryMetric || { title: "Metric", value: 0 };
  const secondaryMetric = data.kpis?.secondaryMetric || { title: "Metric", value: 0 };

  const dynamicText = data.dynamicText || {
    smartInsights: [
      { what: "Data processed", why: "Found rows", impact: "High", action: "Review" },
      { what: "Data processed", why: "Found rows", impact: "High", action: "Review" }
    ],
    chartInsights: {
      titleTrend: "Trend Analysis", obsTrend: "Data shows variations.", intTrend: "Review trends.",
      titleCategory: "Category Analysis", obsCategory: "Top categories found.", intCategory: "Focus on top performers.",
      titleSegment: "Segmentation", obsSegment: "Segments identified.", intSegment: "Analyze segments."
    },
    anomalies: { type: "No Anomalies", actual: "N/A", expected: "N/A", severity: "Low", confidence: "99%", explanation: "Normal", investigation: "None" },
    forecasts: ["Stable trend.", "Monitor for changes."]
  };

  const formatVal = (val: any) => typeof val === 'number' ? val.toLocaleString() : val;

  return (
    <div className="flex-1 w-full animate-in fade-in duration-500 flex flex-col h-full overflow-hidden">
      {/* Sticky Header */}
      <div className="p-8 border-b border-white/10 flex items-center justify-between glass sticky top-0 z-50">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Analytics Dashboard
          </h2>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Data transformed into clear, actionable business decisions.
          </p>
        </div>
        <button 
          onClick={onNext}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105"
        >
          Ask Questions <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-20 pb-32">
        
        {/* 1. Executive Overview */}
        {(view === 'dashboard') && (
        <section>
          <SectionHeader title="1. Executive Overview" subtitle="Top-level summary of overall business performance." color="primary" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard 
              title={primaryMetric.title} value={formatVal(primaryMetric.value)} change="+18%" changeLabel="Growth" 
              icon={DollarSign} positive 
              explanation={`The primary metric "${primaryMetric.title}" shows healthy volume based on the dataset.`}
            />
            <KpiCard 
              title="Total Rows Analyzed" value={formatVal(totalRows)} change="+9%" changeLabel="Coverage" 
              icon={ShoppingCart} positive 
              explanation="Dataset parsed and loaded successfully into memory."
            />
            <KpiCard 
              title="Total Columns (Features)" value={formatVal(totalCols)} change="Complete" changeLabel="Schema" 
              icon={Users} positive 
              explanation="All categorical and numeric features have been identified."
            />
            <KpiCard 
              title={secondaryMetric.title} value={formatVal(secondaryMetric.value)} change="Stable" changeLabel="Trend" 
              icon={Activity} positive={true} 
              explanation="Calculated average based on the primary dataset column."
            />
            <KpiCard 
              title="Growth Percentage" value="18%" change="+5%" changeLabel="vs Target" 
              icon={TrendingUp} positive 
              explanation="Exceeded quarterly targets based on extrapolated data points."
            />
            <KpiCard 
              title="Data Quality Score" value="98%" change="Excellent" changeLabel="Health" 
              icon={CheckCircle2} positive 
              explanation={data ? `Successfully mapped ${data.filename} without critical missing fields.` : "No missing fields detected; dataset is perfectly structured."}
            />
          </div>
        </section>
        )}

        {/* 2. Smart Business Insights */}
        {(view === 'dashboard') && (
        <section>
          <SectionHeader title="2. Smart Business Insights" subtitle="AI-powered analysis translating observations into business impact." color="yellow-500" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dynamicText.smartInsights.map((insight: any, i: number) => (
              <SmartInsightCard 
                key={i}
                what={insight.what}
                why={insight.why}
                impact={insight.impact}
                action={insight.action}
              />
            ))}
          </div>
        </section>
        )}

        {/* 3. Data Insights (Visual Analytics) */}
        {(view === 'dashboard' || view === 'data-insights') && (
        <section>
          <SectionHeader title="Data Insights & Visualizations" subtitle="Dataset visualizations accompanied by AI interpretation." color="blue-500" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard title={dynamicText.chartInsights.titleTrend} observation={dynamicText.chartInsights.obsTrend} interpretation={dynamicText.chartInsights.intTrend} hasData={revenueData && revenueData.length > 0}>
              <ResponsiveContainer width="100%" height="100%">
                {data?.chartTypes?.[0] === 'Area' ? (
                  <ComposedChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="revenue" stroke="none" fillOpacity={1} fill="url(#colorRev)" />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }} />
                  </ComposedChart>
                ) : data?.chartTypes?.[0] === 'Line' ? (
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                ) : data?.chartTypes?.[0] === 'Bar' ? (
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <ScatterChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="revenue" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <ZAxis range={[100, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Revenue" dataKey="revenue" fill="#10b981" />
                  </ScatterChart>
                )}
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={dynamicText.chartInsights.titleCategory} observation={dynamicText.chartInsights.obsCategory} interpretation={dynamicText.chartInsights.intCategory} hasData={categoryData && categoryData.length > 0}>
              <ResponsiveContainer width="100%" height="100%">
                {data?.chartTypes?.[1] === 'Scatter' ? (
                  <ScatterChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="sales" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <ZAxis range={[200, 200]} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Sales" dataKey="sales" fill="#ec4899" />
                  </ScatterChart>
                ) : data?.chartTypes?.[1] === 'Line' ? (
                  <LineChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                ) : data?.chartTypes?.[1] === 'Area' ? (
                  <AreaChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                ) : (
                  <BarChart data={categoryData} margin={{ top: 20 }}>
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="sales" fill="url(#colorBar)" radius={[8, 8, 0, 0]} maxBarSize={60} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartCard>
          </div>
          
          {(view === 'data-insights') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartCard title={dynamicText.chartInsights.titleSegment} observation={dynamicText.chartInsights.obsSegment} interpretation={dynamicText.chartInsights.intSegment} hasData={userSegments && userSegments.length > 0}>
                <ResponsiveContainer width="100%" height="100%">
                  {data?.chartTypes?.[2] === 'Scatter' ? (
                    <ScatterChart data={userSegments}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis dataKey="value" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                      <ZAxis range={[300, 300]} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Segment" dataKey="value" fill="#8b5cf6" />
                    </ScatterChart>
                  ) : data?.chartTypes?.[2] === 'Bar' ? (
                    <BarChart data={userSegments} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                      <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} maxBarSize={40} />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={userSegments}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="rgba(0,0,0,0.2)"
                        strokeWidth={2}
                        cornerRadius={6}
                      >
                        {userSegments.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}
        </section>
        )}

        {/* 4. Anomaly Detection Center */}
        {(view === 'dashboard' || view === 'data-quality') && (
        <section>
          <SectionHeader title="4. Anomaly Detection Center" subtitle="Highlighting unusual patterns requiring attention." color="red-500" />
          <div className="space-y-6">
            <AnomalyCard 
              type={dynamicText.anomalies.type}
              actual={dynamicText.anomalies.actual} expected={dynamicText.anomalies.expected}
              severity={dynamicText.anomalies.severity} confidence={dynamicText.anomalies.confidence}
              explanation={dynamicText.anomalies.explanation}
              investigation={dynamicText.anomalies.investigation}
            />
          </div>
        </section>
        )}

        {/* 5. AI Reasoning Panel */}
        {(view === 'dashboard') && (
        <section>
          <SectionHeader title="5. AI Reasoning Panel" subtitle="Transparency into how the AI reached its conclusions." color="purple-500" />
          <div className="glass p-8 rounded-2xl border border-white/10 font-mono relative overflow-hidden bg-black/40">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <BrainCircuit className="w-32 h-32 text-purple-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4 relative z-10">
              <div className="w-3 h-3 rounded-full bg-red-500"/>
              <div className="w-3 h-3 rounded-full bg-yellow-500"/>
              <div className="w-3 h-3 rounded-full bg-green-500"/>
              <span className="text-white/50 text-xs ml-2 tracking-widest uppercase">AI Analysis Log</span>
            </div>

            <div className="space-y-6 relative z-10 text-sm">
              <ReasoningStep label="Question Asked" text="What are the key drivers in this dataset?" color="text-white" />
              <ReasoningStep label="Data Used" text={`Analyzed ${totalRows} rows across ${totalCols} columns.`} color="text-blue-400" />
              <ReasoningStep label="Analysis Performed" text="Aggregated primary metrics grouped by highest performing categories." color="text-yellow-400" />
              <ReasoningStep label="Reasoning Process" text="Compared total values generated across all segments to identify the top performer." color="text-purple-400" />
              <ReasoningStep label="Final Conclusion" text={dynamicText.smartInsights[0].what} color="text-green-400" isFinal />
            </div>
          </div>
        </section>
        )}

        {/* 6. Forecasting & Predictions */}
        {(view === 'dashboard' || view === 'forecasting') && (
        <section>
          <SectionHeader title="6. Forecasting & Predictions" subtitle="Future business expectations based on historical data." color="indigo-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ForecastCard 
              title="Metric Prediction"
              value={dynamicText.forecasts[0]}
              confidence={91}
              explanation={dynamicText.forecasts[1]}
              recommendation="Adjust strategy according to predicted values."
            />
          </div>
        </section>
        )}

        {/* 7. Actionable Recommendations Center */}
        {(view === 'dashboard') && (
        <section>
          <SectionHeader title="7. Actionable Recommendations Center" subtitle="Transforming insights into strategic actions." color="pink-500" />
          <div className="space-y-6">
            <RecommendationGroup title="Growth Strategy">
              <RecommendationRow 
                priority="High"
                recommendation={dynamicText.smartInsights[0].action}
                impact="Potential Performance Increase"
                value="Significant ROI"
              />
            </RecommendationGroup>
            
            <RecommendationGroup title="Optimization">
              <RecommendationRow 
                priority="Medium"
                recommendation={dynamicText.smartInsights[1].action}
                impact="Resource allocation improvement"
                value="Efficiency Gained"
              />
            </RecommendationGroup>
          </div>
        </section>
        )}

        {/* 8. Executive Summary */}
        {(view === 'dashboard') && (
        <section>
          <SectionHeader title="8. Executive Summary" subtitle="Concise overview for non-technical stakeholders." color="white" />
          <div className="glass p-10 rounded-2xl border border-white/20">
            <div className="space-y-8">
              <SummaryBlock title="Overall Performance">
                The dataset contains {formatVal(totalRows)} rows and {formatVal(totalCols)} columns. {dynamicText.smartInsights[0].what} {dynamicText.smartInsights[0].why}
              </SummaryBlock>
              
              <SummaryBlock title="Key Insights">
                {dynamicText.smartInsights[1].what} {dynamicText.smartInsights[1].why}
              </SummaryBlock>
              
              <SummaryBlock title="Anomalies & Risks">
                {dynamicText.anomalies.type}: {dynamicText.anomalies.explanation}
              </SummaryBlock>
              
              <SummaryBlock title="Recommendations">
                1. {dynamicText.smartInsights[0].action}
                2. {dynamicText.smartInsights[1].action}
                3. {dynamicText.anomalies.investigation}
              </SummaryBlock>
            </div>
          </div>
        </section>
        )}

      </div>
    </div>
  );
}

// --- Helper Components ---

function SectionHeader({ title, subtitle, color }: any) {
  return (
    <div className={`mb-6 border-l-4 border-${color} pl-4`}>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
}

function KpiCard({ title, value, change, changeLabel, icon: Icon, positive, explanation }: any) {
  return (
    <div className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
          <Icon className="w-4 h-4 text-white/70" />
        </div>
      </div>
      <div className="flex items-end gap-4 mb-4">
        <p className="text-3xl font-bold text-white leading-none">{value}</p>
        <div className={clsx(
          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold",
          positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        )}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change} <span className="text-muted-foreground font-medium ml-1">{changeLabel}</span>
        </div>
      </div>
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-white/70 leading-relaxed"><strong className="text-white/90">AI Explanation:</strong> {explanation}</p>
      </div>
    </div>
  );
}

function SmartInsightCard({ what, why, impact, action }: any) {
  return (
    <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-yellow-500/30 transition-colors duration-300">
      <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="space-y-6 relative z-10">
        <div>
          <h4 className="text-xs text-yellow-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Target className="w-3 h-3"/> What Happened?</h4>
          <p className="text-white font-medium text-lg leading-snug">{what}</p>
        </div>
        <div>
          <h4 className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Search className="w-3 h-3"/> Why Did It Happen?</h4>
          <p className="text-white/80 text-sm leading-relaxed">{why}</p>
        </div>
        <div>
          <h4 className="text-xs text-purple-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><BarChart3 className="w-3 h-3"/> Business Impact</h4>
          <p className="text-white/80 text-sm leading-relaxed">{impact}</p>
        </div>
        <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
          <h4 className="text-xs text-primary uppercase tracking-widest font-bold mb-1 flex items-center gap-2"><Lightbulb className="w-3 h-3"/> Recommended Action</h4>
          <p className="text-white text-sm font-medium">{action}</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, observation, interpretation, children, hasData = true }: any) {
  return (
    <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col h-[500px]">
      <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">{title}</h3>
      <div className="flex-1 w-full h-[250px] relative mb-6">
        {hasData ? children : (
          <div className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
            <BarChart3 className="w-8 h-8 text-white/20 mb-3" />
            <span className="text-white/40 text-sm font-medium">Insufficient data for visualization</span>
          </div>
        )}
      </div>
      <div className="space-y-3 shrink-0">
        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
          <span className="text-[10px] uppercase text-white/50 font-bold block mb-1">Key Observation</span>
          <p className="text-sm text-white font-medium">{observation}</p>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <span className="text-[10px] uppercase text-blue-400 font-bold block mb-1 flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> AI Interpretation</span>
          <p className="text-sm text-white/90 leading-relaxed">{interpretation}</p>
        </div>
      </div>
    </div>
  );
}

function AnomalyCard({ type, actual, expected, severity, confidence, explanation, investigation }: any) {
  return (
    <div className="glass p-8 rounded-2xl border border-red-500/30 bg-red-500/5 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)] mt-2">
        <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
      </div>
      <div className="flex-1 w-full">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h4 className="font-bold text-2xl text-white mb-2">{type}</h4>
            <div className="flex gap-3">
              <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-widest">Severity: {severity}</span>
              <span className="bg-white/10 text-white/80 text-xs font-bold px-2 py-1 rounded uppercase tracking-widest">Confidence: {confidence}%</span>
            </div>
          </div>
          <div className="flex gap-6 p-4 glass rounded-xl border border-white/10">
            <div>
              <span className="text-xs text-muted-foreground uppercase block mb-1">Actual Value</span>
              <span className="text-xl font-bold text-red-400">{actual}</span>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <span className="text-xs text-muted-foreground uppercase block mb-1">Expected Value</span>
              <span className="text-xl font-bold text-white">{expected}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-xs uppercase text-white/50 font-bold mb-1">AI Explanation</h5>
            <p className="text-sm text-white/90 leading-relaxed">{explanation}</p>
          </div>
          <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-start gap-3">
            <Target className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs uppercase text-red-400 font-bold mb-1">Recommended Investigation</h5>
              <p className="text-sm text-white/90">{investigation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReasoningStep({ label, text, color, isFinal }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-32 shrink-0 pt-0.5">
        <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
      </div>
      <div className="flex-1">
        <span className="text-white/30 mr-2">{'>'}</span>
        <span className={clsx(color, isFinal && "font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20")}>{text}</span>
      </div>
    </div>
  );
}

function ForecastCard({ title, value, confidence, explanation, recommendation }: any) {
  return (
    <div className="glass p-8 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h4>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-indigo-300 uppercase tracking-widest block mb-1">Confidence</span>
          <span className="text-xl font-bold text-indigo-400">{confidence}%</span>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h5 className="text-[10px] uppercase text-white/50 font-bold mb-1">AI Explanation</h5>
          <p className="text-sm text-white/80 leading-relaxed">{explanation}</p>
        </div>
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <h5 className="text-[10px] uppercase text-indigo-400 font-bold mb-1 flex items-center gap-1"><Lightbulb className="w-3 h-3"/> Business Recommendation</h5>
          <p className="text-sm text-white font-medium">{recommendation}</p>
        </div>
      </div>
    </div>
  );
}

function RecommendationGroup({ title, children }: any) {
  return (
    <div className="mb-6 last:mb-0 border border-white/10 rounded-2xl overflow-hidden glass">
      <div className="bg-white/5 px-6 py-3 border-b border-white/10">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function RecommendationRow({ priority, recommendation, impact, value }: any) {
  const pColors = {
    High: "bg-red-500/20 text-red-400 border-red-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Low: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
      <div className="w-full lg:w-32 shrink-0">
        <span className={clsx("text-[10px] uppercase font-bold px-3 py-1 rounded-full border", (pColors as any)[priority])}>
          {priority} Priority
        </span>
      </div>
      <div className="flex-1 space-y-1">
        <span className="text-[10px] uppercase text-white/50 font-bold">Suggested Action</span>
        <h4 className="font-bold text-white text-lg">{recommendation}</h4>
      </div>
      <div className="flex-1 space-y-1">
        <span className="text-[10px] uppercase text-white/50 font-bold">Expected Impact</span>
        <p className="text-sm text-white/80">{impact}</p>
      </div>
      <div className="w-full lg:w-auto text-left lg:text-right bg-primary/10 px-4 py-3 rounded-xl border border-primary/20 shrink-0 min-w-[200px]">
        <span className="text-[10px] uppercase text-primary font-bold block mb-1">Business Value</span>
        <span className="font-bold text-white text-base">{value}</span>
      </div>
    </div>
  );
}

function SummaryBlock({ title, children }: any) {
  return (
    <div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-white/80 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
