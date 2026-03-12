import { useNavigate } from "react-router-dom"
import { useDropzone } from "react-dropzone"
import { useState } from "react"
import { UploadCloud, FileText, Trash2, AlertCircle } from "lucide-react"
import AIParticles from "../components/AIParticles"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function Upload() {
  const { dark, toggleDark } = useTheme()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState("")
  const [error, setError] = useState("")

  const formatFileSize = (size) => {
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB"
    return (size / (1024 * 1024)).toFixed(1) + " MB"
  }

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setError("")
    if (rejectedFiles && rejectedFiles.length > 0) {
      setError("Invalid file type. Please upload a PDF or DOCX file.")
      return
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      const f = acceptedFiles[0]
      if (f.size > 5 * 1024 * 1024) {
        setError("File too large. Maximum size is 5MB.")
        return
      }
      setFile(f)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
    maxFiles: 1,
  })

  const handleAnalyze = () => {
    if (!file) return
    setError("")
    // Pass file and jobDesc via router state to Processing page
    navigate("/processing", { state: { file, jobDesc } })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:bg-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDark}
        className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md hover:scale-110 transition"
      >
        {dark ? <Sun size={18} className="text-amber-400"/> : <Moon size={18} className="text-slate-600"/>}
      </button>
      <div className="absolute inset-0 z-0">
        <AIParticles />
      </div>
      <div className="absolute w-[600px] h-[600px] bg-blue-200 rounded-full blur-[120px] opacity-30 animate-floatSlow top-[-100px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-200 rounded-full blur-[120px] opacity-30 animate-floatMedium bottom-[-120px] right-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-floatFast top-[40%] left-[50%]" />

      <div className="relative z-10 max-w-6xl w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.18)] rounded-xl p-10 grid md:grid-cols-2 gap-12 divide-x divide-gray-200 dark:divide-slate-700">

        {/* LEFT — Upload Resume */}
        <div>
          <h1 className="text-3xl font-bold mb-8 shine-text-2">Upload Your Resume</h1>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-12 text-center rounded-xl cursor-pointer transition-all duration-300
              ${isDragActive
                ? "border-blue-500 bg-blue-50 scale-[1.02]"
                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto mb-4 text-blue-500 animate-bounce" size={48} />
            {isDragActive ? (
              <p className="text-blue-500 font-medium">Drop your resume here...</p>
            ) : (
              <p className="text-gray-600 font-medium">
                Drag & drop your resume here, or click to browse
              </p>
            )}
            <p className="text-sm text-gray-400 mt-2">Supported: PDF, DOCX — Max 5MB</p>
          </div>

          {/* File preview */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="text-blue-500 shrink-0" />
                <span className="font-medium truncate">{file.name}</span>
                <span className="text-sm text-gray-400 shrink-0">{formatFileSize(file.size)}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="text-gray-400 hover:text-red-500 transition ml-3 shrink-0"
                title="Remove file"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        {/* RIGHT — Job Description */}
        <div className="flex flex-col justify-between pl-12">
          <div>
            <h2 className="text-xl font-semibold mb-2">Paste Job Description</h2>
            <p className="text-sm text-gray-400 mb-4">Optional — improves keyword matching accuracy</p>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              rows="10"
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleAnalyze}
              disabled={!file}
              className={`w-full px-8 py-3 rounded-lg font-semibold transition-all
                ${file
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-400/40 active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {file ? "Analyze Resume" : "Upload a resume to continue"}
            </button>
            {!file && (
              <p className="text-center text-xs text-gray-400">Upload your resume to enable analysis</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
