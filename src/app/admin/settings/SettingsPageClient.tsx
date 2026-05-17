// @ts-nocheck
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Save, Settings } from "lucide-react";
import { toast } from "sonner";

type Setting = {
  key: string;
  value: unknown;
  category: string;
};

function SettingRow({
  setting,
  onSave,
  saving,
}: {
  setting: Setting;
  onSave: (key: string, val: string) => void;
  saving: boolean;
}) {
  const [val, setVal] = useState(
    typeof setting.value === "string"
      ? setting.value
      : JSON.stringify(setting.value),
  );
  const dirty = val !== (typeof setting.value === "string" ? setting.value : JSON.stringify(setting.value));

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium">{setting.key}</p>
      </div>
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="h-8 w-56 font-mono text-xs"
      />
      <Button
        size="sm"
        className="h-7 gap-1 text-xs"
        variant={dirty ? "default" : "outline"}
        disabled={!dirty || saving}
        onClick={() => onSave(setting.key, val)}
      >
        <Save className="h-3 w-3" /> Save
      </Button>
    </div>
  );
}

export default function SettingsPageClient() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const { data, isLoading } = useQuery(trpc.admin.settings.list.queryOptions());

  const setMutation = useMutation(
    trpc.admin.settings.set.mutationOptions({
      onSuccess: (_, vars) => {
        toast.success(`Saved ${vars.key}`);
        qc.invalidateQueries(trpc.admin.settings.list.pathFilter());
        setSavingKey(null);
      },
      onError: (e) => { toast.error(e.message); setSavingKey(null); },
    }),
  );

  const handleSave = (key: string, rawVal: string) => {
    setSavingKey(key);
    let value: unknown = rawVal;
    try { value = JSON.parse(rawVal); } catch { /* keep as string */ }
    setMutation.mutate({ key, value });
  };

  // Group by category
  const grouped = (data ?? []).reduce<Record<string, Setting[]>>((acc, s) => {
    const cat = s.category ?? "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Platform-wide configuration</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="py-12 text-center">
          <Settings className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No settings configured yet. Settings will appear here once created.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, settings]) => (
          <Card key={category} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold capitalize">{category}</CardTitle>
                <Badge variant="outline" className="text-[10px]">{settings.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settings.map((s, i) => (
                  <div key={s.key}>
                    {i > 0 && <Separator className="my-2" />}
                    <SettingRow
                      setting={s}
                      onSave={handleSave}
                      saving={savingKey === s.key}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
