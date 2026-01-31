import { useState } from 'react'
import { Sparkles, Copy, Check, Code2, Eye } from 'lucide-react'

const LLMS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic' },
  { id: 'gemini-2-pro', name: 'Gemini 2 Pro', provider: 'Google' },
  { id: 'glm-4-7', name: 'GLM-4.7', provider: 'Z-AI' },
  { id: 'kimi-k2.5', name: 'Kimi K2.5', provider: 'Moonshot' },
  { id: 'minimax-m2.1', name: 'MiniMax M2.1', provider: 'MiniMax' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek' },
  { id: 'llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta' },
]

function App() {
  const [prompt, setPrompt] = useState('')
  const [selectedLLMs, setSelectedLLMs] = useState(new Set(['gpt-4o', 'claude-sonnet-4']))
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState([])
  const [activeTab, setActiveTab] = useState({})
  const [copied, setCopied] = useState(null)

  const toggleLLM = (id) => {
    const newSet = new Set(selectedLLMs)
    newSet.has(id) ? newSet.delete(id) : newSet.add(id)
    setSelectedLLMs(newSet)
  }

  const generate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setResults([])
    
    setTimeout(() => {
      const mockResults = Array.from(selectedLLMs).map(llmId => {
        const llm = LLMS.find(l => l.id === llmId)
        return {
          id: llmId,
          name: llm.name,
          provider: llm.provider,
          code: generateCleanCode(prompt, llm.name),
        }
      })
      setResults(mockResults)
      setActiveTab(mockResults.reduce((acc, r) => ({ ...acc, [r.id]: 'code' }), {}))
    }, 2000)
  }

  const generateCleanCode = (prompt, llm) => {
    return `import { useState } from 'react'

export default function ${prompt.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '')}Component() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 class="text-lg font-medium text-gray-900 mb-2">${prompt}</h2>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Get Started
      </button>
    </div>
  )
}`
  }

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const reset = () => {
    setPrompt('')
    setResults([])
    setActiveTab({})
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            LLM Component Generator <Sparkles className="w-8 h-8 text-blue-600" />
          </h1>
          <p className="text-gray-600 text-lg">
            Generate beautiful React components with multiple AI models
          </p>
        </div>

        {/* Input Card */}
        <div className="card max-w-4xl mx-auto mb-8">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Component Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A clean React button component with hover effects"
                className="input"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Models to Compare
              </label>
              <div className="checkbox-grid">
                {LLMS.map((llm) => (
                  <div
                    key={llm.id}
                    className={`checkbox-item ${selectedLLMs.has(llm.id) ? 'bg-blue-50 border-blue-300' : ''}`}
                    onClick={() => toggleLLM(llm.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLLMs.has(llm.id)}
                      onChange={() => toggleLLM(llm.id)}
                      className="check"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{llm.name}</div>
                      <div className="text-xs text-gray-500">{llm.provider}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={generate}
                disabled={isGenerating}
                className="button button-primary flex-1 p-4"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="loading" /> 
                    Generating...
                  </span>
                ) : (
                  'Generate Components'
                )}
              </button>
              {results.length > 0 && (
                <button
                  onClick={reset}
                  className="button bg-gray-100 text-gray-700 hover:bg-gray-200 p-4"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-6">
            {results.map((result) => (
              <div key={result.id} class="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                    <p className="text-sm text-gray-500">{result.provider}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [result.id]: 'code' })}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        activeTab[result.id] === 'code'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Code2 className="w-4 h-4 inline mr-1" />
                      Code
                    </button>
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [result.id]: 'preview' })}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        activeTab[result.id] === 'preview'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      Preview
                    </button>
                    <button
                      onClick={() => copyCode(result.code, result.id)}
                      className="px-3 py-1 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                    >
                      {copied === result.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {activeTab[result.id] === 'code' ? (
                  <pre class="code-block">{result.code}</pre>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-md border-l-4 border-blue-500">
                    <div className="text-sm text-gray-700">
                      Preview not available - copy code to use in your project
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App