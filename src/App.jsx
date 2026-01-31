import { useState } from 'react'
import { Sparkles, Copy, Check, Code2, Eye, X, Settings, ChevronRight, Key } from 'lucide-react'

const OPENROUTER_MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic' },
  { id: 'google/gemini-2-pro', name: 'Gemini 2 Pro', provider: 'Google' },
  { id: 'z-ai/glm-4-7', name: 'GLM-4.7', provider: 'Z-AI' },
  { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5', provider: 'Moonshot' },
  { id: 'minimax/minimax-m2.1', name: 'MiniMax M2.1', provider: 'MiniMax' },
  { id: 'deepseek/deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek' },
  { id: 'meta/llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta' },
]

function App() {
  const [prompt, setPrompt] = useState('')
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [selectedModels, setSelectedModels] = useState(new Set(['openai/gpt-4o', 'anthropic/claude-sonnet-4']))
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState([])
  const [activeTab, setActiveTab] = useState({})
  const [copied, setCopied] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeArtifact, setActiveArtifact] = useState(null)

  const toggleModel = (id) => {
    const newSet = new Set(selectedModels)
    newSet.has(id) ? newSet.delete(id) : newSet.add(id)
    setSelectedModels(newSet)
  }

  const generate = async () => {
    if (!prompt.trim()) return
    if (!openRouterKey) {
      setShowSettings(true)
      return
    }
    setIsGenerating(true)
    setResults([])
    setActiveArtifact(null)
    
    const promises = Array.from(selectedModels).map(async (modelId) => {
      const model = OPENROUTER_MODELS.find(m => m.id === modelId)
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'LLM Component Generator'
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              { role: 'system', content: 'You are a React component generator. Generate clean, functional React components with Tailwind CSS styling. Return ONLY the code, no explanations.' },
              { role: 'user', content: `Create a React component for: ${prompt}. Use Tailwind CSS for styling. Make it clean and modern.` }
            ],
            temperature: 0.7, max_tokens: 2000
          })
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        const code = data.choices?.[0]?.message?.content || ''
        const codeMatch = code.match(/```(?:jsx?|tsx?)?\n([\s\S]*?)```/)
        const cleanCode = codeMatch ? codeMatch[1].trim() : code.trim()
        return { id: modelId, name: model.name, provider: model.provider, code: cleanCode, error: null }
      } catch (error) {
        return { id: modelId, name: model.name, provider: model.provider, code: '', error: error.message }
      }
    })
    
    const results = await Promise.all(promises)
    setResults(results)
    setActiveTab(results.reduce((acc, r) => ({ ...acc, [r.id]: 'code' }), {}))
    setIsGenerating(false)
  }

  const copyCode = async (code, id) => {
    await navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const reset = () => { setPrompt(''); setResults([]); setActiveTab({}); setActiveArtifact(null) }
  const openArtifact = (result) => setActiveArtifact(result)
  const closeArtifact = () => setActiveArtifact(null)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            LLM Component Generator <Sparkles className="w-6 h-6 text-blue-600" />
          </h1>
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <p className="text-gray-600 text-lg mb-2">Generate beautiful React components with multiple AI models</p>
          {!openRouterKey && <p className="text-amber-600 text-sm flex items-center justify-center gap-2"><Key className="w-4 h-4" /> Please add your OpenRouter API key in Settings</p>}
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Component Description</label>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. A clean React button component with hover effects" className="input" rows={4} />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">Select Models to Compare</label>
              <div className="checkbox-grid">
                {OPENROUTER_MODELS.map((model) => (
                  <div key={model.id} className={`checkbox-item ${selectedModels.has(model.id) ? 'bg-blue-50 border-blue-300' : ''}`} onClick={() => toggleModel(model.id)}>
                    <input type="checkbox" checked={selectedModels.has(model.id)} onChange={() => toggleModel(model.id)} className="check" />
                    <div><div className="text-sm font-medium text-gray-900">{model.name}</div><div className="text-xs text-gray-500">{model.provider}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={generate} disabled={isGenerating || selectedModels.size === 0} className="button button-primary flex-1 py-4 text-base">
                {isGenerating ? <span className="flex items-center justify-center gap-2"><div className="loading" /> Generating...</span> : 'Generate Components'}
              </button>
              {results.length > 0 && <button onClick={reset} className="button bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-4">Reset</button>}
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Generated Components</h2>
            <div className="results-grid">
              {results.map((result) => (
                <div key={result.id} className="card result-card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div><h3 className="text-lg font-semibold text-gray-900">{result.name}</h3><p className="text-sm text-gray-500">{result.provider}</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => copyCode(result.code, result.id)} className="icon-button" title="Copy code">
                          {copied === result.id ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button onClick={() => openArtifact(result)} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">View<ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {result.error ? <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">Error: {result.error}</div> : <div className="code-preview"><pre className="code-block text-xs">{result.code.slice(0, 200)}...</pre></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OpenRouter API Key</label>
              <input type="password" value={openRouterKey} onChange={(e) => setOpenRouterKey(e.target.value)} placeholder="sk-or-v1-..." className="input" />
              <p className="mt-2 text-xs text-gray-500">Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">openrouter.ai</a></p>
            </div>
            <button onClick={() => setShowSettings(false)} className="button button-primary w-full mt-6">Save</button>
          </div>
        </div>
      )}

      {activeArtifact && (
        <div className="artifact-overlay" onClick={closeArtifact}>
          <div className="artifact-panel" onClick={(e) => e.stopPropagation()}>
            <div className="artifact-header">
              <div><h2 className="text-lg font-semibold text-gray-900">{activeArtifact.name}</h2><p className="text-sm text-gray-500">{activeArtifact.provider}</p></div>
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setActiveTab({ ...activeTab, [activeArtifact.id]: 'code' })} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab[activeArtifact.id] === 'code' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><Code2 className="w-4 h-4" />Code</button>
                  <button onClick={() => setActiveTab({ ...activeTab, [activeArtifact.id]: 'preview' })} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab[activeArtifact.id] === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><Eye className="w-4 h-4" />Preview</button>
                </div>
                <button onClick={() => copyCode(activeArtifact.code, activeArtifact.id)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{copied === activeArtifact.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}Copy</button>
                <button onClick={closeArtifact} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="artifact-content">
              {activeTab[activeArtifact.id] === 'code' ? <pre className="code-block-full">{activeArtifact.code}</pre> : <div className="preview-container"><div className="text-gray-500 text-center py-20"><Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" /><p>Preview mode uses Sandpack or similar sandbox</p><p className="text-sm mt-2">Copy code to test in your project</p></div></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
