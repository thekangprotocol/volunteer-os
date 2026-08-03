import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { aiService } from '../../services/aiService';
import { Opportunity } from '../../types';
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AISmartAssistantModal: React.FC = () => {
  const { isAIModalOpen, setIsAIModalOpen, theme, opportunities, setSelectedOpportunity } = useApp();
  const isDark = theme === 'dark';

  const [aiQuery, setAiQuery] = useState('');
  const [isInferring, setIsInferring] = useState(false);
  const [matchedResults, setMatchedResults] = useState<Opportunity[] | null>(null);

  if (!isAIModalOpen) return null;

  const handleRunMatch = async (customQuery?: string) => {
    const q = customQuery || aiQuery;
    setIsInferring(true);
    try {
      const results = await aiService.runSmartMatch(q, opportunities);
      setMatchedResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInferring(false);
    }
  };

  return (
    <Modal
      isOpen={isAIModalOpen}
      onClose={() => setIsAIModalOpen(false)}
      title="VolunteerOS Neural Match Engine"
      subtitle="AI-driven semantic opportunity finder. Match your skills, schedule, and personal cause affinity."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs">
        {/* Input prompt */}
        <div className="relative">
          <textarea
            rows={3}
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Describe your ideal volunteer shift, e.g. 'I want to mentor high school students in coding on weekends or help at a food bank at night...'"
            className={`w-full p-4 rounded-2xl border text-xs focus:outline-none transition-all ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600' 
                : 'bg-zinc-100 border-zinc-200 text-black placeholder-zinc-400 focus:border-zinc-400'
            }`}
          />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] opacity-40 uppercase">Prompts:</span>
          {[
            'Night shifts for food security',
            'Remote tech mentorship for youth',
            'Urgent emergency disaster relief'
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setAiQuery(prompt);
                handleRunMatch(prompt);
              }}
              className={`px-3 py-1 rounded-full border text-[11px] font-mono transition-colors ${
                isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700' : 'border-zinc-200 bg-zinc-100 text-zinc-700'
              }`}
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Run Action */}
        <div>
          <button
            onClick={() => handleRunMatch()}
            disabled={isInferring}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-all ${
              isInferring
                ? 'opacity-50 cursor-not-allowed bg-zinc-700 text-zinc-400'
                : isDark
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-xl'
                  : 'bg-black text-white hover:bg-zinc-800 shadow-xl'
            }`}
          >
            {isInferring ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Neural Embeddings...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Opportunity Match</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {matchedResults && (
          <div className="space-y-3 pt-4 border-t border-zinc-500/10">
            <p className="font-mono text-[10px] uppercase opacity-40">
              Ranked Opportunities ({matchedResults.length} Matched)
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {matchedResults.slice(0, 4).map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => {
                    setSelectedOpportunity(opp);
                    setIsAIModalOpen(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isDark 
                      ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600' 
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-500/20">
                        {opp.aiMatchScore}% MATCH
                      </span>
                      <span className="text-xs font-mono opacity-60">{opp.cause}</span>
                    </div>
                    <h4 className="text-sm font-medium">{opp.title}</h4>
                    <p className="text-xs opacity-60 font-mono">{opp.aiMatchReason}</p>
                  </div>

                  <ArrowRight className="w-4 h-4 opacity-40 shrink-0 ml-3" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
