import { Component } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

/**
 * Global Error Boundary
 * Wraps the entire app to catch unexpected React render errors.
 *
 * Usage in App.js:
 *   import ErrorBoundary from "./components/ErrorBoundary"
 *   <ErrorBoundary><App /></ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6">
          <div className="bg-white shadow-xl rounded-2xl p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-500 text-sm mb-2">
              An unexpected error occurred in the application.
            </p>
            {this.state.error && (
              <p className="text-xs text-red-400 bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-6 font-mono">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <RefreshCw size={16} />
              Return to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
