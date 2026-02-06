"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function DebugUsersList() {
  const users = useQuery(api.users.debugListUsers);
  
  if (!users) return <div>Loading DB users...</div>;
  if (users.length === 0) return <div>No users in DB.</div>;

  return (
    <pre className="text-[10px] whitespace-pre-wrap">
      {JSON.stringify(users.map(u => ({ 
        name: u.name, 
        token: u.tokenIdentifier?.slice(-15), // Show last 15 chars
        id: u._id 
      })), null, 2)}
    </pre>
  );
}

export function ManualSyncButton() {
  const storeUser = useMutation(api.users.store);
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const id = await storeUser();
      toast.success("Manually synced user: " + id);
    } catch (e) {
      console.error(e);
      toast.error("Sync Failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="destructive" 
      size="sm" 
      onClick={handleSync}
      disabled={loading}
    >
      {loading ? "Syncing..." : "Force Sync User"}
    </Button>
  );
}

import { useAuth } from "@clerk/nextjs";

export function InspectTokenButton() {
  const { getToken } = useAuth();
  
  const handleInspect = async () => {
    try {
      console.log("--- DEBUGGING TOKENS ---");
      
      // 1. Try 'convex' template
      let token = await getToken({ template: "convex" });
      if (token) {
        toast.success("✅ Template 'convex' found!");
        console.log("Template 'convex' Token:", token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Payload:", payload);
        alert("Success! Template 'convex' works.\nIssuer: " + payload.iss + "\nAudience: " + payload.aud);
        return;
      }
      console.warn("Template 'convex' returned null.");

      // 2. Try 'Convex' template (case sensitivity)
      token = await getToken({ template: "Convex" });
      if (token) {
        toast.warning("⚠️ Found template 'Convex' (Capitalized)!");
        alert("Found 'Convex' but configured for 'convex'.\nPlease rename it to lowercase 'convex' in Clerk Dashboard.");
        return;
      }

      // 3. Try Default Token
      token = await getToken();
      if (token) {
        toast.info("ℹ️ Default Token found (no template).");
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Default Token Payload:", payload);
         alert("Missing 'convex' template.\n\nFound Default Token:\nIssuer: " + payload.iss + "\n\nPLEASE CREATE A JWT TEMPLATE NAMED 'convex' IN CLERK DASHBOARD.");
        return;
      }

      toast.error("❌ No tokens found at all. Are you signed in?");

    } catch (e) {
      console.error(e);
      toast.error("Error fetching token: " + e.message);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm" 
      onClick={handleInspect}
      className="ml-2"
    >
      Inspect Clerk Token
    </Button>
  );
}
