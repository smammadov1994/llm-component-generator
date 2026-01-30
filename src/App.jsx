import { useState } from 'react'
import { Sparkles, Copy, Check, ChevronDown, Code2, Eye, Zap } from 'lucide-react'

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
    
    // Simulate generation
    setTimeout(() => {
      const mockResults = Array.from(selectedLLMs).map(llmId => {
        const llm = LLMS.find(l => l.id === llmId)
        return {
          id: llmId,
          name: llm.name,
          provider: llm.provider,
          color: llm.color,
          code: generateMockCode(prompt),
        }
      })
      setResults(mockResults)
      setActiveTab(mockResults.reduce((acc, r) => ({ ...acc, [r.id]: 'code' }), {}))
      setIsGenerating(false)
    }, 2000)
  }

  const generateMockCode = (prompt) => {
    return `import React, { useState } from 'react';

export const GeneratedComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="component">
      <h2>${prompt.slice(0, 30)}...</h2>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Open'}
      </button>
    </div>
  );
};

export default GeneratedComponent;`
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-100 py-5">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">LLM Component Generator</h1>
              <p className="text-sm text-gray-500">Compare React components from multiple LLMs</p>
            </div>
          </div>
          <a 
            href="https://github.com/smammadov1994" 
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            by @smammadov1994
          </a>
        </div>
      </header>

      <main className="container py-8">
        {/* Prompt Section */}
        <div className="card p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your component
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a modern navigation bar with logo, search, and user menu..."
            className="input mb-4 font-mono text-sm"
            rows={3}
          />
          
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select LLMs to compare
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {LLMS.map(llm => (
              <button
                key={llm.id}
                onClick={() => toggleLLM(llm.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedLLMs.has(llm.id)
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ background: llm.color }}
                  />
                  <div>
                    <div className="text-sm font-medium">{llm.name}</div>
                    <div className="text-xs text-gray-500">{llm.provider}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={isGenerating || !prompt.trim()}
            className="btn btn-primary w-full"
          >
            <Zap className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Components'}
          </button>
        </div>

        {/* Loading */}
        {isGenerating && (
          <div className="card p-12 text-center">
            <div className="spinner w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Generating components from {selectedLLMs.size} LLMs...</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              Generated Components ({results.length})
            </h2>
            {results.map(result => (
              <div key={result.id} className="card fade-in">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                      style={{ background: result.color }}
                    >
                      {result.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-500">{result.provider}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyCode(result.code)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-4 mb-3">
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [result.id]: 'code' })}
                      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition ${
                        activeTab[result.id] === 'code'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Code2 className="w-4 h-4" />
                      Code
                    </button>
                    <button
                      onClick={() => setActiveTab({ ...activeTab, [result.id]: 'preview' })}
                      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition ${
                        activeTab[result.id] === 'preview'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                  {activeTab[result.id] === 'code' ? (
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                      <code>{result.code}</code>
                    </pre>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Preview frame for {result.name}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
