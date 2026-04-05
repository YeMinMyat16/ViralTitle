import { useState, type ReactNode } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Youtube, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Zap,
  Heart,
  Eye
} from "lucide-react";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GeneratedContent {
  titles: string[];
  styles: {
    curiosity: string;
    emotional: string;
    straightforward: string;
  };
}

export default function App() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);

  const generateTitles = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate viral YouTube titles for this idea: "${idea}". 
        Follow these rules:
        - Use curiosity, emotion, or urgency
        - Keep titles under 60 characters when possible
        - Make them feel natural, not clickbait spam
        - Avoid repetition
        - Focus on virality
        
        Provide 10 general viral titles and 3 specific styled titles (Curiosity-based, Emotional, Straightforward).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "10 viral YouTube titles"
              },
              styles: {
                type: Type.OBJECT,
                properties: {
                  curiosity: { type: Type.STRING },
                  emotional: { type: Type.STRING },
                  straightforward: { type: Type.STRING }
                },
                required: ["curiosity", "emotional", "straightforward"]
              }
            },
            required: ["titles", "styles"]
          }
        }
      });

      const text = response.text;
      if (text) {
        setResult(JSON.parse(text));
      }
    } catch (err) {
      console.error("Generation failed:", err);
      setError("Failed to generate titles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Youtube size={20} className="text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight">ViralTitle<span className="text-red-500">Pro</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-zinc-400">
            <span>AI-Powered</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>High CTR</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>Viral Ready</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight"
          >
            Stop Guessing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Start Trending.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Generate high-click-through-rate YouTube titles that trigger curiosity and emotion.
          </motion.p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
            <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 p-2 flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateTitles()}
                placeholder="Enter your video idea (e.g., 'How to grow a garden in the desert')"
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-lg placeholder:text-zinc-600 outline-none"
              />
              <button 
                onClick={generateTitles}
                disabled={loading || !idea.trim()}
                className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Generate
                    <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-red-400 text-sm justify-center"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Styles Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StyleCard 
                  title="Curiosity-based" 
                  content={result.styles.curiosity} 
                  icon={<Eye className="text-blue-400" size={20} />}
                  onCopy={() => copyToClipboard(result.styles.curiosity, 'curiosity')}
                  isCopied={copiedIndex === 'curiosity'}
                />
                <StyleCard 
                  title="Emotional" 
                  content={result.styles.emotional} 
                  icon={<Heart className="text-pink-400" size={20} />}
                  onCopy={() => copyToClipboard(result.styles.emotional, 'emotional')}
                  isCopied={copiedIndex === 'emotional'}
                />
                <StyleCard 
                  title="Straightforward" 
                  content={result.styles.straightforward} 
                  icon={<Zap className="text-yellow-400" size={20} />}
                  onCopy={() => copyToClipboard(result.styles.straightforward, 'straightforward')}
                  isCopied={copiedIndex === 'straightforward'}
                />
              </div>

              {/* Main List */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap size={20} className="text-red-500 fill-current" />
                    10 Viral Variations
                  </h2>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Optimized for CTR</span>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {result.titles.map((title, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center justify-between px-8 py-5 hover:bg-zinc-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-zinc-600 font-mono text-sm w-4">{index + 1}</span>
                        <p className="text-zinc-200 font-medium group-hover:text-white transition-colors">{title}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(title, index)}
                        className={`p-2 rounded-lg transition-all ${
                          copiedIndex === index 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {copiedIndex === index ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 grayscale pointer-events-none">
            <Youtube size={80} className="mb-4" />
            <p className="text-xl font-medium">Ready to go viral?</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        <p>© 2026 ViralTitlePro. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
}

function StyleCard({ title, content, icon, onCopy, isCopied }: { 
  title: string, 
  content: string, 
  icon: ReactNode, 
  onCopy: () => void,
  isCopied: boolean
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-zinc-700 transition-colors">
      <div>
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">{title}</h3>
        </div>
        <p className="text-lg font-semibold text-zinc-100 leading-tight mb-6">{content}</p>
      </div>
      <button 
        onClick={onCopy}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          isCopied 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
        }`}
      >
        {isCopied ? (
          <>
            <Check size={16} />
            Copied
          </>
        ) : (
          <>
            <Copy size={16} />
            Copy Title
          </>
        )}
      </button>
    </div>
  );
}

