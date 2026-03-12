import AIParticles from "../components/AIParticles";
import TiltGlowCard from "../components/TiltGlowCard"
import { Link } from "react-router-dom"
import { FileText, Brain, BarChart,UploadCloud, Search, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Github } from "lucide-react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
function Home() {
  const { dark, toggleDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const sectionAnimation = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}
  useEffect(() => {

  const sections = document.querySelectorAll("section")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    },
    { threshold: 0.3 }
  )

  sections.forEach((section) => observer.observe(section))

  const handleScroll = () => {
    if (window.scrollY < 200) {
      setActiveSection("")
    }
  }

  window.addEventListener("scroll", handleScroll)

  return () => {
    observer.disconnect()
    window.removeEventListener("scroll", handleScroll)
  }

}, [])

const scrollToSection = (id) => {
  const section = document.getElementById(id)

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  setMenuOpen(false)
}

const [score, setScore] = useState(0)
const [skillMatch, setSkillMatch] = useState(0)
const [atsScore, setAtsScore] = useState(0)

useEffect(() => {

  let s = 0
  let skill = 0
  let ats = 0

  const interval = setInterval(() => {

    if (s < 82) s += 1
    if (skill < 76) skill += 1
    if (ats < 88) ats += 1

    setScore(s)
    setSkillMatch(skill)
    setAtsScore(ats)

    if (s >= 82 && skill >= 76 && ats >= 88) {
      clearInterval(interval)
    }

  }, 20)

  return () => clearInterval(interval)

}, [])


  return (

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.4 }}
  className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:bg-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
>

{/* Animated Hamburger */}

<div className="absolute top-6 left-6 z-30">

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="relative w-8 h-8 flex items-center justify-center"
  >

    {/* Top Line */}
    <motion.span
      animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="absolute w-7 h-[2px] bg-gray-800 rounded"
    />

    {/* Middle Line */}
    <motion.span
      animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="absolute w-7 h-[2px] bg-gray-800 rounded"
    />

    {/* Bottom Line */}
    <motion.span
      animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="absolute w-7 h-[2px] bg-gray-800 rounded"
    />

  </button>

</div>
{/* Top Right — GitHub + Dark Mode */}
<div className="absolute top-6 right-6 z-30 flex items-center gap-3">

  {/* Dark Mode Toggle */}
  <button
    onClick={toggleDark}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
    title="Toggle dark mode"
  >
    {dark
      ? <Sun size={18} className="text-amber-400" />
      : <Moon size={18} className="text-slate-600" />
    }
  </button>

  {/* GitHub Button */}
  
    <a href="https://github.com/coach-24"
    target="_blank"
    rel="noopener noreferrer"
    className="group"
  >
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
      <Github size={20} className="text-gray-700 dark:text-slate-300 group-hover:text-blue-600" />
    </div>
  </a>

</div>

{/* Floating Navbar */}

<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
  transition={{ duration: 0.25 }}
  className={`absolute top-20 left-6 w-64 bg-white/90 backdrop-blur-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-xl p-6 space-y-4 z-20
  ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
>

  <a
    href="#features"
    onClick={() => scrollToSection("features")}
    className={`block px-3 py-2 rounded-lg transition ${
  activeSection === "features"
    ? "bg-blue-100 text-blue-600"
    : "text-gray-700 hover:bg-blue-50"
}`}
  >
    Features
  </a>

  <a
    href="#how-it-works"
    
    className={`block px-3 py-2 rounded-lg transition ${
  activeSection === "how-it-works"
    ? "bg-blue-100 text-blue-600"
    : "text-gray-700 hover:bg-blue-50"
}`}
  >
    How It Works
  </a>

  <a
    href="#example-analysis"

    className={`block px-3 py-2 rounded-lg transition ${
  activeSection === "example-analysis"
    ? "bg-blue-100 text-blue-600"
    : "text-gray-700 hover:bg-blue-50"
}`}
  >
    Example Analysis
  </a>

  <a
    href="#about"

    className={`block px-3 py-2 rounded-lg transition ${
  activeSection === "about"
    ? "bg-blue-100 text-blue-600"
    : "text-gray-700 hover:bg-blue-50"
}`}
  >
    About
  </a>

  <a
    href="#feedback"

    className={`block px-3 py-2 rounded-lg transition ${
  activeSection === "feedback"
    ? "bg-blue-100 text-blue-600"
    : "text-gray-700 hover:bg-blue-50"
}`}
  >
    Feedback
  </a>

</motion.div>

       {/* AI Particle Background */}
      <div className="absolute inset-0 z-0">
        <AIParticles />
      </div>
      {/* Smooth Floating Background Lights */}

      <div className="absolute w-[600px] h-[600px] bg-blue-200 rounded-full blur-[120px] opacity-30 animate-floatSlow top-[-100px] left-[-150px]"></div>

      <div className="absolute w-[500px] h-[500px] bg-purple-200 rounded-full blur-[120px] opacity-30 animate-floatMedium bottom-[-120px] right-[-120px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-floatFast top-[40%] left-[50%]"></div>


      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 px-8 items-center min-h-screen">

        {/* LEFT SECTION */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <h1 className="text-5xl font-semibold tracking-tight max-w-xl leading-tight mb-6 shine-text">
            AI Resume Checker
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Analyze and optimize your resume using AI to improve
            your chances of landing your dream job.
          </p>

          <div className="space-y-5">

            <div className="flex items-center space-x-3 dark:text-white">
              <Brain className="text-blue-600" />
              <span>AI Resume Analysis</span>
            </div>

            <div className="flex items-center space-x-3 dark:text-white">
              <FileText className="text-blue-600" />
              <span>ATS Optimization</span>
            </div>

            <div className="flex items-center space-x-3 dark:text-white">
              <BarChart className="text-blue-600" />
              <span>Skill Gap Detection</span>
            </div>

          </div>

        </motion.div>


        {/* RIGHT SIDE CARD */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
          className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-xl p-10 text-center animate-[float_6s_ease-in-out_infinite]"
        >

          <h2 className="text-2xl font-semibold mb-4 shine-text-1">
            AI Resume Scanner
          </h2>

          <p className="text-gray-500 mb-6">
            AI analyzes your resume and provides insights instantly.
          </p>


          {/* Resume Preview */}

          <div className="relative bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-6 text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/30 to-transparent opacity-40 animate-pulse"></div>

            <div className="space-y-3 text-sm text-gray-600">

              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>

              <div className="mt-4 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>

            </div>

            {/* AI Scan Line */}

            <div className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] opacity-70 animate-scan"></div>

          </div>


          <Link to="/upload">

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-blue-400/40 transition"
            >
              Analyze your Resume
            </motion.button>

          </Link>

        </motion.div>

      </div>
<motion.section
id="features"
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
variants={sectionAnimation}
className="py-28 bg-white dark:bg-slate-900"
>

<div className="max-w-6xl mx-auto px-8">

{/* Section Heading */}

<div className="text-center mb-16">

<h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 dark:text-white">
Powerful AI Features
</h2>

<p className="text-gray-600 max-w-2xl mx-auto">
Our AI analyzes your resume like a recruiter and provides actionable insights to improve your chances of landing interviews.
</p>

</div>


{/* Feature Cards Grid */}

<motion.div
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
variants={{
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25
    }
  }
}}
className="grid md:grid-cols-3 gap-12"
>


{/* Card 1 */}
<div className="flip-card perspective">

<div className="flip-inner">

{/* FRONT */}

<div className="flip-face bg-white border border-gray-100 shadow-md flex flex-col items-center justify-center">

<Brain className="text-blue-600 mb-4" size={36} />

<h3 className="text-lg font-semibold">
AI Resume Analysis
</h3>

</div>

{/* BACK */}

<div className="flip-face flip-back bg-blue-600 text-white flex items-center justify-center p-6 text-center">

<p className="text-sm leading-relaxed">
Our AI deeply analyzes resume structure, experience,
skills and keywords to determine how well your
profile matches modern hiring expectations.
</p>

</div>

</div>

</div>



{/* Card 2 */}

<div className="flip-card perspective">

<div className="flip-inner">

{/* FRONT */}

<div className="flip-face bg-white border border-gray-100 shadow-md flex flex-col items-center justify-center">

<FileText className="text-blue-600 mb-4" size={36} />

<h3 className="text-lg font-semibold">
ATS Optimization
</h3>

</div>

{/* BACK */}

<div className="flip-face flip-back bg-blue-600 text-white flex items-center justify-center p-6 text-center">

<p className="text-sm leading-relaxed">
Our system evaluates how well your resume performs
against Applicant Tracking Systems used by recruiters
and suggests improvements to increase visibility.
</p>

</div>

</div>

</div>



{/* Card 3 */}

<div className="flip-card perspective">

<div className="flip-inner">

{/* FRONT */}

<div className="flip-face bg-white border border-gray-100 shadow-md flex flex-col items-center justify-center">

<BarChart className="text-blue-600 mb-4" size={36} />

<h3 className="text-lg font-semibold">
Skill Gap Detection
</h3>

</div>

{/* BACK */}

<div className="flip-face flip-back bg-blue-600 text-white flex items-center justify-center p-6 text-center">

<p className="text-sm leading-relaxed">
The AI compares your resume with the job description
and highlights missing skills recruiters expect,
helping you improve your profile strategically.
</p>

</div>

</div>

</div>


</motion.div>

</div>

</motion.section>

<motion.section
id="how-it-works"
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
variants={sectionAnimation}
className="py-28 bg-gray-50 dark:bg-slate-800"  
>

<div className="max-w-6xl mx-auto px-8">

{/* Title */}

<div className="text-center mb-20">

<h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 dark:text-white">
How Our AI Works
</h2>

<p className="text-gray-600 max-w-2xl mx-auto">
Our system uses multiple AI steps to analyze your resume,
compare it with job requirements, and generate intelligent
improvement suggestions.
</p>

</div>


{/* Pipeline Grid */}

<motion.div
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
variants={{
hidden: {},
visible: { transition: { staggerChildren: 0.2 } }
}}
className="grid md:grid-cols-3 gap-12"
>


<TiltGlowCard
icon={<UploadCloud size={26}/>}
title="Upload Resume"
description="Users upload their resume in PDF or DOCX format for analysis."
/>

<TiltGlowCard
icon={<FileText size={26}/>}
title="Resume Parsing"
description="The system extracts structured information such as skills, experience, and education."
/>

<TiltGlowCard
icon={<Brain size={26}/>}
title="Skill Extraction"
description="AI identifies technical and soft skills using natural language processing."
/>

<TiltGlowCard
icon={<Search size={26}/>}
title="Job Description Analysis"
description="The system analyzes job descriptions to understand required skills."
/>

<TiltGlowCard
icon={<BarChart size={26}/>}
title="Matching Engine"
description="Your resume is compared with job requirements to detect missing skills."
/>

<TiltGlowCard
icon={<Sparkles size={26}/>}
title="AI Suggestions"
description="The system generates actionable suggestions to improve your resume."
/>



</motion.div>

</div>

</motion.section>

<motion.section
id="example-analysis"
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
variants={sectionAnimation}
className="py-28 bg-white dark:bg-slate-900"
>

<div className="max-w-6xl mx-auto px-8">

{/* Title */}

<div className="text-center mb-16">

<h2 className="text-3xl md:text-4xl font-semibold mb-4 dark:text-white">
  Example Resume Analysis
</h2>
<p className="text-gray-600 dark:text-slate-400">
  See how our AI evaluates your resume and provides insights.
</p>

</div>


{/* Main Panel */}

<div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg shadow-[0_30px_80px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 dark:border-slate-700 p-12 grid md:grid-cols-2 gap-12 items-center">

{/* LEFT SIDE SCORE */}

<div className="flex flex-col items-center">

<div className="relative w-40 h-40 flex items-center justify-center">

<svg className="absolute w-full h-full">

<circle
cx="80"
cy="80"
r="65"
stroke="#e5e7eb"
strokeWidth="12"
fill="none"
/>

<circle
cx="80"
cy="80"
r="65"
stroke="#3b82f6"
strokeWidth="12"
fill="none"
strokeDasharray="408"
strokeDashoffset="74"
strokeLinecap="round"
animate-pulse
/>

</svg>

<span className="text-4xl font-bold text-blue-600">
{score}%
</span>

</div>

<p className="mt-4 text-gray-600 text-lg">
Overall Resume Score
</p>

</div>


{/* RIGHT SIDE INSIGHTS */}

<div className="space-y-6">

<div className="flex justify-between items-center">
<span className="text-gray-600">Skill Match</span>
<span className="font-semibold text-blue-600">
{skillMatch}%
</span>
</div>

<div className="w-full bg-gray-200 rounded-full h-2">
<div
className="bg-blue-500 h-2 rounded-full transition-all duration-700"
style={{ width: `${skillMatch}%` }}
></div>
</div>


<div className="flex justify-between items-center">
<span className="text-gray-600">ATS Compatibility</span>
<span className="font-semibold text-blue-600">
{atsScore}%
</span>
</div>

<div className="w-full bg-gray-200 rounded-full h-2">
<div
className="bg-blue-500 h-2 rounded-full transition-all duration-700"
style={{ width: `${atsScore}%` }}
></div>
</div>


<div className="flex justify-between items-center">

<span className="text-gray-600">Improvement Tips</span>

<span className="font-semibold text-blue-600">
4 Suggestions
</span>

</div>

</div>

</div>


{/* Missing Skills */}

<div className="mt-10 text-center">

<p className="text-gray-600 mb-4">
Missing Skills Detected
</p>

<div className="flex justify-center flex-wrap gap-3">

<motion.span
initial={{ opacity: 0, y: 10 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: 0.2 }}
className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm"
>
Docker
</motion.span>

<motion.span
initial={{ opacity: 0, y: 10 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: 0.2 }}
className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm"
>
Kubernetes
</motion.span>

<motion.span
initial={{ opacity: 0, y: 10 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: 0.2 }}
className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm"
>
CI/CD
</motion.span>
</div>

</div>

</div>

</motion.section>

<motion.section
id="about"
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
variants={sectionAnimation}
className="py-24 bg-gray-50 dark:bg-slate-800"
>

  <div className="max-w-4xl mx-auto px-8 text-center">

    <h2 className="text-3xl font-semibold mb-6 dark:text-white">
      About
    </h2>

    <p className="text-gray-600 dark:text-slate-400">
      AI Resume Checker helps job seekers optimize their resumes
      using AI-driven analysis and recommendations.
    </p>

  </div>

</motion.section>

<motion.section
id="feedback"
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
variants={sectionAnimation}
className="py-24 bg-gray-50 dark:bg-slate-800"
>

  <div className="max-w-4xl mx-auto px-8 text-center">

    <h2 className="text-3xl font-semibold mb-6 dark:text-white">
      Feedback
    </h2>

    <p className="text-gray-600 dark:text-slate-400 mb-6">
      Have suggestions or found an issue?
    </p>

    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
      Send Feedback
    </button>

  </div>

</motion.section>
    </motion.div>
  )
}

export default Home
