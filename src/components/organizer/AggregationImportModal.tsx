import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { aiService, SocialImportResult } from '../../services/aiService';
import { Opportunity } from '../../types';
import { Link as LinkIcon, Sparkles, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export const AggregationImportModal: React.FC = () => {
  const { isImportModalOpen, setIsImportModalOpen, theme, addNewOpportunity } = useApp();
  const isDark = theme === 'dark';

  const [inputUrlOrText, setInputUrlOrText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<SocialImportResult | null>(null);

  if (!isImportModalOpen) return null;

  const handleAnalyze = async () => {
    if (!inputUrlOrText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await aiService.parseSocialMediaPost(inputUrlOrText, inputUrlOrText);
      setParsedData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedData) return;

    const importedOpp: Opportunity = {
      id: `vos-imp-${Date.now()}`,
      title: parsedData.title,
      organizer: parsedData.organizer,
      organizerVerified: false,
      cause: parsedData.cause,
      venueType: parsedData.venueType,
      location: parsedData.location,
      distance: '1.5 miles away',
      date: parsedData.date,
      time: parsedData.time,
      durationHours: parsedData.durationHours,
      spotsTotal: parsedData.spotsTotal,
      spotsFilled: 2,
      description: parsedData.description,
      impactSummary: 'Extracted via Social Aggregation Neural Engine.',
      requirements: parsedData.requirements,
      shifts: [
        {
          id: `shift-imp-${Date.now()}`,
          date: parsedData.date,
          time: parsedData.time,
          spotsTotal: parsedData.spotsTotal,
          spotsFilled: 2
        }
      ],
      source: parsedData.detectedSource,
      sourceUrl: inputUrlOrText.startsWith('http') ? inputUrlOrText : undefined,
      aiMatchScore: 94,
      aiMatchReason: `Parsed from ${parsedData.detectedSource} post.`,
      status: 'active'
    };

    addNewOpportunity(importedOpp);
    setIsImportModalOpen(false);
    setInputUrlOrText('');
    setParsedData(null);
  };

  return (
    <Modal
      isOpen={isImportModalOpen}
      onClose={() => setIsImportModalOpen(false)}
      title="Multi-Platform Aggregation Importer"
      subtitle="Paste any Facebook link, Instagram caption, school flyer, or city URL to unify it into VolunteerOS."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs">
        {/* URL / Raw text input box */}
        <div>
          <label className="block font-mono text-[10px] uppercase opacity-60 mb-1.5">
            Social Post / URL / Email Text
          </label>
          <textarea
            rows={4}
            value={inputUrlOrText}
            onChange={(e) => setInputUrlOrText(e.target.value)}
            placeholder="Paste URL (e.g. instagram.com/p/... or facebook.com/events/...) or raw text flyer..."
            className={`w-full p-4 rounded-2xl border font-mono text-xs focus:outline-none transition-all ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600' 
                : 'bg-zinc-100 border-zinc-200 text-black placeholder-zinc-400 focus:border-zinc-400'
            }`}
          />
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] opacity-40 uppercase">Try Sample:</span>
          <button
            onClick={() => setInputUrlOrText('https://instagram.com/p/urban_solar_initiative #volunteers #environment')}
            className={`px-3 py-1 rounded-full border text-[11px] font-mono transition-colors ${
              isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700' : 'border-zinc-200 bg-zinc-100 text-zinc-700'
            }`}
          >
            Instagram Solar Post
          </button>

          <button
            onClick={() => setInputUrlOrText('https://city.gov/events/food-pantry-drive-august-2026')}
            className={`px-3 py-1 rounded-full border text-[11px] font-mono transition-colors ${
              isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700' : 'border-zinc-200 bg-zinc-100 text-zinc-700'
            }`}
          >
            City Portal URL
          </button>
        </div>

        {/* Analyze Action */}
        {!parsedData && (
          <div className="pt-2">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputUrlOrText.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-all ${
                isAnalyzing || !inputUrlOrText.trim()
                  ? 'opacity-50 cursor-not-allowed bg-zinc-700 text-zinc-400'
                  : isDark
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-lg'
                    : 'bg-black text-white hover:bg-zinc-800 shadow-lg'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Neural Engine Parsing Post...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Parse & Structurize Opportunity</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Extracted Preview Card */}
        {parsedData && (
          <div className={`p-5 rounded-2xl border space-y-4 animate-fade-in ${
            isDark ? 'bg-zinc-900/80 border-zinc-700 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs uppercase tracking-wider">AI Extraction Complete ({parsedData.confidenceScore}% confidence)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-mono border-zinc-500/30">
                Source: {parsedData.detectedSource}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-light">{parsedData.title}</h4>
              <p className="text-xs opacity-70">{parsedData.organizer} • {parsedData.cause}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono opacity-80">
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <p className="opacity-50 text-[10px]">TIME & DURATION</p>
                <p className="mt-0.5">{parsedData.time} ({parsedData.durationHours}h)</p>
              </div>

              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <p className="opacity-50 text-[10px]">LOCATION</p>
                <p className="mt-0.5">{parsedData.location}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-500/10">
              <button
                onClick={() => setParsedData(null)}
                className={`px-4 py-2 rounded-full border ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-300 text-zinc-600'}`}
              >
                Re-analyze
              </button>

              <button
                onClick={handleConfirmImport}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-full font-medium transition-all ${
                  isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <span>Approve & Add to OS Feed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
