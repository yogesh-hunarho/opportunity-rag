"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AVGCAnalyzer from './AVGCAnalyzer';
import { Button } from './ui/button';
import Image from 'next/image';
import { Menu, Plus } from 'lucide-react';
import NovaraHero from './testlanding-page';
import { useAuthStore } from '@/lib/store';

// import LandingPage from './LandingPage';
// import sampleData from '@/lib/avgc-data.json';

interface ChatItem {
  id: string;
  prompt: string;
  createdAt: string;
}

type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AI_GENERATION_ERROR'
  | 'JSON_PARSE_ERROR'
  | 'DATABASE_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'UNKNOWN_ERROR';

interface ApiError {
  code: ErrorCode;
  title: string;
  message: string;
  suggestion: string;
}

interface WarningInfo {
  code: string;
  message: string;
}

// ── Error appearance per code ───────────────────────────────────────
const ERROR_META: Record<ErrorCode, { icon: string; gradient: string; border: string; bg: string }> = {
  VALIDATION_ERROR: {
    icon: '📝',
    gradient: 'from-amber-500/20 to-amber-900/10',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
  },
  AI_GENERATION_ERROR: {
    icon: '🤖',
    gradient: 'from-purple-500/20 to-purple-900/10',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
  },
  JSON_PARSE_ERROR: {
    icon: '⚙️',
    gradient: 'from-orange-500/20 to-orange-900/10',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
  },
  DATABASE_ERROR: {
    icon: '💾',
    gradient: 'from-cyan-500/20 to-cyan-900/10',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/10',
  },
  RATE_LIMIT_ERROR: {
    icon: '⏳',
    gradient: 'from-red-500/20 to-red-900/10',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
  },
  UNKNOWN_ERROR: {
    icon: '❌',
    gradient: 'from-red-500/20 to-red-900/10',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
  },
};

// ── Error Display Component ─────────────────────────────────────────
const ErrorDisplay = ({
  error,
  onRetry,
  onDismiss,
}: {
  error: ApiError;
  onRetry?: () => void;
  onDismiss: () => void;
}) => {
  const meta = ERROR_META[error.code] ?? ERROR_META.UNKNOWN_ERROR;

  return (
    <div className="m-6 max-w-2xl mx-auto animate-[fadeSlideIn_0.35s_ease-out]">
      <div
        className={`relative overflow-hidden rounded-2xl border ${meta.border} bg-linear-to-br ${meta.gradient} backdrop-blur-sm shadow-2xl`}
      >
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className={`shrink-0 w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center text-2xl shadow-inner`}
            >
              {meta.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-bold text-base">{error.title}</h3>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-white/60 uppercase tracking-wider">
                  {error.code.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{error.message}</p>
            </div>

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="shrink-0 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Suggestion box */}
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-sm mt-0.5">💡</span>
            <p className="text-white/60 text-xs leading-relaxed">{error.suggestion}</p>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-5 py-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            )}
            <button
              onClick={onDismiss}
              className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all cursor-pointer border border-white/10"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Warning Banner (for DB save failures) ───────────────────────────
const WarningBanner = ({
  warning,
  onDismiss,
}: {
  warning: WarningInfo;
  onDismiss: () => void;
}) => (
  <div className="mx-6 mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-xl flex items-center gap-3 animate-[fadeSlideIn_0.35s_ease-out]">
    <span className="text-lg">⚠️</span>
    <p className="flex-1 text-amber-300/80 text-xs">{warning.message}</p>
    <button
      onClick={onDismiss}
      className="text-amber-400/50 hover:text-amber-300 transition-colors cursor-pointer text-xs"
    >
      ✕
    </button>
  </div>
);

// ── Main Component ──────────────────────────────────────────────────
const HomePage = () => {
  const { name, email, isLoggedIn, setAuth, logout } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);
  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [warning, setWarning] = useState<WarningInfo | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');

  const fetchChats = useCallback(async () => {
    if (!email) return;
    try {
      const res = await fetch(`/api/chats?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!res.ok && data.error && typeof data.error === 'object' && data.error.code) {
        setError(data.error as ApiError);
        return;
      }

      if (data.chats) setChats(data.chats);
    } catch (err) {
      console.error('Failed to fetch chats:', err);
      setError({
        code: 'DATABASE_ERROR',
        title: 'Could Not Load Chat History',
        message: err instanceof Error ? err.message : 'Failed to fetch your chat history.',
        suggestion: 'Please check your internet connection and try refreshing the page.',
      });
    }
  }, [email]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && isLoggedIn && email) {
      fetchChats();
    }
  }, [hasHydrated, isLoggedIn, email, fetchChats]);

  const handleGenerate = async (e?: React.FormEvent, retryPrompt?: string) => {
    if (e) e.preventDefault();
    const currentPrompt = retryPrompt || prompt;
    if (!currentPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setWarning(null);
    setAnalysisData(null);
    setActiveChatId(null);
    setLastPrompt(currentPrompt);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, prompt: currentPrompt,  }),
      });

      const result = await res.json();

      if (!res.ok) {
        // Structured error from our API
        if (result.error && typeof result.error === 'object' && result.error.code) {
          setError(result.error as ApiError);
        } else {
          // Fallback for unexpected error shapes
          setError({
            code: 'UNKNOWN_ERROR',
            title: 'Something Went Wrong',
            message: typeof result.error === 'string' ? result.error : 'Failed to generate analysis',
            suggestion: 'Please try again or refresh the page.',
          });
        }
        return;
      }

      // Check for DB warning
      if (result.warning) {
        setWarning(result.warning as WarningInfo);
      }

      setAnalysisData(result.data);
      setActiveChatId(result.id);
      setPrompt('');
      fetchChats();
    } catch (err: unknown) {
      // Network / fetch errors
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError({
        code: 'UNKNOWN_ERROR',
        title: 'Network Error',
        message,
        suggestion: 'Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastPrompt) {
      handleGenerate(undefined, lastPrompt);
    }
  };

  const loadChat = async (chatId: string) => {
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const result = await res.json();

      if (!res.ok) {
        setError({
          code: 'UNKNOWN_ERROR',
          title: 'Failed to Load Chat',
          message: result.error?.message || result.error || 'Could not load the selected analysis.',
          suggestion: 'Try selecting the chat again or refresh the page.',
        });
        return;
      }

      setAnalysisData(result.chat.response);
      setActiveChatId(chatId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load chat';
      setError({
        code: 'UNKNOWN_ERROR',
        title: 'Network Error',
        message,
        suggestion: 'Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAnalysisData(null);
    setChats([]);
    setActiveChatId(null);
    setError(null);
    setWarning(null);
  };

  // Hydration guard for Next.js SSR with persisted store
  if (!hasHydrated) return null;

  // Email login screen
  if (!isLoggedIn) {
    return (
      <NovaraHero    
        onLogin={(receivedName, receivedEmail) => {
          setAuth(receivedName, receivedEmail);
        }} 
      />
    );
  }


  // Main app layout
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Keyframe for error animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex h-screen overflow-hidden">
        {/* Chat History Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-card/10 border-r border-border flex flex-col overflow-hidden shrink-0`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">💬 Chat History</h2>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className='cursor-pointer mb-0 text-red-400 hover:text-red-500 hover:bg-red-500'
              >
                Logout
              </Button>
            </div>
            {/* <div className="text-[10px] text-[#6b7ca4] truncate">{email}</div> */}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-[#4b5a7a] text-xs">
                No previous analyses yet.
                <br />Generate your first one!
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                    activeChatId === chat.id
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : 'hover:bg-primary/30 border border-transparent'
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground truncate">{chat.prompt}</div>
                  <div className="text-[10px] text-[#6b7ca4] mt-1">
                    {new Date(chat.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-background border-b border-border px-4 py-3.5 flex items-center gap-3 shrink-0">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="transition-colors text-lg cursor-pointer"
              title="Toggle sidebar"
              variant={"ghost"}
              size={"icon"}
            >
              <Menu />
            </Button>

            <div className="flex-1 flex justify-end items-center gap-4">
              {/* <ModeToggle /> */}
              {analysisData && (
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() => {
                    setAnalysisData(null);
                    setActiveChatId(null);
                    setPrompt('');
                    setError(null);
                    setWarning(null);
                  }}
                >
                  <Plus/>
                  New Chat
                </Button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Structured Error Display */}
            {error && !loading && (
              <ErrorDisplay
                error={error}
                onRetry={handleRetry}
                onDismiss={() => setError(null)}
              />
            )}

            {/* DB Warning Banner */}
            {warning && !error && (
              <WarningBanner warning={warning} onDismiss={() => setWarning(null)} />
            )}

            {loading && !analysisData && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-border border-t-blue-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold mb-1">AI is analyzing...</p>
                  <p className="text-[#6b7ca4] text-xs">This may take 15-30 seconds</p>
                </div>
                {/* Skeleton */}
                <div className="w-full max-w-4xl px-8 space-y-4 mt-4">
                  <div className="h-16 bg-card rounded-xl animate-pulse" />
                  <div className="h-12 bg-card rounded-xl animate-pulse" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-40 bg-card rounded-xl animate-pulse" />
                    <div className="h-40 bg-card rounded-xl animate-pulse" />
                    <div className="h-40 bg-card rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {!loading && !analysisData && !error && (
              <div className="relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden">
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                  style={{ backgroundImage: 'url("/poster.png")' }}
                >
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 bg-linear-to-b from-background/20 via-transparent to-background" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center p-6 w-full max-w-5xl">
                  {/* <div className="animate-[fadeSlideIn_0.5s_ease-out]">
                      <div className="flex justify-center">
                        <div className="relative group">
                          <Image
                            src="/logo1.png"
                            alt="AI-powered market analysis illustration"
                            width={200}
                            height={200}
                            className="relative"
                            priority
                          />
                        </div>
                      </div>
                  </div> */}

                  <div className="animate-[fadeSlideIn_0.6s_ease-out]">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Market Analyze
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                      Enter any industry, policy, or market topic above and AI will generate a comprehensive business opportunity analysis for you.
                    </p>
                  </div>

                  <div className="max-w-3xl w-full animate-[fadeSlideIn_0.7s_ease-out]">
                    <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Enter a topic to analyze (e.g., 'EV charging infrastructure in India 2026')"
                          disabled={loading}
                          className="w-full px-5 py-3.5 rounded-2xl bg-background/50 backdrop-blur-md border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 ring-1 ring-blue-200/20 focus:ring-1 focus:ring-blue-500 transition-all text-sm md:text-base disabled:opacity-50 shadow-2xl"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        variant="default"
                        size="lg"
                        className='cursor-pointer disabled:cursor-not-allowed bg-primary/60 hover:bg-primary/50 rounded-2xl px-8 h-auto py-3.5 font-bold text-white'
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Analyzing...
                          </span>
                        ) : (
                          <>🚀 <span className="ml-1">Generate</span></>
                        )}
                      </Button>
                    </form>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-4 animate-[fadeSlideIn_0.8s_ease-out]">
                    {[
                      'EV Charging Infrastructure India',
                      'AI in Healthcare 2026',
                      'Green Hydrogen Economy',
                      'EdTech for Rural India',
                      'Space Tech Startups',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setPrompt(suggestion)}
                        className="px-4 py-2 bg-primary/10 backdrop-blur-sm text-foreground/80 text-xs font-medium rounded-xl hover:bg-primary/50 hover:text-accent-foreground transition-all cursor-pointer border border-border/50 shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {analysisData && !loading && (
              <AVGCAnalyzer data={analysisData} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
