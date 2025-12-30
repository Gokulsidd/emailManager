"use client";

import { useEffect, useState } from "react";
import ConfigTable from "@/components/ConfigTable";
import { useStore } from "@/store/useStore";
import { convertEmailToConfig } from "@/services/api.services";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmailRulePage() {
  const { emails, emailConfigs, setEmailConfigs } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (emails && emails.length > 0 && !emailConfigs) {
      const converted = emails.map(convertEmailToConfig);
      setEmailConfigs(converted);
      setIsLoading(false);
    } else if (emailConfigs) {
      setIsLoading(false);
    }
  }, [emails, emailConfigs, setEmailConfigs]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col bg-muted/30 overflow-hidden">
        <div className="flex justify-between items-center px-8 pt-6 pb-5 bg-background border-b">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ConfigTable configs={emailConfigs || []} />
    </div>
  );
}