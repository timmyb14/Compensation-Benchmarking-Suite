import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Building, 
  DollarSign, 
  Globe, 
  Sliders, 
  Info, 
  ExternalLink, 
  TrendingUp, 
  RotateCw, 
  Printer, 
  FileText, 
  ChevronRight, 
  Download, 
  Plus, 
  CheckCircle2, 
  Bookmark, 
  Trash2, 
  Sparkles, 
  Gauge, 
  Building2, 
  Milestone,
  BookOpen
} from 'lucide-react';
import { COUNTRIES_AND_CITIES, INDUSTRIES, DEPARTMENTS_AND_TITLES, TITLE_DEFAULT_ROLES } from './data';

// Form Fields Interface
interface BenchmarkingCriteria {
  department: string;
  jobTitle: string;
  jobRole: string;
  experienceLevel: string;
  industry: string;
  country: string;
  location: string;
  companySize: string;
  revenue: string;
  additionalContext: string;
}

// Structured Benchmarking Response Model
interface AllowanceItem {
  name: string;
  value: string;
  importance: string;
}

interface MarketInsightItem {
  title: string;
  description: string;
  level: string;
}

interface SourceItem {
  title: string;
  url: string;
  snippet: string;
}

interface BenchmarkReport {
  summary: string;
  currency: string;
  benchmark: {
    percentile25: number;
    percentile50: number;
    percentile75: number;
    percentile90: number;
    equityRange: string;
    annualBonusPercent: number;
    allowances: AllowanceItem[];
  };
  marketInsights: MarketInsightItem[];
  locationContext: string;
  sources: SourceItem[];
  criteria: BenchmarkingCriteria; // saved with results
  timestamp: string;
  id: string;
}

// Initial Criteria Template
const DEFAULT_CRITERIA: BenchmarkingCriteria = {
  department: 'Engineering & Technology',
  jobTitle: 'Software Engineer',
  jobRole: 'Develop and maintain core application modules, write clean frontend/backend code, and write automated tests.',
  experienceLevel: 'Senior',
  industry: 'Technology & SaaS',
  country: 'United States',
  location: 'New York City, NY',
  companySize: 'Mid-Market (51-200)',
  revenue: '$10M - $50M',
  additionalContext: ''
};

// Quick blueprints for onboarding
const BLUEPRINTS = [
  {
    name: 'Dubai Dev Lead',
    department: 'Engineering & Technology',
    title: 'Lead Software Engineer',
    role: 'Technical leadership, system design, and managing a team of 6 engineers on microservices architecture.',
    level: 'Lead / Staff',
    industry: 'Technology & SaaS',
    country: 'United Arab Emirates',
    location: 'Dubai',
    companySize: 'Scale-Up (201-500)',
    revenue: '$10M - $50M',
    context: 'Expatriate employment. Focus on Cooper Fitch indices and housing allowances.'
  },
  {
    name: 'NYC HR Director',
    department: 'Human Resources & Talent',
    title: 'Director of Human Resources',
    role: 'Strategizing talent acquisition, global employee engagement, compliance, and managing HR teams.',
    level: 'Director',
    industry: 'Professional & Management Consulting',
    country: 'United States',
    location: 'New York City, NY',
    companySize: 'Medium Enterprise (501-1000)',
    revenue: '$50M - $250M',
    context: 'Consider highly competitive Tri-State area constraints and Manhattan premiums.'
  },
  {
    name: 'London Finance VP',
    department: 'Finance & Accounting',
    title: 'Vice President of Finance',
    role: 'Strategic financial operations, budgeting, investor reporting, and managing M&A processes.',
    level: 'Executive',
    industry: 'Financial Services, Banking & Fintech',
    country: 'United Kingdom',
    location: 'London',
    companySize: 'Large Enterprise (1000+)',
    revenue: '> $1B',
    context: 'Focus on banking bonus percentages and City of London standard allowances.'
  }
];

export default function App() {
  const [criteria, setCriteria] = useState<BenchmarkingCriteria>(DEFAULT_CRITERIA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadStep, setLoadStep] = useState<number>(0);
  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forceOffline, setForceOffline] = useState<boolean>(false);
  
  // Custom Offer Comparator Slider State
  const [customOfferInput, setCustomOfferInput] = useState<string>('');
  
  // Salary and Compensation adjustments Sandbox state
  const [remoteAdjustment, setRemoteAdjustment] = useState<number>(0); // -20% to +20%
  const [startupMultiplier, setStartupMultiplier] = useState<number>(1); // 0.8 to 1.2
  
  // Saved Scenarios Drawer
  const [savedReports, setSavedReports] = useState<BenchmarkReport[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'perks' | 'sources'>('overview');

  // Loading Steps Animated List
  const loadingSteps = [
    { title: 'Deconstructing Job Taxonomy', desc: 'Analyzing title seniority, industry sector, and job scope mapping' },
    { title: 'Activating Search Grounding Index', desc: 'Connecting to live search engines to scrape compensation portals' },
    { title: 'Querying Consultant Indexes', desc: 'Tapping into Robert Half, Cooper Fitch, Mercer, and Payscale publications' },
    { title: 'Processing Percentile Distributions', desc: 'Calculating base levels, average annual bonuses, and equity brackets' },
    { title: 'Synthesizing Geographical Benefits', desc: 'Evaluating localized micro-geography allowances, tax, and COL markers' }
  ];

  // Load saved history on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('salary_benchmarks_history');
      if (stored) {
        setSavedReports(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Interval timer for the researcher simulator
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadStep(0);
      interval = setInterval(() => {
        setLoadStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Form Submission with Back-End Integration
  const fetchBenchmark = async (targetCriteria: BenchmarkingCriteria) => {
    if (!targetCriteria.jobTitle.trim()) {
      setError('Please provide a Job Title to run the benchmarking.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);
    setLoadStep(0);

    try {
      const response = await fetch('/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...targetCriteria,
          forceOffline
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${response.status}: Failed to reach grounding service.`);
      }

      const parsedData = await response.json();
      
      const newReport: BenchmarkReport = {
        ...parsedData,
        criteria: { ...targetCriteria },
        timestamp: new Date().toLocaleString(),
        id: `rep_${Date.now()}`
      };

      setReport(newReport);
      // Auto-set custom offer input to the median (P50) for immediate sandbox visual
      setCustomOfferInput(newReport.benchmark.percentile50.toString());
      setRemoteAdjustment(0);
      setStartupMultiplier(1);
      setActiveTab('overview');

      // Save to history list
      setSavedReports(prev => {
        const updated = [newReport, ...prev.filter(r => r.criteria.jobTitle !== newReport.criteria.jobTitle || r.criteria.location !== newReport.criteria.location)].slice(0, 10);
        localStorage.setItem('salary_benchmarks_history', JSON.stringify(updated));
        return updated;
      });

    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'A network error occurred. Please check that the server is online.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyBlueprint = (blueprint: typeof BLUEPRINTS[0]) => {
    const updated: BenchmarkingCriteria = {
      department: blueprint.department,
      jobTitle: blueprint.title,
      jobRole: blueprint.role,
      experienceLevel: blueprint.level,
      industry: blueprint.industry,
      country: blueprint.country,
      location: blueprint.location,
      companySize: blueprint.companySize,
      revenue: blueprint.revenue,
      additionalContext: blueprint.context
    };
    setCriteria(updated);
    fetchBenchmark(updated);
  };

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedReports(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('salary_benchmarks_history', JSON.stringify(updated));
      return updated;
    });
    if (report && report.id === id) {
      setReport(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe Export to CSV
  const handleExportCSV = () => {
    if (!report) return;
    const { benchmark, summary, marketInsights, locationContext, criteria: c } = report;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Compensation Benchmark Report: ${c.jobTitle}\n`;
    csvContent += `Run Date: ${report.timestamp}\n`;
    csvContent += `Industry,${c.industry}\n`;
    csvContent += `Geography,${c.location}, ${c.country}\n`;
    csvContent += `Scale,${c.companySize} | ${c.revenue}\n\n`;
    csvContent += `Metric,Value (${report.currency})\n`;
    csvContent += `25th Percentile Base,${benchmark.percentile25}\n`;
    csvContent += `50th Percentile Base (Median),${benchmark.percentile50}\n`;
    csvContent += `75th Percentile Base,${benchmark.percentile75}\n`;
    csvContent += `90th Percentile Base (Top Tier),${benchmark.percentile90}\n`;
    csvContent += `Annual Bonus Expectation,${benchmark.annualBonusPercent}%\n`;
    csvContent += `Equity Compensation,${benchmark.equityRange || 'N/A'}\n\n`;
    csvContent += `Executive Context:\n"${summary.replace(/"/g, '""')}"\n\n`;
    
    csvContent += `Fringe Allowances:\n`;
    benchmark.allowances?.forEach(a => {
      csvContent += `"${a.name}","${a.value.replace(/"/g, '""')}","${a.importance}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `compensation_benchmark_${c.jobTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Math engine: calculates percentile of an input offer based on the P25, P50, P75, P90 indices
  const getOfferPercentile = (offer: number, report: BenchmarkReport): number => {
    const { percentile25: p25, percentile50: p50, percentile75: p75, percentile90: p90 } = report.benchmark;
    
    if (offer <= p25) {
      const percentage = (offer / p25) * 25;
      return Math.round(Math.max(1, percentage));
    }
    if (offer <= p50) {
      const fraction = (offer - p25) / (p50 - p25);
      return Math.round(25 + fraction * 25);
    }
    if (offer <= p75) {
      const fraction = (offer - p50) / (p75 - p50);
      return Math.round(50 + fraction * 25);
    }
    if (offer <= p90) {
      const fraction = (offer - p75) / (p90 - p75);
      return Math.round(75 + fraction * 15);
    }
    // Beyond 90th percentile
    const differenceRatio = (offer - p90) / p90;
    return Math.round(Math.min(99, 90 + differenceRatio * 10));
  };

  // Sandbox calculations: multiplies original numbers based on live modifiers
  const getAdjustedSalary = (original: number): number => {
    const locationMod = 1 + (remoteAdjustment / 100);
    const scaleMod = startupMultiplier;
    return Math.round(original * locationMod * scaleMod);
  };

  // Safe numerical input conversion
  const customOfferNum = parseFloat(customOfferInput) || 0;
  const currentPercentile = report ? getOfferPercentile(customOfferNum, {
    ...report,
    benchmark: {
      ...report.benchmark,
      percentile25: getAdjustedSalary(report.benchmark.percentile25),
      percentile50: getAdjustedSalary(report.benchmark.percentile50),
      percentile75: getAdjustedSalary(report.benchmark.percentile75),
      percentile90: getAdjustedSalary(report.benchmark.percentile90),
    }
  }) : 50;

  // Render interactive SVG Bell/Salary Curve
  const renderSalaryCurve = () => {
    if (!report) return null;
    
    // Get adjusted percentile values for curve
    const p25 = getAdjustedSalary(report.benchmark.percentile25);
    const p50 = getAdjustedSalary(report.benchmark.percentile50);
    const p75 = getAdjustedSalary(report.benchmark.percentile75);
    const p90 = getAdjustedSalary(report.benchmark.percentile90);

    const minXVal = Math.round(p25 * 0.5);
    const maxXVal = Math.round(p90 * 1.3);
    const rangeX = maxXVal - minXVal;

    // Map a salary dollar amount into physical X-coordinate (0 to 100% of SVG viewport)
    // SVG width: 500, height: 160
    const getXCoord = (val: number) => {
      const pct = (val - minXVal) / rangeX;
      return Math.min(480, Math.max(30, 30 + pct * 440));
    };

    // Y values based on distribution probability density (smooth bell curve peaked near P50-P60)
    const points = [
      { s: minXVal, y: 150 },
      { s: p25, y: 120 },
      { s: p50, y: 40 }, // Peak close to median
      { s: p75, y: 80 },
      { s: p90, y: 130 },
      { s: maxXVal, y: 153 }
    ];

    // Generate accurate path string for SVG Bezier
    let path = `M 30,155 L ${getXCoord(points[0].s)},153`;
    for (let i = 0; i < points.length - 1; i++) {
      const pCurrent = points[i];
      const pNext = points[i + 1];
      const x1 = getXCoord(pCurrent.s);
      const y1 = pCurrent.y;
      const x2 = getXCoord(pNext.s);
      const y2 = pNext.y;
      const cpX1 = x1 + (x2 - x1) / 2;
      const cpY1 = y1;
      const cpX2 = x1 + (x2 - x1) / 2;
      const cpY2 = y2;
      path += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${x2},${y2}`;
    }
    path += ` L 480,155 Z`;

    const offersPlacedX = getXCoord(customOfferNum);
    // Find proportional Y for custom offer dot
    let placementsY = 150;
    if (customOfferNum <= p25) {
      const ratio = (customOfferNum - minXVal) / (p25 - minXVal);
      placementsY = 153 - (153 - 120) * Math.max(0, ratio);
    } else if (customOfferNum <= p50) {
      const ratio = (customOfferNum - p25) / (p50 - p25);
      placementsY = 120 - (120 - 40) * ratio;
    } else if (customOfferNum <= p75) {
      const ratio = (customOfferNum - p50) / (p75 - p50);
      placementsY = 40 + (80 - 40) * ratio;
    } else if (customOfferNum <= p90) {
      const ratio = (customOfferNum - p75) / (p90 - p75);
      placementsY = 80 + (130 - 80) * ratio;
    } else {
      const ratio = Math.min(1, (customOfferNum - p90) / (maxXVal - p90));
      placementsY = 130 + (153 - 130) * ratio;
    }

    return (
      <div className="relative w-full bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-2">
            <TrendingUp size={16} /> Base Compensation Curve
          </h4>
          <span className="text-xs text-slate-400">Values in {report.currency} / year</span>
        </div>
        
        <div className="relative w-full h-44 mt-4">
          <svg className="w-full h-full text-slate-800" viewBox="0 0 500 170" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Filled distribution gradient area */}
            <path d={path} fill="url(#curveGradient)" />
            
            {/* Outline curve path */}
            <path d={path.replace(' Z', '')} fill="none" stroke="#2dd4bf" strokeWidth="2.5" />

            {/* Horizontal Zero-axis baseline */}
            <line x1="10" y1="155" x2="490" y2="155" stroke="#334155" strokeWidth="1" />

            {/* Percentile Vertical grid guides */}
            <line x1={getXCoord(p25)} x1-coord={p25} y1="120" x2={getXCoord(p25)} y2="155" stroke="#475569" strokeDasharray="3,3" />
            <line x1={getXCoord(p50)} x1-coord={p50} y1="40" x2={getXCoord(p50)} y2="155" stroke="#14b8a6" strokeDasharray="3,3" />
            <line x1={getXCoord(p75)} x1-coord={p75} y1="80" x2={getXCoord(p75)} y2="155" stroke="#475569" strokeDasharray="3,3" />
            <line x1={getXCoord(p90)} x1-coord={p90} y1="130" x2={getXCoord(p90)} y2="155" stroke="#475569" strokeDasharray="3,3" />

            {/* User Custom Offer Pinpoint */}
            {customOfferNum > 0 && (
              <g className="transition-all duration-300">
                <line x1={offersPlacedX} y1={placementsY} x2={offersPlacedX} y2="155" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2,2" />
                <circle cx={offersPlacedX} cy={placementsY} r="6.5" fill="#f43f5e" className="animate-pulse" />
                <circle cx={offersPlacedX} cy={placementsY} r="3.5" fill="#ffffff" />
              </g>
            )}
          </svg>

          {/* Value markers on curve points */}
          <div className="absolute top-[125px] transform -translate-x-1/2 text-center" style={{ left: `${(getXCoord(p25) / 500) * 100}%` }}>
            <span className="block text-[10px] font-medium text-slate-400">P25</span>
            <span className="text-[11px] font-semibold text-slate-300">{p25.toLocaleString()}</span>
          </div>
          <div className="absolute top-[12px] transform -translate-x-1/2 text-center" style={{ left: `${(getXCoord(p50) / 500) * 100}%` }}>
            <span className="block text-[10px] font-semibold text-teal-300">Median (P50)</span>
            <span className="text-xs font-bold text-teal-400">{p50.toLocaleString()}</span>
          </div>
          <div className="absolute top-[85px] transform -translate-x-1/2 text-center" style={{ left: `${(getXCoord(p75) / 500) * 100}%` }}>
            <span className="block text-[10px] font-medium text-slate-400">P75</span>
            <span className="text-[11px] font-semibold text-slate-300">{p75.toLocaleString()}</span>
          </div>
          <div className="absolute top-[132px] transform -translate-x-1/2 text-center" style={{ left: `${(getXCoord(p90) / 500) * 100}%` }}>
            <span className="block text-[10px] font-medium text-slate-400">P90</span>
            <span className="text-[11px] font-semibold text-slate-300">{p90.toLocaleString()}</span>
          </div>
        </div>

        {/* Dynamic offer details */}
        {customOfferNum > 0 && (
          <div className="mt-8 bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs text-slate-400">Target Offer Comparer Status</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-rose-400">{report.currency} {customOfferNum.toLocaleString()}</span>
                <span className="text-xs font-semibold text-slate-400">/ yr</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-right">
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider">Placement</span>
                <span className="text-sm font-bold text-slate-200">{currentPercentile}th Percentile</span>
              </div>
              
              <div className={`px-4 py-2 rounded-lg font-bold text-xs ${
                currentPercentile <= 35 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : currentPercentile <= 65 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : currentPercentile <= 85 
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {currentPercentile <= 35 
                  ? 'Below Market Rate' 
                  : currentPercentile <= 65 
                    ? 'Competitive Market Rate' 
                    : currentPercentile <= 85 
                      ? 'Premium Package' 
                      : 'Highly Defensive / Executive Tier'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Absolute Header Branding */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-teal-400 shadow-md">
              <Briefcase size={22} />
            </div>
            <div>
              <h1 id="app-title" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Compensation Benchmarking Suite <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200">HR Professional</span>
              </h1>
              <p className="text-xs text-slate-500">Real-time salary models grounded in active job markets, surveys & consultant salary indices</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {report && (
              <>
                <button 
                  onClick={handlePrint}
                  id="btn-print"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg cursor-pointer transition-all duration-150"
                >
                  <Printer size={15} /> Print Report
                </button>
                <button 
                  onClick={handleExportCSV}
                  id="btn-csv"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg cursor-pointer transition-all duration-150 text-slate-700"
                >
                  <Download size={15} /> Export CSV
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Custom inputs, Criteria parameters, History logs */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Main Parameters input Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-sm tracking-wider uppercase flex items-center gap-2">
                <Sliders size={16} className="text-teal-600" /> Benchmark Inputs
              </h2>
              <button 
                onClick={() => setCriteria(DEFAULT_CRITERIA)}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium transition"
              >
                Reset
              </button>
            </div>

            {/* Core Job Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={criteria.department}
                  onChange={(e) => {
                    const selectedDept = e.target.value;
                    const titles = DEPARTMENTS_AND_TITLES[selectedDept] || [];
                    const firstTitle = titles[0] || '';
                    const defaultRole = TITLE_DEFAULT_ROLES[firstTitle] || '';
                    setCriteria({
                      ...criteria,
                      department: selectedDept,
                      jobTitle: firstTitle,
                      jobRole: defaultRole
                    });
                  }}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition font-semibold text-slate-800"
                >
                  {Object.keys(DEPARTMENTS_AND_TITLES).map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div>
                  <select 
                    value={
                      criteria.department && (DEPARTMENTS_AND_TITLES[criteria.department] || []).includes(criteria.jobTitle) 
                        ? criteria.jobTitle 
                        : "CUSTOM_TITLE"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "CUSTOM_TITLE") {
                        setCriteria({ ...criteria, jobTitle: "", jobRole: "" });
                      } else {
                        const defaultRole = TITLE_DEFAULT_ROLES[val] || '';
                        setCriteria({ ...criteria, jobTitle: val, jobRole: defaultRole });
                      }
                    }}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition font-medium text-slate-800"
                  >
                    {(DEPARTMENTS_AND_TITLES[criteria.department] || []).map((title) => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                    <option value="CUSTOM_TITLE">✍️ Specify completely custom title...</option>
                  </select>

                  {/* Manual input if other specified or custom title currently loaded */}
                  {(!criteria.jobTitle || !(DEPARTMENTS_AND_TITLES[criteria.department] || []).includes(criteria.jobTitle)) && (
                    <div className="mt-2 relative">
                      <span className="absolute left-3 top-2.5 text-slate-400"><Briefcase size={14} /></span>
                      <input 
                        type="text"
                        required
                        placeholder="Type custom job title..."
                        value={criteria.jobTitle}
                        onChange={(e) => setCriteria({ ...criteria, jobTitle: e.target.value })}
                        className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition font-semibold text-slate-700"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Section in case the list doesn't cover it */}
                <div className="mt-3 p-3 bg-slate-100/50 border border-slate-200/85 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      💡 Dedicated Custom Title Section
                    </span>
                    <span className="text-[9px] text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-full font-semibold">
                      Override Area
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    If our core preloaded list of {(DEPARTMENTS_AND_TITLES[criteria.department] || []).length} job titles does not accurately cover your designation, type your specific title here to override selection.
                  </p>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400"><Briefcase size={13} /></span>
                    <input 
                      type="text"
                      placeholder="e.g. Principal Enablement Architect, Chief of Staff..."
                      value={criteria.jobTitle}
                      onChange={(e) => setCriteria({ ...criteria, jobTitle: e.target.value })}
                      className="w-full text-xs pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition font-medium text-slate-800"
                    />
                  </div>
                  {!(DEPARTMENTS_AND_TITLES[criteria.department] || []).includes(criteria.jobTitle) && criteria.jobTitle && (
                    <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <span>✓</span> Custom title applied successfully.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scope & Core Responsibilities <span className="text-slate-400">(Recommended)</span>
                </label>
                <textarea 
                  rows={2}
                  placeholder="Describe direct reports, tech stacks, budget authority, or key expectations..."
                  value={criteria.jobRole}
                  onChange={(e) => setCriteria({ ...criteria, jobRole: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none resize-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seniority Level
                  </label>
                  <select 
                    value={criteria.experienceLevel}
                    onChange={(e) => setCriteria({ ...criteria, experienceLevel: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition"
                  >
                    <option value="Junior">Junior (0-2 yrs)</option>
                    <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
                    <option value="Senior">Senior (5+ yrs)</option>
                    <option value="Lead / Staff">Lead / Staff Specialist</option>
                    <option value="Manager">Manager / Team Leader</option>
                    <option value="Director">Director / Head of Dept</option>
                    <option value="Executive">Executive / VP / C-Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    Industry Sector
                  </label>
                  <select 
                    value={criteria.industry}
                    onChange={(e) => setCriteria({ ...criteria, industry: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Geography & Demographics */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    Country
                  </label>
                  <select 
                    value={criteria.country}
                    onChange={(e) => {
                      const selectedCountry = e.target.value;
                      const cities = COUNTRIES_AND_CITIES[selectedCountry] || [];
                      const defaultCity = cities[0] || '';
                      setCriteria({ ...criteria, country: selectedCountry, location: defaultCity });
                    }}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition"
                  >
                    <option value="">Select Country...</option>
                    {Object.keys(COUNTRIES_AND_CITIES).sort().map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1" title="City, County, state or postal borough boundaries">
                    Micro-Location <span className="text-slate-400 text-[10px]">(City/County)</span>
                  </label>
                  <div>
                    <select 
                      value={criteria.country && (COUNTRIES_AND_CITIES[criteria.country] || []).includes(criteria.location) ? criteria.location : (criteria.country ? "CUSTOM_LOCATION" : "")}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "CUSTOM_LOCATION") {
                          setCriteria({ ...criteria, location: "" });
                        } else {
                          setCriteria({ ...criteria, location: val });
                        }
                      }}
                      disabled={!criteria.country}
                      className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition"
                    >
                      {!criteria.country && <option value="">Select country first</option>}
                      {criteria.country && <option value="">Select City...</option>}
                      {criteria.country && (COUNTRIES_AND_CITIES[criteria.country] || []).map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                      {criteria.country && <option value="CUSTOM_LOCATION">✍️ Other / Specify manually...</option>}
                    </select>

                    {/* Custom text entry input if other/specify manually chosen or blueprint applied a custom region */}
                    {criteria.country && (!criteria.location || !(COUNTRIES_AND_CITIES[criteria.country] || []).includes(criteria.location)) && (
                      <div className="mt-2 relative">
                        <span className="absolute left-2.5 top-1.5 text-slate-400"><MapPin size={11} /></span>
                        <input 
                          type="text"
                          placeholder="Type custom region..."
                          value={criteria.location}
                          onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                          className="w-full text-xs pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee Scale
                  </label>
                  <select 
                    value={criteria.companySize}
                    onChange={(e) => setCriteria({ ...criteria, companySize: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition"
                  >
                    <option value="Boutique (1-10)">Boutique (1-10)</option>
                    <option value="Small Business (11-50)">Small Business (11-50)</option>
                    <option value="Mid-Market (51-200)">Mid-Market (51-200)</option>
                    <option value="Scale-Up (201-500)">Scale-Up (201-500)</option>
                    <option value="Medium Enterprise (501-1000)">Med Enterprise (501-1000)</option>
                    <option value="Large Enterprise (1000+)">Large Enterprise (1000+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Revenue
                  </label>
                  <select 
                    value={criteria.revenue}
                    onChange={(e) => setCriteria({ ...criteria, revenue: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition"
                  >
                    <option value="Seed / Pre-revenue">Seed / Pre-revenue</option>
                    <option value="Under $5M">Under $5M</option>
                    <option value="$5M - $20M">$5M - $20M</option>
                    <option value="$20M - $100M">$20M - $100M</option>
                    <option value="$100M - $500M">$100M - $500M</option>
                    <option value="Over $500M">Over $500M</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Consulting Guides or Requests <span className="text-slate-400">(Optional)</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. cross-reference with Cooper Fitch guides..."
                  value={criteria.additionalContext}
                  onChange={(e) => setCriteria({ ...criteria, additionalContext: e.target.value })}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none transition"
                />
              </div>
            </div>

            {/* Offline Mode Selection */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl transition cursor-pointer select-none">
                <div className="space-y-0.5 pr-2">
                  <span className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                    🧭 Offline Heuristics Engine
                  </span>
                  <span className="block text-[10px] text-slate-500 leading-tight">
                    Bypass live search limits and generate estimations instantly.
                  </span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceOffline}
                    onChange={(e) => setForceOffline(e.target.checked)}
                    className="sr-only peer"
                    id="checkbox-force-offline"
                  />
                  <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-teal-600"></div>
                </div>
              </label>
            </div>

            {/* Submission triggers */}
            <button
              onClick={() => fetchBenchmark(criteria)}
              disabled={isLoading || !criteria.jobTitle.trim()}
              id="btn-run-benchmark"
              className="w-full py-3 bg-slate-900 border border-slate-950 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-200 disabled:border-slate-200 disabled:text-slate-400 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw size={16} className="animate-spin text-teal-400" /> Grounding Research Running...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-teal-400" /> Verify Salary Benchmarks
                </>
              )}
            </button>
            
            {error && (
              <div id="error-message" className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-red-500" />
                <div className="space-y-1">
                  <p className="font-semibold">Benchmarking Execution Halted</p>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Verification Blueprints Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase mb-3 flex items-center gap-1.5 text-slate-500">
              <Milestone size={14} className="text-teal-600" /> Rapid Onboarding Blueprints
            </h3>
            <p className="text-xs text-slate-500 mb-4">Click a sector blueprint to pre-complete coordinates and automatically launch a real-time web grounding run.</p>
            
            <div className="space-y-3">
              {BLUEPRINTS.map((bp) => (
                <button
                  key={bp.name}
                  onClick={() => handleApplyBlueprint(bp)}
                  disabled={isLoading}
                  className="w-full text-left p-3 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 rounded-lg transition group flex justify-between items-center bg-slate-50 shadow-2xs"
                >
                  <div className="space-y-1 pr-4">
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-teal-600 transition">{bp.name}</span>
                    <span className="block text-[11px] text-slate-500 line-clamp-1">{bp.title} • {bp.location}</span>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-teal-500 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Historical Run Lists */}
          {savedReports.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase mb-3 flex items-center gap-2 text-slate-500">
                <Bookmark size={15} className="text-teal-600" /> Verification History ({savedReports.length})
              </h3>
              
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {savedReports.map((saved) => (
                  <div
                    key={saved.id}
                    onClick={() => {
                      setReport(saved);
                      // Reset multipliers
                      setRemoteAdjustment(0);
                      setStartupMultiplier(1);
                      setCustomOfferInput(saved.benchmark.percentile50.toString());
                    }}
                    className={`p-2.5 rounded-lg border transition text-left cursor-pointer flex justify-between items-center group ${
                      report && report.id === saved.id 
                        ? 'border-teal-500 bg-teal-50/15' 
                        : 'border-slate-200 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <span className="block text-xs font-semibold text-slate-800 leading-tight truncate max-w-[170px]">{saved.criteria.jobTitle}</span>
                      <span className="block text-[10px] text-slate-400 truncate max-w-[170px]">{saved.criteria.location || saved.criteria.country || 'Global'} ({saved.currency})</span>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteReport(saved.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Interface pane */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Loading Step Sequence indicator */}
          {isLoading && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-md p-8 text-center space-y-8 flex flex-col justify-center items-center py-16">
              <div className="relative flex justify-center items-center">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-teal-500 animate-spin" />
                <Briefcase size={24} className="absolute text-slate-900 animate-pulse" />
              </div>
              
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-slate-900">Research Grounding Engine Active</h3>
                <p className="text-sm text-slate-500">Cross-referencing global talent portals, localized indexes, and consulting salaries guides. This will build a precise benchmark curve.</p>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="w-full max-w-lg space-y-4 text-left">
                {loadingSteps.map((step, index) => {
                  const isCurrent = loadStep === index;
                  const isDone = loadStep > index;
                  const isNext = loadStep < index;
                  
                  return (
                    <div 
                      key={step.title}
                      className={`flex gap-4 p-3 rounded-lg border transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-slate-950 text-white border-slate-900 shadow-md scale-102 font-medium' 
                          : isDone 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100 opacity-60' 
                            : 'bg-slate-50 text-slate-400 border-slate-150'
                      }`}
                    >
                      <div className="shrink-0 flex items-center justify-center mt-0.5">
                        {isDone ? (
                          <CheckCircle2 size={18} className="text-emerald-500 animate-bounce" />
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-teal-400 animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold flex items-center justify-center">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-teal-400' : 'text-slate-800'}`}>{step.title}</p>
                        <p className="text-[11px] opacity-90 leading-normal">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Welcome State when empty */}
          {!isLoading && !report && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center shadow-xs">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
                  <Sliders size={28} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Generate Live Salary & Reward Benchmarks</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Simply state the position title, location, industry, and organizational size context.
                    Our engine queries active global job markets and salary surveying registries using <span className="font-semibold text-slate-800">Google Search Grounding</span>, extracting structural components of base compensation, allowances, bonuses, and tax regimes.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 text-left grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Comprehensive Coverage
                    </h4>
                    <p className="text-xs text-slate-500">Retrieves data targeting localized districts, counties, states, or country-level structures depending on availability.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Reliable Grounding Trace
                    </h4>
                    <p className="text-xs text-slate-500">Provides direct URLs and citations linked with consulting references (such as Cooper Fitch salary guides) to protect organizational trust.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Interactive Sandbox tools
                    </h4>
                    <p className="text-xs text-slate-500">Calibrates compensation lines instantly based on custom location parameters or remote work adjustments.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Compensation Structure
                    </h4>
                    <p className="text-xs text-slate-500">Captures detailed allowances (housing, transport), performance bonuses, and equity ranges.</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  To get started immediately, enter job details in the left panel, or choose one of our rapid onboard templates.
                </p>
              </div>
            </div>
          )}

          {/* 3. Full Benchmark Report Panel */}
          {!isLoading && report && (
            <div id="benchmark-report" className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              
              {/* Header Card with Core Job Information metadata */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-500/10 text-teal-300 font-semibold text-[10px] uppercase tracking-wider rounded border border-teal-500/20">
                      Grounded Market Intelligence
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">{report.criteria.jobTitle}</h2>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-teal-400" /> {report.criteria.location || 'Global'}, {report.criteria.country || 'Global'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 size={14} className="text-teal-400" /> {report.criteria.companySize} • {report.criteria.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} className="text-teal-400" /> Revenue: {report.criteria.revenue}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Report Generated</span>
                    <span className="text-xs font-medium text-slate-200 mt-0.5">{report.timestamp}</span>
                    <span className="mt-2 text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20">
                      Base currency: {report.currency}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 border-t border-slate-800 pt-4 leading-relaxed line-clamp-3 md:line-clamp-none">
                  {report.summary}
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-slate-50 border-y border-slate-100 px-6 py-2 flex gap-4 overflow-x-auto print:hidden">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 pt-1.5 border-b-2 px-1 transition shrink-0 cursor-pointer ${
                    activeTab === 'overview' 
                      ? 'border-teal-600 text-teal-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Salary & Sandbox Curve
                </button>
                <button 
                  onClick={() => setActiveTab('insights')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 pt-1.5 border-b-2 px-1 transition shrink-0 cursor-pointer ${
                    activeTab === 'insights' 
                      ? 'border-teal-600 text-teal-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Market Dynamics
                </button>
                <button 
                  onClick={() => setActiveTab('perks')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 pt-1.5 border-b-2 px-1 transition shrink-0 cursor-pointer ${
                    activeTab === 'perks' 
                      ? 'border-teal-600 text-teal-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Fringe Perks & Benefits
                </button>
                <button 
                  onClick={() => setActiveTab('sources')}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 pt-1.5 border-b-2 px-1 transition shrink-0 cursor-pointer ${
                    activeTab === 'sources' 
                      ? 'border-teal-600 text-teal-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sources & Grounding ({report.sources?.length || 0})
                </button>
              </div>

              {/* Tab: Overview, Salary bell curve slider, sandbox modifiers */}
              {activeTab === 'overview' && (
                <div className="p-6 space-y-6">
                  {/* Visual SVG curve */}
                  {renderSalaryCurve()}

                  {/* Multipliers & Scenario Builder */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Sliders size={14} className="text-teal-600" /> Geography adjustments Sandbox
                        </h4>
                        <span className={`text-xs font-extrabold ${remoteAdjustment < 0 ? 'text-red-500' : remoteAdjustment === 0 ? 'text-slate-500' : 'text-teal-500'}`}>
                          {remoteAdjustment > 0 ? `+${remoteAdjustment}%` : `${remoteAdjustment}%`}
                        </span>
                      </div>
                      
                      <input 
                        type="range"
                        min="-20"
                        max="20"
                        step="5"
                        value={remoteAdjustment}
                        onChange={(e) => setRemoteAdjustment(parseInt(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>High-COL Discount (-20%)</span>
                        <span>As Scraped (0%)</span>
                        <span>Market Premium (+20%)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Building className="text-teal-600" size={14} /> Venture Size Modifier
                        </h4>
                        <span className="text-xs font-extrabold text-teal-600">
                          {startupMultiplier === 0.8 ? 'Discounted (0.8x)' : startupMultiplier === 1 ? 'Standard (1.0x)' : 'Premium (1.2x)'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setStartupMultiplier(0.8)}
                          className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition ${
                            startupMultiplier === 0.8 
                              ? 'bg-teal-500/10 text-teal-600 border-teal-500/30' 
                              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          Seed / Bootstrap
                        </button>
                        <button 
                          onClick={() => setStartupMultiplier(1)}
                          className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition ${
                            startupMultiplier === 1 
                              ? 'bg-teal-500/10 text-teal-600 border-teal-500/30' 
                              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          Corporate Par
                        </button>
                        <button 
                          onClick={() => setStartupMultiplier(1.2)}
                          className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition ${
                            startupMultiplier === 1.2 
                              ? 'bg-teal-500/10 text-teal-600 border-teal-500/30' 
                              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          Hyper-Scale
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">Apply standardized adjustment templates representing early-stage seed businesses versus hyper-scale cash reserves.</p>
                    </div>
                  </div>

                  {/* Offer Comparer Box */}
                  <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4 print:hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Gauge size={16} className="text-rose-500" /> Interactive Offer Evaluator
                        </h4>
                        <p className="text-xs text-slate-500">Test an proposed or active candidate package against the verified market range above.</p>
                      </div>
                      
                      <div className="relative w-full sm:w-44">
                        <span className="absolute left-2.5 top-2 text-slate-400 font-semibold text-xs">{report.currency}</span>
                        <input 
                          type="number"
                          placeholder="Salary offer amt"
                          value={customOfferInput}
                          onChange={(e) => setCustomOfferInput(e.target.value)}
                          className="w-full text-xs font-bold pl-10 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-teal-500 focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-600">The slider coordinates let you manually slide salaries over the full distribution spectrum:</p>
                      <input 
                        type="range"
                        min={Math.round(getAdjustedSalary(report.benchmark.percentile25) * 0.5)}
                        max={Math.round(getAdjustedSalary(report.benchmark.percentile90) * 1.3)}
                        step="1000"
                        value={customOfferNum}
                        onChange={(e) => setCustomOfferInput(e.target.value)}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Core Numeric Table (Base and cash components) */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="bg-slate-50 border-b border-slate-100 p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Unified Cash Components Matrix</h4>
                    </div>
                    
                    <div className="divide-y divide-slate-100 text-sm">
                      <div className="p-4 grid grid-cols-12 gap-2 hover:bg-slate-50/50">
                        <span className="col-span-6 font-bold text-slate-800">Average Annual Performance Bonus</span>
                        <span className="col-span-3 text-right font-medium text-slate-500">Industry Standard</span>
                        <span className="col-span-3 text-right font-bold text-teal-600">{report.benchmark.annualBonusPercent}% of base</span>
                      </div>
                      
                      <div className="p-4 grid grid-cols-12 gap-2 hover:bg-slate-50/50">
                        <span className="col-span-6 font-bold text-slate-800">Equity Grant Range</span>
                        <span className="col-span-3 text-right font-medium text-slate-500">Vest / Options</span>
                        <span className="col-span-3 text-right font-bold text-slate-800">{report.benchmark.equityRange || 'Not standard'}</span>
                      </div>

                      <div className="p-4 grid grid-cols-12 gap-2">
                        <span className="col-span-6 font-bold text-slate-850">Location Cost Climate (Micro-Local COL)</span>
                        <span className="col-span-3 text-right font-medium text-slate-500">Geography multiplier</span>
                        <span className="col-span-3 text-right font-bold text-slate-800">
                          {report.criteria.location ? `${report.criteria.location} indexed` : 'Generic baseline'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Market Dynamics & Trends */}
              {activeTab === 'insights' && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {report.marketInsights?.map((insight, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${
                            insight.level === 'High' 
                              ? 'bg-red-50 text-red-600 border-red-100' 
                              : insight.level === 'Medium' 
                                ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            Demand Index: {insight.level || 'Standard'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">{insight.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-1">{insight.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Local Geography and regulatory nuances context */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-850 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <Globe size={15} /> Specific Location Tax & Compensation Regulations Context
                    </h4>
                    
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {report.locationContext}
                    </p>
                    
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 leading-normal">
                      💡 <span className="font-semibold text-slate-200">HR Advisory Note:</span> In highly specific micro-geographies (like Silicon Valley, Dubai Freezones, or London City boroughs), secondary regional compensations may override country frameworks. Verify localized fringe regulations to prevent non-compliance limits.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Fringe perks and allocations */}
              {activeTab === 'perks' && (
                <div className="p-6 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Scraped Allowances & Fringe Benefit Frameworks</h3>
                    <p className="text-xs text-slate-500">Common structures for this position as extracted directly from regional consulting guides.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.benchmark.allowances && report.benchmark.allowances.length > 0 ? (
                      report.benchmark.allowances.map((perk, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 shadow-3xs hover:border-slate-300 transition">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold leading-none ${
                            perk.importance === 'High' 
                              ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                              : perk.importance === 'Standard'
                                ? 'bg-teal-50 text-teal-600 border border-teal-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {perk.importance === 'High' ? 'H' : perk.importance === 'Standard' ? 'S' : 'L'}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{perk.name}</h4>
                              <span className="text-[9px] text-slate-400">• Priority: {perk.importance}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">{perk.value}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-slate-400 text-sm">
                        No specific allowance breakdowns specified by source indices for this grade. Fully wrapped into unified base salary blocks.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Sources and live web groundings URL references */}
              {activeTab === 'sources' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <BookOpen size={18} className="text-teal-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Verifiable Grounding & consulting Indexes Trace</h3>
                      <p className="text-xs text-slate-500">Direct active citations extracted during analysis. Double-check sources directly to secure HR buy-in.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {report.sources && report.sources.length > 0 ? (
                      report.sources.map((src, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 hover:border-teal-500 hover:bg-white transition">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              📄 {src.title || 'Compensation Survey Document'}
                            </h4>
                            
                            {src.url && (
                              <a 
                                href={src.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10px] text-teal-500 hover:text-teal-600 font-semibold flex items-center gap-1 shadow-2xs bg-white px-2 py-1 rounded-md border border-slate-100 shrink-0 transition"
                              >
                                View Portal Reference <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                          
                          <p className="text-xs text-slate-650 leading-relaxed bg-slate-105 p-3 rounded border border-slate-150">
                            "{src.snippet || 'Secondary verification document analysed.'}"
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No external links logged in the grounding index for this request. Data synthesized using general systemic expertise.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer with compliance warnings */}
              <div className="bg-slate-50 border-t border-slate-150 p-4 px-6 flex justify-between items-center text-[10px] text-slate-500">
                <span>Verification ID: {report.id}</span>
                <span className="italic flex items-center gap-1 text-slate-400">
                  ⚠️ General advisory only. Cross-check localized union mandates before making binding employment offers.
                </span>
              </div>
            </div>
          )}

          {/* Printable layout structure: Hidden in visual desktop, shown in print views */}
          {report && (
            <div className="hidden print:block space-y-8 bg-white p-6 leading-normal font-sans text-xs text-slate-900 select-none">
              <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Executive Compensation Benchmark Report</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Ground-Validated HR Advisory Analytics</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-205 pb-4">
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Benchmarked Title</span>
                  <span className="text-md font-bold text-slate-800">{report.criteria.jobTitle}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Reference Currency</span>
                  <span className="text-md font-bold text-slate-800">{report.currency} / year</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Geography and Industry</span>
                  <span className="font-semibold text-slate-700">{report.criteria.location || 'N/A'}, {report.criteria.country || 'N/A'} • {report.criteria.industry}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Scope Coordinates</span>
                  <span className="font-semibold text-slate-700">{report.criteria.companySize} • {report.criteria.revenue}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-205 pb-1">1. Market Percentile Framework</h3>
                
                <div className="grid grid-cols-4 gap-4 text-center pt-2">
                  <div className="border border-slate-205 rounded p-3 bg-slate-50">
                    <span className="block font-bold text-slate-500 text-[10px]">25th Percentile</span>
                    <span className="text-sm font-bold text-slate-800">{getAdjustedSalary(report.benchmark.percentile25).toLocaleString()}</span>
                    <span className="block text-[8px] text-slate-400">Junior / Entry Floor</span>
                  </div>
                  <div className="border border-slate-205 rounded p-3 bg-teal-50 border-teal-200">
                    <span className="block font-bold text-teal-600 text-[10px]">50th Percentile (Median)</span>
                    <span className="text-sm font-bold text-teal-800">{getAdjustedSalary(report.benchmark.percentile50).toLocaleString()}</span>
                    <span className="block text-[8px] text-teal-500">Standard Competitive</span>
                  </div>
                  <div className="border border-slate-205 rounded p-3 bg-slate-50">
                    <span className="block font-bold text-slate-500 text-[10px]">75th Percentile</span>
                    <span className="text-sm font-bold text-slate-800">{getAdjustedSalary(report.benchmark.percentile75).toLocaleString()}</span>
                    <span className="block text-[8px] text-slate-400">Competent / Experienced</span>
                  </div>
                  <div className="border border-slate-205 rounded p-3 bg-slate-50">
                    <span className="block font-bold text-slate-500 text-[10px]">90th Percentile</span>
                    <span className="text-sm font-bold text-slate-800">{getAdjustedSalary(report.benchmark.percentile90).toLocaleString()}</span>
                    <span className="block text-[8px] text-slate-400">High Performer / Premium</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-205 pb-1">2. Market Summary Context</h3>
                <p className="text-slate-750 text-xs italicleading-relaxed">
                  {report.summary}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-205 pb-1">3. Direct Cash Perks & Allowance structures</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-500 text-[10px] uppercase">Annual Performance bonus</span>
                    <span className="text-xs font-bold text-slate-800">{report.benchmark.annualBonusPercent}% target parameters</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-500 text-[10px] uppercase">Equity Vesting</span>
                    <span className="text-xs font-bold text-slate-800">{report.benchmark.equityRange || 'N/A'}</span>
                  </div>
                </div>

                <table className="w-full mt-2 border border-slate-205 divide-y divide-slate-205 text-left text-[11px]">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2">Allowance Category</th>
                      <th className="p-2">Benchmarked Value</th>
                      <th className="p-2">Mandate Importance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.benchmark.allowances?.map((perk, index) => (
                      <tr key={index}>
                        <td className="p-2 font-bold">{perk.name}</td>
                        <td className="p-2">{perk.value}</td>
                        <td className="p-2">{perk.importance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="font-bold text-slate-900 text-[10px] border-b border-slate-205">4. Live Verification Source Citations</h4>
                <div className="space-y-2">
                  {report.sources?.map((src, index) => (
                    <div key={index} className="text-[10px] space-y-0.5 border-l-2 border-slate-300 pl-2">
                      <span className="block font-bold text-slate-850">{src.title}</span>
                      {src.url && <span className="block text-slate-500 italic truncate max-w-full">{src.url}</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-8 text-[9px] text-slate-400 border-t border-slate-200">
                <span>Verification Audit Code: {report.id} • Printed on behalf of HR Compensation Analytics Specialist.</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Outer Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-10 text-center text-xs text-slate-500 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Compensation Benchmarking Suite. Secured for HR Internal Use.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-800 transition">Grounding: Google Search</span>
            <span>•</span>
            <span className="hover:text-slate-800 transition">Model: gemini-3.5-flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
