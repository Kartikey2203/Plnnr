"use client";
import { useAuth } from "@clerk/nextjs";

export default function DebugToken() {
  const { getToken } = useAuth();

  const inspectToken = async () => {
    const token = await getToken({ template: "convex" });
    console.log("CLERK TOKEN:", token);

    if (!token) {
      alert("❌ No token found (default token or missing template)");
    } else {
      alert("✅ Template 'convex' found. Check console.");
    }
  };

  return (
    <button
      onClick={inspectToken}
      className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
    >
      Inspect Clerk Token
    </button>
  );
}
