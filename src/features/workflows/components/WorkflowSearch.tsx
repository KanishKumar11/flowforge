"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Workflow, Clock, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Explicit types to avoid deep type inference
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

  // Cast to explicit type to avoid deep type inference
  const typedResults = results as WorkflowSearchResult[] | undefined;

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-(--arch-muted)" />
        <Input
          type="text"
          placeholder="SEARCH_WORKFLOWS..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-8 bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-sm placeholder:text-(--arch-muted) rounded-none focus-visible:ring-0 focus-visible:border-(--arch-fg) transition-colors h-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-(--arch-muted) hover:text-(--arch-fg)"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && debouncedQuery && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-80 overflow-auto shadow-lg bg-(--arch-bg) border-(--arch-border) rounded-none">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground font-mono text-xs">
                Searching...
              </div>
            ) : typedResults && typedResults.length > 0 ? (
              <div className="space-y-1">
                {typedResults.map((workflow) => (
                  <Link
                    key={workflow.id}
                    href={`/workflows/${workflow.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-2 hover:bg-(--arch-fg)/10 transition-colors group"
                  >
                    <Workflow className="h-5 w-5 text-(--arch-muted) group-hover:text-(--arch-fg) mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate font-mono text-sm text-(--arch-fg)">
                        {workflow.name}
                      </p>
                      {workflow.description && (
                        <p className="text-xs text-(--arch-muted) truncate font-mono">
                          {workflow.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {workflow.folder && (
                          <Badge
                            variant="outline"
                            className="text-[10px] rounded-none border-(--arch-border) text-(--arch-muted)"
                          >
                            {workflow.folder}
                          </Badge>
                        )}
                        {workflow.tags?.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] rounded-none bg-(--arch-fg)/10 text-(--arch-fg)"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        <span className="text-[10px] text-(--arch-muted) flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3" />
                          {workflow._count.executions} runs
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No workflows found for &quot;{debouncedQuery}&quot;
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
