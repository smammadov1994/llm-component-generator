import { useState } from 'react'
import { Sparkles, Copy, Check, ChevronDown, Code2, Eye, Zap, Diamond } from 'lucide-react'

const LLMS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: '#10a37f' },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', color: '#d4a574' },
  { id: 'gemini-2-pro', name: 'Gemini 2 Pro', provider: 'Google', color: '#4285f4' },
  { id: 'glm-4-7', name: 'GLM-4.7', provider: 'Z-AI', color: '#7c3aed' },
  { id: 'kimi-k2.5', name: 'Kimi K2.5', provider: 'Moonshot', color: '#f97316' },
  { id: 'minimax-m2.1', name: 'MiniMax M2.1', provider: 'MiniMax', color: '#ef4444' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', color: '#1f2937' },
  { id: 'llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta', color: '#8b5cf6' },
]

function App() {
  const [prompt, setPrompt] = useState('')
  const [selectedLLMs, setSelectedLLMs] = useState(new Set(['gpt-4o', 'claude-sonnet-4']))
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState([])
  const [activeTab, setActiveTab] = useState({})

  const toggleLLM = (id) => {
    const newSet = new Set(selectedLLMs)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedLLMs(newSet)
  }

  const generate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setResults([])
    
    // Simulate generation with premium animations
    setTimeout(() => {
      const mockResults = Array.from(selectedLLMs).map(llmId => {
        const llm = LLMS.find(l => l.id === llmId)
        return {
          id: llmId,
          name: llm.name,
          provider: llm.provider,
          color: llm.color,
          code: generateLuxuryCode(prompt),
        }
      })
      setResults(mockResults)
      setActiveTab(mockResults.reduce((acc, r) => ({ ...acc, [r.id]: 'code' }), {}))
    }, 2000)
  }

  const generateLuxuryCode = (prompt) => {
    return `import { useState } from 'react'

export default function GeneratedComponent() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            ✨
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">${prompt.slice(0, 20)}...</h3>
          <p className="text-gray-300 mb-6">${prompt}</p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}`
  }

  const reset = () => {
    setPrompt('')
    setResults([])
    setActiveTab({})
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 blur-3xl" />
        <div className="relative z-10 px-6 py-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-purple-300 mb-4">
              <Diamond className="w-4 h-4" />
              <span>PREMIUM AI COMPONENT GENERATOR</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              ✨ LLM Generator
            </h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Transform your ideas into stunning React components with AI-powered precision and resort-level elegance
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 hover:bg-white/15 transition-all duration-300">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">
                <Zap className="w-4 h-4" />
                Component Vision
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="🎨 Describe your dream component...\n\nExample: A luxury pricing card with gold gradients, marble textures, and buttery-smooth interactions showcasing premium subscription tiers..."
                className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none transition-all"
                rows="5"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                AI Models
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {LLMS.map((llm) => (
                  <label
                    key={llm.id}
                    className={`p-3 rounded-xl cursor-pointer border transition-all ${
                      selectedLLMs.has(llm.id)
                        ? 'bg-white/20 border-white/40 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLLMs.has(llm.id)}
                        onChange={() => toggleLLM(llm.id)}
                        className="sr-only"
                      />
                      <span className="flex w-3 h-3 rounded-full" style={{ backgroundColor: llm.color }}></span>
                      <span className="text-sm font-medium">{llm.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={generate}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Crafting Magic...
                  </span>
                ) : 'Generate Components'}
              </button>
              {results.length > 0 && (
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 border border-white/20 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6 mb-12">
            {results.map((result) => (
              <div key={result.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: result.color }}
                      ></div>
                      <div>
                        <h3 className="font-bold text-white">{result.name}</h3>
                        <p className="text-sm text-gray-400">{result.provider}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab({ ...activeTab, [result.id]: 'code' })}
                        className={`px-3 py-1 text-sm rounded-lg ${
                          activeTab[result.id] === 'code'
                            ? 'bg-white/20 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Code2 className="w-4 h-4 inline mr-1" />
                        Code
                      </button>
                      <button
                        onClick={() => setActiveTab({ ...activeTab, [result.id]: 'preview' })}
                        className={`px-3 py-1 text-sm rounded-lg ${
                          activeTab[result.id] === 'preview'
                            ? 'bg-white/20 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {activeTab[result.id] === 'code' ? (
                    <div className="space-y-3">
                      <div className="bg-black/40 backdrop-blur rounded-xl p-4 border border-white/5">
                        <pre className="text-sm text-gray-200 overflow-x-auto font-mono">
                          <code>{result.code}</code>
                        </pre>
                      </div>
                      <button
                        onClick={() => copyCode(result.code)}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
                      >
                        <Copy className="w-4 h-4 inline mr-2" />
                        Copy Code
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/5">
                      <div className="text-sm text-gray-400 mb-4">Preview unavailable</div>
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="text-xs font-mono text-gray-300">// Install React runtime to view preview</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-400 mb-8">
          <p className="text-sm">
            Crafted with <Sparkles className="inline w-4 h-4 text-purple-400" /> using advanced AI models
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App