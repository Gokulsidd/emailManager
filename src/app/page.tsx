"use client";

import * as React from "react";
import { Mail, FileText } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import EmailRulePage from "./emailrule/page";

export default function Home() {
  const emailIframeUrl =
    process.env.NEXT_PUBLIC_EMAIL_IFRAME_URL ||
    "https://mail.google.com";

  const untaggedMailsUrl =
    process.env.NEXT_PUBLIC_UNTAGGED_MAILS_URL ||
    "https://mail.google.com/mail/u/0/#search/is:unread";

  return (
   <main className="h-full w-full flex flex-col bg-muted/30 overflow-hidden">
      <Tabs defaultValue="rules" className="flex flex-col h-full gap-0">
        <header className="bg-background flex items-center border-b shrink-0 h-14 px-6">
          <TabsList className="h-10 rounded-lg bg-gray-100 gap-2">
            <TabsTrigger value="untagged" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Mail className="h-4 w-4" />
              Untagged Mails
            </TabsTrigger>

            <TabsTrigger value="emails" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Mail className="h-4 w-4" />
              Emails
            </TabsTrigger>

            <TabsTrigger value="rules" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" />
              Email Rules
            </TabsTrigger>
          </TabsList>
        </header>

        {/* Content */}
        <section className="flex-1 min-h-0 bg-background">
          <TabsContent value="untagged" className="h-full m-0">
            <iframe
              src={untaggedMailsUrl}
              title="Untagged Mails"
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </TabsContent>

          <TabsContent value="emails" className="h-full m-0">
            <iframe
              src={emailIframeUrl}
              title="Email Client"
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </TabsContent>

          <TabsContent value="rules" className="h-full m-0 overflow-hidden bg-gray-50">
              <EmailRulePage />
          </TabsContent>
        </section>
      </Tabs>
    </main>
  );
}
