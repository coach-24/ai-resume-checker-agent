import AIParticles from "../components/AIParticles";
import { Link } from "react-router-dom"
import { FileText, Brain, BarChart, Github, Linkedin, Mail, Star, Send } from "lucide-react"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import emailjs from "@emailjs/browser"
import { CheckCircle2 } from "lucide-react"

// ── EmailJS config — replace with your keys from emailjs.com ──
const EMAILJS_SERVICE_ID  = "service_iuh8ysy"
const EMAILJS_TEMPLATE_ID = "template_nh83m5f"
const EMAILJS_PUBLIC_KEY  = "GQSVTRo_ziGqlO74q"

function FeedbackSection({ sectionAnimation }) {

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  },[])
  const [form, setForm]     = useState({ name: "", email: "", message: "" })
  const [rating, setRating] = useState(0)
  const [hover, setHover]   = useState(0)
  const [status, setStatus] = useState("idle")
  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message || rating === 0) return
    setStatus("sending")
    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          message:    form.message,
          rating:     `${"⭐".repeat(rating)} (${rating}/5)`,
        },
        EMAILJS_PUBLIC_KEY
      )
      console.log("SUCCESS:", result.status, result.text)
      setStatus("success")
      setForm({ name: "", email: "", message: "" })
      setRating(0)
    } catch (err) {
      console.error("EMAILJS ERROR:", err.status, err.text)
      setStatus("error")
    }
  }

  const isValid = form.name && form.email && form.message && rating > 0

  return (
    <motion.section
      id="feedback"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionAnimation}
      className="py-28 bg-gray-50 dark:bg-slate-800"
    >
      <div className="max-w-4xl mx-auto px-8">

        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-36 translate-x-36" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-28 -translate-x-28" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

          <div className="relative z-10 p-10 md:p-14">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/20 text-white text-xs font-semibold rounded-full uppercase tracking-widest mb-4">
                We'd love to hear from you
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Send us Feedback</h2>
              <p className="text-blue-100 text-sm max-w-md mx-auto">
                Found a bug? Have a suggestion? Want to share your experience? Your message goes directly to our inbox.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-emerald-400/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={36} className="text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Thank you! 🎉</h3>
                  <p className="text-blue-100 text-sm mb-6">Your feedback has been sent successfully. We'll review it shortly.</p>
                  <button onClick={() => setStatus("idle")} className="px-6 py-2.5 bg-white/20 hover:bg-white/30 border border-white/25 text-white rounded-xl text-sm font-semibold transition">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Your Name</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Vishnu Vardhan"
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition" />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Your Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Rate Your Experience</label>
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="transition-all hover:scale-110 active:scale-95">
                          <Star size={32} className={`transition-all duration-150 ${star <= (hover || rating) ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "text-white/30"}`} />
                        </button>
                      ))}
                      {rating > 0 && <span className="ml-2 text-white/70 text-sm">{["","Poor","Fair","Good","Great","Excellent!"][rating]}</span>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Your Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what you think, report a bug, or suggest a feature..." rows={4}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition resize-none" />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <p className="text-white/40 text-xs">Sent directly to your inbox</p>
                    <button onClick={handleSubmit} disabled={!isValid || status === "sending"}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${isValid && status !== "sending" ? "bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:scale-105 active:scale-95" : "bg-white/20 text-white/50 cursor-not-allowed"}`}>
                      {status === "sending" ? (<><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />Sending...</>) : (<><Send size={15} /> Send Feedback</>)}
                    </button>
                  </div>

                  {status === "error" && <p className="text-red-300 text-xs mt-3 text-center">⚠️ Something went wrong. Check your EmailJS keys or try again.</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-gray-400 dark:text-slate-500 text-xs mt-8">
          © 2025 AI Resume Checker · Built with ❤️ by Vishnu Vardhan G & V Meghana
        </p>
      </div>
    </motion.section>
  )
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { dark, toggleDark } = useTheme()

  const sectionAnimation = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  useEffect(() => {
    const sections = document.querySelectorAll("section")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )
    sections.forEach((section) => observer.observe(section))
    const handleScroll = () => { if (window.scrollY < 200) setActiveSection("") }
    window.addEventListener("scroll", handleScroll)
    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll) }
  }, [])

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" })
    setMenuOpen(false)
  }

  const [score, setScore] = useState(0)
  const [skillMatch, setSkillMatch] = useState(0)
  const [atsScore, setAtsScore] = useState(0)

  useEffect(() => {
    let s = 0, skill = 0, ats = 0
    const interval = setInterval(() => {
      if (s < 82) s += 1
      if (skill < 76) skill += 1
      if (ats < 88) ats += 1
      setScore(s); setSkillMatch(skill); setAtsScore(ats)
      if (s >= 82 && skill >= 76 && ats >= 88) clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [])

  const navLink = (id, label) => (
    <a
      href={`#${id}`}
      onClick={() => scrollToSection(id)}
      className={`block px-3 py-2 rounded-lg transition ${
        activeSection === id
          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700"
      }`}
    >
      {label}
    </a>
  )

  const pipelineSteps = [
    { step: "01", title: "Resume Upload",         desc: "Upload PDF or DOCX up to 5MB. Format is validated before processing begins.",                                                            icon: "📄", side: "left",  color: "from-blue-500 to-blue-600" },
    { step: "02", title: "Resume Parser Agent",   desc: "Extracts raw text using pdfplumber or python-docx. Detects and categorizes sections — skills, experience, education, projects.",        icon: "🔍", side: "right", color: "from-indigo-500 to-indigo-600" },
    { step: "03", title: "Skill Extraction Agent",desc: "NLP pattern matching identifies 50+ technical skills — languages, frameworks, tools, databases — directly from your resume.",             icon: "🧠", side: "left",  color: "from-violet-500 to-violet-600" },
    { step: "04", title: "ATS Analysis Agent",    desc: "Simulates how ATS systems score resumes. Checks keyword density, section presence, formatting issues and resume structure.",             icon: "⚙️", side: "right", color: "from-blue-600 to-cyan-500" },
    { step: "05", title: "Keyword Match Agent",   desc: "Extracts critical keywords from the job description and compares them against your resume to find gaps and matched terms.",              icon: "🎯", side: "left",  color: "from-cyan-500 to-teal-500" },
    { step: "06", title: "Score Calculator",      desc: "Computes weighted score: Skill Match (35%) + ATS (35%) + Keywords (20%) + Section Health (10%) = Your Final Resume Score.",            icon: "📊", side: "right", color: "from-teal-500 to-green-500" },
    { step: "07", title: "AI Suggestion Agent",   desc: "Powered by Groq LLaMA 3 — reads your actual resume and job role to generate 6 specific, actionable suggestions tailored only to you.", icon: "✨", side: "left",  color: "from-green-500 to-emerald-500" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:bg-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >

      {/* Hamburger */}
      <div className="absolute top-6 left-6 z-30">
        <button onClick={() => setMenuOpen(!menuOpen)} className="relative w-8 h-8 flex items-center justify-center">
          <motion.span animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute w-7 h-[2px] bg-gray-800 dark:bg-white rounded" />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.25 }} className="absolute w-7 h-[2px] bg-gray-800 dark:bg-white rounded" />
          <motion.span animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute w-7 h-[2px] bg-gray-800 dark:bg-white rounded" />
        </button>
      </div>

      {/* Top Right — Dark Mode + GitHub */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        <button
          onClick={toggleDark}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md transition-all duration-300 hover:scale-110"
          title="Toggle dark mode"
        >
          {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
        </button>
        <a href="https://github.com/coach-24/ai-resume-checker-agent" target="_blank" rel="noopener noreferrer" className="group">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md transition-all duration-300 group-hover:scale-110">
            <Github size={20} className="text-gray-700 dark:text-slate-300 group-hover:text-blue-600" />
          </div>
        </a>
      </div>

      {/* Floating Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className={`absolute top-20 left-6 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-xl p-6 space-y-4 z-20 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {navLink("features", "Features")}
        {navLink("how-it-works", "How It Works")}
        {navLink("example-analysis", "Example Analysis")}
        {navLink("about", "About")}
        {navLink("feedback", "Feedback")}
      </motion.div>

      {/* Particles + lights */}
      <div className="absolute inset-0 z-0"><AIParticles /></div>
      <div className="absolute w-[600px] h-[600px] bg-blue-200 rounded-full blur-[120px] opacity-30 animate-floatSlow top-[-100px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-200 rounded-full blur-[120px] opacity-30 animate-floatMedium bottom-[-120px] right-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-floatFast top-[40%] left-[50%]" />

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 px-8 items-center min-h-screen">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-semibold tracking-tight max-w-xl leading-tight mb-6 shine-text dark:text-white">AI Resume Checker</h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-8">Analyze and optimize your resume using AI to improve your chances of landing your dream job.</p>
          <div className="space-y-5 dark:text-slate-300">
            <div className="flex items-center space-x-3"><Brain className="text-blue-600" /><span>AI Resume Analysis</span></div>
            <div className="flex items-center space-x-3"><FileText className="text-blue-600" /><span>ATS Optimization</span></div>
            <div className="flex items-center space-x-3"><BarChart className="text-blue-600" /><span>Skill Gap Detection</span></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
          className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-xl p-10 text-center animate-[float_6s_ease-in-out_infinite]"
        >
          <h2 className="text-2xl font-semibold mb-4 shine-text-1 dark:text-white">AI Resume Scanner</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">AI analyzes your resume and provides insights instantly.</p>
          <div className="relative bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-6 text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/30 to-transparent opacity-40 animate-pulse" />
            <div className="space-y-3 text-sm text-gray-600">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-500 rounded w-3/4" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-500 rounded w-1/2" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-500 rounded w-2/3" />
              <div className="mt-4 h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-500 rounded w-full" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-500 rounded w-5/6" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-500 rounded w-2/3" />
            </div>
            <div className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] opacity-70 animate-scan" />
          </div>
          <Link to="/upload">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-blue-400/40 transition">
              Analyze your Resume
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* ── FEATURES ── */}
      <motion.section id="features" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionAnimation} className="py-28 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 dark:text-white">Powerful AI Features</h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">Our AI analyzes your resume like a recruiter and provides actionable insights to improve your chances of landing interviews.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.25 } } }} className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Brain className="text-blue-600 mb-4" size={36}/>, title: "AI Resume Analysis", back: "Our AI deeply analyzes resume structure, experience, skills and keywords to determine how well your profile matches modern hiring expectations." },
              { icon: <FileText className="text-blue-600 mb-4" size={36}/>, title: "ATS Optimization", back: "Our system evaluates how well your resume performs against Applicant Tracking Systems used by recruiters and suggests improvements to increase visibility." },
              { icon: <BarChart className="text-blue-600 mb-4" size={36}/>, title: "Skill Gap Detection", back: "The AI compares your resume with the job description and highlights missing skills recruiters expect, helping you improve your profile strategically." },
            ].map((card, i) => (
              <div key={i} className="flip-card perspective">
                <div className="flip-inner">
                  <div className="flip-face bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-md flex flex-col items-center justify-center">
                    {card.icon}
                    <h3 className="text-lg font-semibold dark:text-white">{card.title}</h3>
                  </div>
                  <div className="flip-face flip-back bg-blue-600 text-white flex items-center justify-center p-6 text-center">
                    <p className="text-sm leading-relaxed">{card.back}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── EXAMPLE ANALYSIS ── */}
      <motion.section id="example-analysis" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionAnimation} className="py-28 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 dark:text-white">Example Resume Analysis</h2>
            <p className="text-gray-600 dark:text-slate-400">See how our AI evaluates your resume and provides insights.</p>
          </div>
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg shadow-[0_30px_80px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 dark:border-slate-700 p-12 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute w-full h-full">
                  <circle cx="80" cy="80" r="65" stroke="#e5e7eb" strokeWidth="12" fill="none"/>
                  <circle cx="80" cy="80" r="65" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="408" strokeDashoffset="74" strokeLinecap="round"/>
                </svg>
                <span className="text-4xl font-bold text-blue-600">{score}%</span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-slate-400 text-lg">Overall Resume Score</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-300">Skill Match</span><span className="font-semibold text-blue-600">{skillMatch}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: `${skillMatch}%` }}/></div>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-300">ATS Compatibility</span><span className="font-semibold text-blue-600">{atsScore}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: `${atsScore}%` }}/></div>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-300">Improvement Tips</span><span className="font-semibold text-blue-600">4 Suggestions</span></div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-600 dark:text-slate-400 mb-4">Missing Skills Detected</p>
            <div className="flex justify-center flex-wrap gap-3">
              {["Docker", "Kubernetes", "CI/CD"].map((s, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm">{s}</motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          ── ABOUT SECTION (NEW) ──
      ══════════════════════════════════════════ */}
      <motion.section id="about" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionAnimation} className="py-28 bg-gray-50 dark:bg-slate-800 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">

          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full uppercase tracking-widest mb-4">
              About This Project
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Built Different.</h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto text-lg">A real AI-powered resume analysis system — not just a scoring tool.</p>
          </div>

          {/* ── AI Pipeline Timeline ── */}
          <div className="mb-28">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-14">How the AI Pipeline Works</h3>

            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-400 to-emerald-400 hidden md:block opacity-40" />

              <div className="space-y-10">
                {pipelineSteps.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: item.side === "left" ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className={`flex items-center gap-6 ${item.side === "right" ? "md:flex-row-reverse" : "md:flex-row"} flex-col`}
                  >
                    {/* Card */}
                    <div className="flex-1">
                      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shrink-0 shadow-lg`}>
                            {item.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Agent {item.step}</span>
                            <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-1 mt-0.5">{item.title}</h4>
                            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center bubble */}
                    <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-gray-50 dark:border-slate-800 shadow-lg items-center justify-center shrink-0 z-10">
                      <span className="text-white text-xs font-black">{item.step}</span>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Project Info ── */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full uppercase tracking-widest mb-4">The Project</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why We Built This</h3>
              <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Most resume checkers give you a generic score with no real explanation. We wanted to build something that actually reads your resume intelligently — understanding context, not just counting keywords. AI Resume Checker uses a real multi-agent pipeline where each agent specializes in one task, delivering the most accurate analysis possible.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-8">
              {[
                { number: "6",    label: "AI Agents",      color: "text-blue-600 dark:text-blue-400" },
                { number: "50+",  label: "Skills Tracked", color: "text-indigo-600 dark:text-indigo-400" },
                { number: "100%", label: "Free to Use",    color: "text-emerald-600 dark:text-emerald-400" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 text-center shadow-sm">
                  <p className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.number}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["React", "FastAPI", "Python", "TailwindCSS", "Groq AI", "LLaMA 3", "Framer Motion", "Recharts"].map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-600 rounded-full text-xs font-semibold">{tech}</span>
              ))}
            </div>
          </div>

          {/* ── Meet the Team heading ── */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-widest mb-4">The Team</span>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Meet the Developers</h3>
          </div>

          {/* ── Two cards side by side ── */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* ── Vishnu — Blue card ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 dark:shadow-blue-900/40 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full -translate-y-28 translate-x-28" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20" />
              <div className="relative z-10 flex flex-col h-full">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-5 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Developer 01</span>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl shadow-lg shrink-0">👨‍💻</div>
                  <div>
                    <h5 className="text-xl font-black">Vishnu Vardhan G</h5>
                    <p className="text-blue-100 text-xs">Computer Science Engineering · VIT-AP University</p>
                    <p className="text-blue-200 text-xs font-semibold mt-0.5">Full Stack Developer · AI/ML Enthusiast</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-blue-100 text-sm leading-relaxed mb-5">
                  Passionate about building AI-powered applications that solve real problems. Specializing in full-stack development with a strong focus on intelligent systems, beautiful user experiences, and end-to-end product thinking.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Python", "React", "FastAPI", "Machine Learning", "Node.js", "SQL"].map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white/15 border border-white/20 rounded-full text-xs font-semibold">{skill}</span>
                  ))}
                </div>

                {/* Links — pushed to bottom */}
                <div className="flex flex-wrap gap-3 mt-auto">
                  <a href="https://github.com/coach-24" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                    <Github size={14}/> GitHub
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                    <Linkedin size={14}/> LinkedIn
                  </a>
                  <a href="mailto:vishnuvardhangunupuru999@gmail.com"
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                    <Mail size={14}/> Email
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── Meghana — Indigo/Purple card ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-52 h-52 bg-white/10 rounded-full -translate-y-28 -translate-x-28" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 translate-x-20" />
              <div className="relative z-10 flex flex-col h-full">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-5 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Developer 02</span>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl shadow-lg shrink-0">👩‍💻</div>
                  <div>
                    <h5 className="text-xl font-black">V Meghana</h5>
                    <p className="text-indigo-100 text-xs">Computer Science Engineering · VIT-AP University</p>
                    <p className="text-indigo-200 text-xs font-semibold mt-0.5">Backend Developer · Data Science Enthusiast</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-indigo-100 text-sm leading-relaxed mb-5">
                  Driven by a passion for building robust, scalable backend systems and data-driven solutions. Focused on designing clean APIs, intelligent data pipelines, and leveraging machine learning frameworks to turn raw data into real-world impact.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Python", "Java", "JavaScript", "SQL", "MongoDB", "TensorFlow", "PyTorch", "Node.js"].map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white/15 border border-white/20 rounded-full text-xs font-semibold">{skill}</span>
                  ))}
                </div>

                {/* Links — pushed to bottom */}
                <div className="flex flex-wrap gap-3 mt-auto">
                  <a href="https://github.com/Meghanaa21" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                    <Github size={14}/> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/meghana-vanjangi-886231293/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                    <Linkedin size={14}/> LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </motion.section>

      {/* ── FEEDBACK ── */}
      <FeedbackSection sectionAnimation={sectionAnimation} />

    </motion.div>
  )
}

export default Home
