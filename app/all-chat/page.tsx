"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AVGCAnalyzer from '@/components/AVGCAnalyzer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, MessageSquare, User, Menu } from 'lucide-react';

interface ChatSummary {
  id: string;
  email: string;
  name: string;
  prompt: string;
  createdAt: string;
}

interface ChatDetail {
  id: string;
  email: string;
  name: string;
  prompt: string;
  response: any;
  createdAt: string;
}

export default function AllChatPage() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDetail | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [limit] = useState(20);

  const fetchChats = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats?page=${pageNum}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) {
        setChats(data.chats);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchChats(page);
  }, [page, fetchChats]);

  const loadChatDetail = async (id: string) => {
    setLoadingChat(true);
    try {
      const res = await fetch(`/api/chats/${id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedChat(data.chat);
      }
    } catch (error) {
      console.error('Failed to load chat detail:', error);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Selection List Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80 border-r' : 'w-0'} transition-all duration-300 border-border flex flex-col bg-card/10 shrink-0 overflow-hidden`}>
        <div className="p-6 border-b border-border bg-card/20 whitespace-nowrap">
          <h1 className="text-xl font-bold flex items-center gap-2">
             Admin View
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Review all generated analyses</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Loading chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No chats found.
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => loadChatDetail(chat.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border whitespace-nowrap overflow-hidden ${
                  selectedChat?.id === chat.id
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'hover:bg-accent border-transparent'
                }`}
              >
                <div className="text-sm font-bold truncate mb-1">{chat.prompt}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                  <User size={10} />
                  <span className="truncate">{chat.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {new Date(chat.createdAt).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-card/20 whitespace-nowrap">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1 || loading}
            onClick={() => setPage(p => p - 1)}
            className="h-8 w-8"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page === totalPages || loading}
            onClick={() => setPage(p => p + 1)}
            className="h-8 w-8"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </aside>

      {/* Detail View / Analyzer */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {/* Toggle Button Container */}
        <div className="absolute top-4 left-4 z-[60]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-background/80 backdrop-blur-sm border shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {loadingChat && (
          <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm font-medium animate-pulse">Loading analysis data...</p>
            </div>
          </div>
        )}

        {selectedChat ? (
          <div className="flex-1 overflow-y-auto">
            {/* Context Info Header */}
             <div className="bg-card/30 border-b border-border p-4 pl-16 pr-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-primary">Analysis for: "{selectedChat.prompt}"</h2>
                  <div className="flex items-center gap-4 mt-1">
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <User size={10} /> {selectedChat.name} ({selectedChat.email})
                     </span>
                  </div>
                </div>
                <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setSelectedChat(null)}
                   className="text-[10px]"
                >
                   Close Analysis
                </Button>
             </div>
            <AVGCAnalyzer data={selectedChat.response} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary/40" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Select a chat to view analysis</h2>
            <p className="text-muted-foreground max-w-sm">
              Choose from the list on the left to review the business opportunity analysis generated for that prompt.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}