"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Workflow, Clock, Tag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface WorkflowSearchResult {
  id: string;
  name: string;
  description: string | null;
  folder: string | null;
  tags: string[];
  _count: {
    executions: number;
  };
}

export function WorkflowSearch() {
  const trpc = useTRPC();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = useQuery({
    ...trpc.workflows.search.queryOptions({ query: debouncedQuery }),
    enabled: debouncedQuery.length >= 1,
  });

  const typedResults = results as WorkflowSearchResult[] | undefined;

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md z-50">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-[var(--arch-accent)] transition-colors" />
        <Input
          type="text"
          placeholder="SEARCH MATRICES..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          className="pl-11 pr-10 bg-white/5 border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest placeholder:text-white/30 rounded-full focus-visible:ring-1 focus-visible:ring-emerald-400/50 focus-visible:border-emerald-400/50 transition-all h-11 shadow-inner hover:bg-white/10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && debouncedQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="absolute top-[calc(100%+0.5rem)] w-full z-[100] max-h-96 overflow-y-auto bg-[rgba(15,17,21,0.95)] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2"
          >
            {isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center text-white/50 space-y-3">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <span className="font-mono text-[9px] uppercase tracking-widest">Querying Network...</span>
              </div>
            ) : typedResults && typedResults.length > 0 ? (
              <div className="space-y-1">
                {typedResults.map((workflow) => (
                  <Link
                    key={workflow.id}
                    href={`/workflows/${workflow.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col gap-2 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors shrink-0">
                        <Workflow className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate font-mono text-sm text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                          {workflow.name}
                        </h4>
                        {workflow.description && (
                          <p className="text-[10px] text-white/40 truncate font-mono uppercase tracking-widest mt-0.5">
                            {workflow.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-2 pl-[3.25rem]">
                      {workflow.folder && (
                        <span className="text-[8px] font-mono tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          {workflow.folder}
                        </span>
                      )}
                      {workflow.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center text-[8px] font-mono tracking-widest uppercase text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full"
                        >
                          <Tag className="h-2 w-2 mr-1 opacity-50" />
                          {tag}
                        </span>
                      ))}
                      <span className="text-[8px] text-white/30 flex items-center gap-1 font-mono uppercase tracking-widest">
                        <Clock className="h-2.5 w-2.5 ml-1" />
                        {workflow._count.executions} Cycles
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <Search className="h-6 w-6 text-white/20 mb-3" />
                <p className="text-white/50 font-mono text-[10px] uppercase tracking-widest">Zero Matches Found</p>
                <p className="text-white/30 font-mono text-[8px] uppercase tracking-widest mt-1">Adjust Query Parameters</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
