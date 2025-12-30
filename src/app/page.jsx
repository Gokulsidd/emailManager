"use client";

import * as React from "react";
import { Mail, FileText, Plus, MoveRightIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import EmailRulePage from "./emailrule/page";
import ConfigWizard from "@/components/ConfigWizard";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { openWizard, isWizardOpen, closeWizard } = useStore();

  const emailIframeUrl =
    process.env.NEXT_PUBLIC_EMAIL_IFRAME_URL || "https://mail.google.com";

  const untaggedMailsUrl =
    process.env.NEXT_PUBLIC_UNTAGGED_MAILS_URL ||
    "https://mail.google.com/mail/u/0/#search/is:unread";

  return (
    <main className="flex w-full h-full">
      <div className="h-full w-full p-2 bg-gray-50">
        <div className="h-full w-full flex flex-col bg-white  overflow-hidden rounded-xl shadow-md ">
          <Tabs defaultValue="rules" className="flex flex-col h-full gap-0">
            <header className="flex items-center justify-between border-b shrink-0 h-14 px-6">
              <TabsList className="h-10 rounded-2xl bg-gray-100 gap-2">
                <TabsTrigger
                  value="untagged"
                  className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  Untagged Mails
                </TabsTrigger>

                <TabsTrigger
                  value="emails"
                  className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  Emails
                </TabsTrigger>

                <TabsTrigger
                  value="rules"
                  className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  Email Rules
                </TabsTrigger>
              </TabsList>

              {isWizardOpen ? (
                <Button
                  onClick={closeWizard}
                  size="lg"
                  className="gap-2 h-8 rounded-full"
                >
                  Cancel
                  <MoveRightIcon />
                </Button>
              ) : (
                <Button
                  onClick={() => openWizard("add")}
                  size="lg"
                  className="gap-2 h-8 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                  New Rule
                </Button>
              )}
            </header>

            {/* Content */}
            <section className="flex-1 min-h-0">
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

              <TabsContent value="rules" className="h-full m-0 overflow-hidden">
                <EmailRulePage />
              </TabsContent>
            </section>
          </Tabs>
        </div>
      </div>
      {isWizardOpen && (
        <div className="p-2 w-2/4 bg-gray-50">
          <ConfigWizard />
        </div>
      )}
    </main>
  );
}
