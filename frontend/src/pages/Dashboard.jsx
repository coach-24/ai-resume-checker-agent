import AIParticles from "../components/AIParticles"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  AlertTriangle, CheckCircle, XCircle, Sparkles, ArrowLeft,
  Download, Briefcase, Info, ChevronDown, ChevronUp,
  Target, TrendingUp, FileText, Zap
} from "lucide-react"
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell
} from "recharts"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// ── Static fallback ──
const STATIC_FALLBACK = {
  resume_score: 82, skill_match: 76, ats_compatibility: 88, keyword_match: 71,
  potential_score: 91,
  missing_skills: ["Docker", "Kubernetes", "CI/CD", "Microservices"],
  matched_skills: ["React", "Python", "SQL", "Git", "JavaScript"],
  section_health: { experience: "good", skills: "good", education: "good", projects: "average", achievements: "average" },
  suggestions: [
    "Add cloud technologies such as Docker and Kubernetes.",
    "Include measurable achievements in your work experience.",
    "Add more technical keywords relevant to the job description.",
    "Expand your projects section with quantified outcomes.",
    "Write a professional summary tailored to the role.",
    "Add certifications relevant to your target job."
  ],
  ats_issues: [],
  matched_keywords: ["react", "javascript", "python"],
  missing_keywords: ["kubernetes", "terraform", "ci/cd"],
}

// ── Role comparison data ──
const ROLE_PROFILES = {
  "Frontend Developer": { react: 95, javascript: 95, typescript: 85, css: 90, git: 80 },
  "Backend Developer":  { python: 90, sql: 85, docker: 80, aws: 75, git: 80 },
  "Full Stack":         { react: 80, python: 75, sql: 70, docker: 65, git: 85 },
  "Data Scientist":     { python: 95, sql: 85, ml: 90, pandas: 85, tensorflow: 75 },
  "DevOps Engineer":    { docker: 95, kubernetes: 90, aws: 85, cicd: 90, linux: 85 },
}

const HEALTH_CONFIG = {
  good:    { icon: <CheckCircle size={18}/>, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  average: { icon: <AlertTriangle size={18}/>, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  missing: { icon: <XCircle size={18}/>, color: "text-red-400", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", badge: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" },
}

function getScoreColor(score) {
  if (score >= 80) return { text: "text-emerald-500", bar: "bg-emerald-500", ring: "#10b981" }
  if (score >= 60) return { text: "text-blue-500",    bar: "bg-blue-500",    ring: "#3b82f6" }
  return               { text: "text-amber-500",    bar: "bg-amber-500",    ring: "#f59e0b" }
}

function getScoreLabel(score) {
  if (score >= 85) return "Excellent — ready to apply!"
  if (score >= 70) return "Strong resume — a few improvements can push it further."
  if (score >= 55) return "Good start — follow the AI suggestions below."
  return "Needs work — apply all recommendations to improve."
}

function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(0)
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return value
}

// ── Score breakdown data ──
function getScoreBreakdown(data) {
  return [
    { name: "Skill Match",   value: data.skill_match,       weight: "35%", color: "#3b82f6" },
    { name: "ATS Score",     value: data.ats_compatibility,  weight: "35%", color: "#10b981" },
    { name: "Keywords",      value: data.keyword_match,      weight: "20%", color: "#8b5cf6" },
    { name: "Sections",      value: Object.values(data.section_health).filter(v => v === "good").length * 20, weight: "10%", color: "#f59e0b" },
  ]
}

export default function Dashboard() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const reportRef = useRef(null)

  const data   = location.state?.analysisResult || STATIC_FALLBACK
  const isLive = !!location.state?.analysisResult

  // Dark mode
  const { dark } = useTheme()

  // UI state
  const [selectedRole,      setSelectedRole]      = useState("Frontend Developer")
  const [showBreakdown,     setShowBreakdown]      = useState(false)
  const [checkedSuggestions,setCheckedSuggestions] = useState({})
  const [downloading,       setDownloading]        = useState(false)
  const [activeTab,         setActiveTab]          = useState("overview") // overview | compare | tips

  // Animated counters
  const score        = useCountUp(data.resume_score)
  const skillMatch   = useCountUp(data.skill_match)
  const atsScore     = useCountUp(data.ats_compatibility)
  const keywordScore = useCountUp(data.keyword_match)

  const scoreColors = getScoreColor(data.resume_score)

  const radarData = [
    { subject: "Skills",     score: data.skill_match },
    { subject: "Experience", score: data.section_health?.experience  === "good" ? 88 : data.section_health?.experience  === "average" ? 60 : 30 },
    { subject: "Projects",   score: data.section_health?.projects    === "good" ? 85 : data.section_health?.projects    === "average" ? 60 : 25 },
    { subject: "Education",  score: data.section_health?.education   === "good" ? 90 : data.section_health?.education   === "average" ? 65 : 30 },
    { subject: "ATS",        score: data.ats_compatibility },
  ]

  const scoreBreakdown = getScoreBreakdown(data)

  // Role comparison chart
  const roleProfile  = ROLE_PROFILES[selectedRole] || {}
  const resumeSkillSet = new Set(data.matched_skills.map(s => s.toLowerCase()))
  const roleCompareData = Object.entries(roleProfile).map(([skill, required]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    required,
    yours: resumeSkillSet.has(skill) ? Math.min(required, required - 5 + Math.floor(Math.random() * 15)) : Math.floor(required * 0.3),
  }))

  // Recruiter tips based on score
  const recruiterTips = [
    { icon: <Target size={18}/>,    tip: "Tailor your resume for each job — recruiters spend only 6–8 seconds on initial screening." },
    { icon: <TrendingUp size={18}/>,tip: "Use the STAR method (Situation, Task, Action, Result) for every bullet point in experience." },
    { icon: <FileText size={18}/>,  tip: "Keep your resume to 1 page if you have under 5 years of experience." },
    { icon: <Zap size={18}/>,       tip: "Start every bullet point with a strong action verb (Built, Designed, Optimized, Led)." },
    { icon: <Briefcase size={18}/>, tip: "Mirror exact keywords from the job description — ATS systems do exact-match scanning." },
    { icon: <Sparkles size={18}/>,  tip: "Quantify everything possible: 'Improved performance' → 'Improved performance by 40%'." },
  ]

  // PDF download
  const handleDownload = async () => {
    setDownloading(true)
    try {
      const element = reportRef.current
      const canvas  = await html2canvas(element, { scale: 1.5, useCORS: true, backgroundColor: dark ? "#0f172a" : "#f8fafc" })
      const imgData = canvas.toDataURL("image/png")
      const pdf     = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageW   = pdf.internal.pageSize.getWidth()
      const pageH   = pdf.internal.pageSize.getHeight()
      const imgH    = (canvas.height * pageW) / canvas.width
      let   yPos    = 0
      while (yPos < imgH) {
        pdf.addImage(imgData, "PNG", 0, -yPos, pageW, imgH)
        yPos += pageH
        if (yPos < imgH) pdf.addPage()
      }
      pdf.save("AI_Resume_Analysis_Report.pdf")
    } catch (e) {
      console.error("PDF error:", e)
    }
    setDownloading(false)
  }

  const circumference = 2 * Math.PI * 70
  const dashOffset    = circumference - (score / 100) * circumference

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  })

  const card = "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "dark bg-slate-900" : "bg-gradient-to-br from-slate-50 via-white to-blue-50"}`}>

      {/* Particles only in light mode */}
      {!dark && <div className="absolute inset-0 z-0"><AIParticles /></div>}

      <div ref={reportRef} className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-10">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <button onClick={() => navigate("/upload")} className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
            <ArrowLeft size={16}/> Analyze another
          </button>

          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white text-center flex-1">
            AI Resume Analysis Report
          </h1>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isLive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"}`}>
              {isLive ? "● Live Result" : "Demo Data"}
            </span>

            {/* Download PDF */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm rounded-xl font-semibold transition shadow-md shadow-blue-200 dark:shadow-none"
            >
              <Download size={15}/>
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </motion.div>

        {/* ── Tab Navigation ── */}
        <motion.div {...fadeUp(0.05)} className="flex gap-2 mb-8 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-1.5 shadow-sm w-fit mx-auto">
          {[
            { id: "overview", label: "Overview",         icon: <Sparkles size={14}/> },
            { id: "compare",  label: "Role Comparison",  icon: <Briefcase size={14}/> },
            { id: "tips",     label: "Recruiter Tips",   icon: <Target size={14}/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════════════
              TAB 1 — OVERVIEW
          ══════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-8">

              {/* Row 1: Score + Potential */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Score Card */}
                <motion.div {...fadeUp(0.1)} className={`${card} p-10 text-center`}>
                  <div className="relative w-44 h-44 mx-auto mb-5">
                    <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="70" stroke={dark ? "#1e293b" : "#e5e7eb"} strokeWidth="12" fill="transparent"/>
                      <circle
                        cx="80" cy="80" r="70"
                        stroke={scoreColors.ring} strokeWidth="12" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.03s linear", filter: `drop-shadow(0 0 8px ${scoreColors.ring}60)` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-black ${scoreColors.text}`}>{score}%</span>
                      <span className="text-xs text-gray-400 dark:text-slate-500 mt-1">Overall</span>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white text-lg mb-1">Resume Score</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{getScoreLabel(data.resume_score)}</p>

                  {/* Score breakdown toggle */}
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="mt-4 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mx-auto transition"
                  >
                    <Info size={13}/>
                    {showBreakdown ? "Hide" : "How is this calculated?"}
                    {showBreakdown ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                  </button>

                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div
                        initial={{opacity:0, height:0}} animate={{opacity:1, height:"auto"}} exit={{opacity:0, height:0}}
                        className="mt-4 space-y-2 text-left overflow-hidden"
                      >
                        {scoreBreakdown.map(item => (
                          <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}/>
                              <span className="text-gray-600 dark:text-slate-300">{item.name}</span>
                              <span className="text-gray-400 dark:text-slate-500">({item.weight} weight)</span>
                            </div>
                            <span className="font-semibold" style={{color: item.color}}>{item.value}%</span>
                          </div>
                        ))}
                        <p className="text-xs text-gray-400 dark:text-slate-500 pt-2 border-t border-gray-100 dark:border-slate-700">
                          Final score = weighted average of all four metrics
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Improvement Potential */}
                <motion.div {...fadeUp(0.15)} className={`${card} p-8 flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Improvement Potential</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                      Apply the AI suggestions below to boost your score significantly.
                    </p>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 rounded-2xl px-6 py-5">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Current</p>
                      <p className={`text-4xl font-black ${scoreColors.text}`}>{data.resume_score}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 3 ? "bg-blue-400" : "bg-gray-200 dark:bg-slate-600"}`}/>
                        ))}
                      </div>
                      <span className="text-gray-300 dark:text-slate-600 text-lg">→</span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Potential</p>
                      <p className="text-4xl font-black text-emerald-500">{data.potential_score}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-3">
                    +{data.potential_score - data.resume_score} points possible with improvements
                  </p>
                </motion.div>
              </div>

              {/* Row 2: Detailed Metrics */}
              <motion.div {...fadeUp(0.2)} className={`${card} p-8`}>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-8">Detailed Metrics</h3>
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke={dark ? "#334155" : "#e5e7eb"}/>
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fill: dark ? "#94a3b8" : "#6b7280"}}/>
                        <Tooltip formatter={v => [`${v}%`]} contentStyle={{background: dark ? "#1e293b" : "#fff", border: "none", borderRadius: "12px"}}/>
                        <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: "Skill Match",       value: skillMatch,    raw: data.skill_match },
                      { label: "ATS Compatibility", value: atsScore,      raw: data.ats_compatibility },
                      { label: "Keyword Match",     value: keywordScore,  raw: data.keyword_match },
                    ].map(({ label, value, raw }) => {
                      const c = getScoreColor(raw)
                      return (
                        <div key={label}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 dark:text-slate-300 font-medium">{label}</span>
                            <span className={`font-bold ${c.text}`}>{value}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className={`h-2.5 rounded-full ${c.bar}`}
                              initial={{width: 0}}
                              animate={{width: `${raw}%`}}
                              transition={{duration: 1.2, ease: "easeOut"}}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Row 3: Missing Skills + Section Health */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Missing Skills */}
                <motion.div {...fadeUp(0.25)} className={`${card} p-8`}>
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-5">Missing Skills Detected</h3>
                  {data.missing_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {data.missing_skills.map((skill, i) => (
                        <motion.span
                          key={i}
                          initial={{opacity:0, scale:0.8}}
                          animate={{opacity:1, scale:1}}
                          transition={{delay: i * 0.06}}
                          className="px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle size={18}/> No major skill gaps detected!
                    </div>
                  )}

                  {data.matched_skills.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Skills Found in Your Resume</p>
                      <div className="flex flex-wrap gap-2">
                        {data.matched_skills.slice(0, 10).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Section Health */}
                <motion.div {...fadeUp(0.3)} className={`${card} p-8`}>
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-5">Resume Section Health</h3>
                  <div className="space-y-3">
                    {Object.entries(data.section_health).map(([section, status]) => {
                      const cfg = HEALTH_CONFIG[status] || HEALTH_CONFIG.missing
                      return (
                        <motion.div
                          key={section}
                          initial={{opacity:0, x:-10}}
                          animate={{opacity:1, x:0}}
                          className={`flex items-center justify-between p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}
                        >
                          <span className="capitalize font-medium text-gray-700 dark:text-slate-200">{section}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${cfg.badge}`}>{status}</span>
                            <span className={cfg.color}>{cfg.icon}</span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>

              {/* ATS Issues */}
              {data.ats_issues && data.ats_issues.length > 0 && (
                <motion.div {...fadeUp(0.33)} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2 mb-4">
                    <AlertTriangle size={20}/> ATS Compatibility Issues
                  </h3>
                  <ul className="space-y-2">
                    {data.ats_issues.map((issue, i) => (
                      <li key={i} className="text-sm text-orange-700 dark:text-orange-300 flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">•</span><span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* AI Suggestions — with checkboxes */}
              <motion.div {...fadeUp(0.38)} className={`${card} p-10`}>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="text-blue-500" size={22}/> AI Suggestions
                </h3>
                <p className="text-sm text-gray-400 dark:text-slate-500 mb-6">
                  Check off suggestions as you complete them to track your progress.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.suggestions.map((suggestion, i) => (
                    <motion.div
                      key={i}
                      initial={{opacity:0, x:-10}}
                      animate={{opacity:1, x:0}}
                      transition={{delay: 0.4 + i * 0.07}}
                      onClick={() => setCheckedSuggestions(prev => ({...prev, [i]: !prev[i]}))}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        checkedSuggestions[i]
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 opacity-70"
                          : "bg-blue-50 dark:bg-slate-700/50 border-blue-100 dark:border-slate-600 hover:border-blue-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        checkedSuggestions[i]
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-gray-300 dark:border-slate-500"
                      }`}>
                        {checkedSuggestions[i] && <CheckCircle size={12} className="text-white"/>}
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        checkedSuggestions[i]
                          ? "line-through text-gray-400 dark:text-slate-500"
                          : "text-gray-700 dark:text-slate-200"
                      }`}>{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
                {Object.values(checkedSuggestions).filter(Boolean).length > 0 && (
                  <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium text-center">
                    ✓ {Object.values(checkedSuggestions).filter(Boolean).length} of {data.suggestions.length} improvements completed
                  </p>
                )}
              </motion.div>

              {/* Side-by-side: Resume vs JD keywords */}
              {(data.matched_keywords.length > 0 || data.missing_keywords.length > 0) && (
                <motion.div {...fadeUp(0.43)} className={`${card} p-8`}>
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-blue-500"/> Resume vs Job Description
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                        <CheckCircle size={15}/> Keywords Matched ({data.matched_keywords.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.matched_keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                        {data.matched_keywords.length === 0 && (
                          <p className="text-xs text-gray-400">No job description provided</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-3 flex items-center gap-2">
                        <XCircle size={15}/> Keywords Missing ({data.missing_keywords.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.missing_keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                        {data.missing_keywords.length === 0 && (
                          <p className="text-xs text-gray-400">No missing keywords detected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 2 — ROLE COMPARISON
          ══════════════════════════════════════════════════ */}
          {activeTab === "compare" && (
            <motion.div key="compare" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-6">

              <div className={`${card} p-8`}>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">Job Role Comparison</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                  See how your resume skills stack up against different job role requirements.
                </p>

                {/* Role selector */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {Object.keys(ROLE_PROFILES).map(role => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        selectedRole === role
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {/* Bar chart comparison */}
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleCompareData} barCategoryGap="25%">
                      <XAxis dataKey="skill" tick={{fontSize: 11, fill: dark ? "#94a3b8" : "#6b7280"}}/>
                      <YAxis domain={[0,100]} tick={{fontSize: 11, fill: dark ? "#94a3b8" : "#6b7280"}}/>
                      <Tooltip
                        contentStyle={{background: dark ? "#1e293b" : "#fff", border: "none", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)"}}
                        formatter={(v, name) => [`${v}%`, name === "required" ? "Role Requires" : "Your Level"]}
                      />
                      <Bar dataKey="required" name="required" fill="#e2e8f0" radius={[6,6,0,0]}>
                        {roleCompareData.map((_, i) => <Cell key={i} fill={dark ? "#334155" : "#e2e8f0"}/>)}
                      </Bar>
                      <Bar dataKey="yours" name="yours" radius={[6,6,0,0]}>
                        {roleCompareData.map((entry, i) => (
                          <Cell key={i} fill={entry.yours >= entry.required * 0.75 ? "#10b981" : entry.yours >= entry.required * 0.4 ? "#3b82f6" : "#f59e0b"}/>
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-4 justify-center text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-600"/><span className="text-gray-500 dark:text-slate-400">Role Requires</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"/><span className="text-gray-500 dark:text-slate-400">Your Level (Strong)</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"/><span className="text-gray-500 dark:text-slate-400">Your Level (Moderate)</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"/><span className="text-gray-500 dark:text-slate-400">Your Level (Needs work)</span></div>
                </div>
              </div>

              {/* Match summary */}
              <div className={`${card} p-8`}>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-5">
                  Your Match for <span className="text-blue-500">{selectedRole}</span>
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Skills Match",    value: `${Math.round(roleCompareData.filter(d => d.yours >= d.required * 0.75).length / roleCompareData.length * 100)}%`, color: "text-emerald-500" },
                    { label: "Skills to Learn", value: roleCompareData.filter(d => d.yours < d.required * 0.5).map(d => d.skill).join(", ") || "None!", color: "text-amber-500" },
                    { label: "Readiness",       value: roleCompareData.filter(d => d.yours >= d.required * 0.75).length >= 3 ? "Ready to apply" : "Nearly there", color: "text-blue-500" },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">{item.label}</p>
                      <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 3 — RECRUITER TIPS
          ══════════════════════════════════════════════════ */}
          {activeTab === "tips" && (
            <motion.div key="tips" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-6">

              <div className={`${card} p-8`}>
                <h3 className="font-bold text-gray-800 dark:text-white text-xl mb-2 flex items-center gap-2">
                  <Target className="text-blue-500" size={22}/> Recruiter Insider Tips
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">
                  Real insights from how recruiters and ATS systems actually evaluate resumes.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {recruiterTips.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{opacity:0, y:16}}
                      animate={{opacity:1, y:0}}
                      transition={{delay: i * 0.08}}
                      className="flex items-start gap-4 p-5 bg-blue-50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-600 rounded-xl"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed">{item.tip}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Score breakdown explanation */}
              <div className={`${card} p-8`}>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 flex items-center gap-2">
                  <Info size={20} className="text-blue-500"/> Why You Got {data.resume_score}%
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                  Here's exactly how your score was calculated and what each component means.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      label: "Skill Match — 35% of score",
                      value: data.skill_match,
                      explanation: data.skill_match >= 80
                        ? "Excellent — you have most of the skills required for the role."
                        : data.skill_match >= 60
                        ? "Good — add a few more technical skills to improve this."
                        : "Needs improvement — your skill set doesn't strongly match the role yet.",
                      color: getScoreColor(data.skill_match),
                    },
                    {
                      label: "ATS Compatibility — 35% of score",
                      value: data.ats_compatibility,
                      explanation: data.ats_compatibility >= 80
                        ? "Great — your resume is well-structured and ATS-friendly."
                        : "ATS systems may struggle to parse your resume. Fix the issues listed above.",
                      color: getScoreColor(data.ats_compatibility),
                    },
                    {
                      label: "Keyword Match — 20% of score",
                      value: data.keyword_match,
                      explanation: data.keyword_match >= 70
                        ? "Good keyword coverage from the job description."
                        : "Add more keywords from the job description to pass ATS filtering.",
                      color: getScoreColor(data.keyword_match),
                    },
                    {
                      label: "Section Health — 10% of score",
                      value: Object.values(data.section_health).filter(v => v === "good").length * 20,
                      explanation: `You have ${Object.values(data.section_health).filter(v => v === "good").length} strong sections. Add or improve the missing ones.`,
                      color: getScoreColor(Object.values(data.section_health).filter(v => v === "good").length * 20),
                    },
                  ].map(item => (
                    <div key={item.label} className={`p-5 rounded-xl border ${item.color.bar === "bg-emerald-500" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : item.color.bar === "bg-amber-500" ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-gray-700 dark:text-slate-200">{item.label}</span>
                        <span className={`font-black text-lg ${item.color.text}`}>{item.value}%</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* CTA */}
        <motion.div {...fadeUp(0.5)} className="text-center mt-12">
          <button
            onClick={() => navigate("/upload")}
            className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold transition shadow-xl shadow-blue-200 dark:shadow-none"
          >
            Analyze Another Resume
          </button>
        </motion.div>

      </div>
    </div>
  )
}
