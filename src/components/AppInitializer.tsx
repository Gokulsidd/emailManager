"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getAllEmails } from "@/services/api.services";

const AppInitializer = () => {
  const searchParams = useSearchParams();
  const { setConfigs, setEmails } = useStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Fetch configuration
        const res = await fetch(`/config.json`);
        if (!res.ok) throw new Error("Failed to load config.json");
        
        const data = await res.json();
        console.log("Config loaded:", data);
        setConfigs(data);

        // Fetch all emails
        const emails = await getAllEmails();
        console.log("Emails loaded:", emails);
        setEmails(emails);
      } catch (err) {
        console.error("App initialization failed:", err);
      }
    };

    initializeApp();
  }, [setConfigs, setEmails]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      // Handle dashboard ID or other params here
      console.log("ID param found:", id);
    }
  }, [searchParams]);

  return null;
};

export default AppInitializer;
