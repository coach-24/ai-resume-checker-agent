import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { CheckCircle, Loader, AlertCircle, RefreshCw } from "lucide-react"
import AIParticles from "../components/AIParticles"
import { motion } from "framer-motion"

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api"

const STEPS = [
  "Upload received",
  "Parsing Resume",
  "Extracting Skills",
  "Matching Job Description",
  "Generating Suggestions",
]

function Processing() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasFetched = useRef(false)  // prevent double-call in React StrictMode

  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState("")
  const [isRetrying, setIsRetrying] = useState(false)

  const { file, jobDesc } = location.state || {}

  // Redirect back if no file in state (e.g. direct URL navigation)
  useEffect(() => {
    if (!file) {
      navigate("/upload", { replace: true })
    }
  }, [file, navigate])

  const runAnalysis = async () => {
    if (!file) return

    setError("")
    setCurrentStep(0)
    hasFetched.current = true

    // Animate steps forward while API is running
    let step = 0
    const stepInterval = setInterval(() => {
      if (step < STEPS.length - 1) {
        step += 1
        setCurrentStep(step)
      }
    }, 1500)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("job_description", jobDesc || "")

      const response = await fetch(`${API_BASE}/upload-resume`, {
        method: "POST",
        body: formData,
      })

      clearInterval(stepInterval)

      if (!response.ok) {
        let detail = "Analysis failed. Please try again."
        try {
          const err = await response.json()
          detail = err.detail || detail
        } catch (_) {}
        throw new Error(detail)
      }

      const result = await response.json()

      // Validate we got a real result
      if (!result || typeof result.resume_score !== "number") {
        throw new Error("Received invalid response from server.")
      }

      setCurrentStep(STEPS.length)

      setTimeout(() => {
        navigate("/dashboard", { state: { analysisResult: result } })
      }, 800)

    } catch (err) {
      clearInterval(stepInterval)
      // Network error check
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Cannot connect to the server. Make sure the backend is running on port 8000.")
      } else {
        setError(err.message || "Something went wrong. Please try again.")
      }
      hasFetched.current = false
    }
  }

  useEffect(() => {
    if (file && !hasFetched.current) {
      runAnalysis()
    }
  }, [file])

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
      runAnalysis()
    }, 300)
  }

  const progressPercent = Math.round((currentStep / STEPS.length) * 100)

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:bg-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <AIParticles />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/85 backdrop-blur-md shadow-[0_25px_70px_rgba(0,0,0,0.18)] rounded-xl p-10 w-[520px] overflow-hidden"
      >
        {/* Ambient pulse */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/30 to-transparent opacity-40 animate-pulse pointer-events-none rounded-xl" />

        {error ? (
          /* ── Error State ── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative text-center space-y-6"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Analysis Failed</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.98] transition font-semibold"
              >
                <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
                Retry Analysis
              </button>
              <button
                onClick={() => navigate("/upload")}
                className="w-full px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
              >
                Upload Different Resume
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── Progress State ── */
          <div className="relative">
            <h1 className="text-2xl font-semibold mb-2 text-center">
              AI is analyzing your resume
            </h1>
            <p className="text-gray-500 text-sm text-center mb-8">
              Running intelligent analysis on your resume and job description
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
              <motion.div
                className="bg-blue-500 h-2.5 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mb-8">{progressPercent}%</p>

            {/* Steps */}
            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: index <= currentStep ? 1 : 0.4 }}
                  className="flex items-center gap-3"
                >
                  {index < currentStep ? (
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                  ) : index === currentStep ? (
                    <Loader className="animate-spin text-blue-500 shrink-0" size={20} />
                  ) : (
                    <div className="w-5 h-5 border-2 rounded-full border-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm ${index === currentStep ? "text-blue-600 font-semibold" : index < currentStep ? "text-gray-700" : "text-gray-400"}`}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Processing
