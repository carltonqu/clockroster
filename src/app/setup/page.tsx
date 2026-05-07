"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SetupPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createAdmin = async () => {
    setLoading(true);
    setStatus("Creating admin user...");
    
    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`✅ ${data.message}\nEmail: ${data.email}\nPassword: ${data.password}`);
      } else {
        setStatus(`❌ Error: ${data.error || data.message}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ClockRoster Setup</CardTitle>
          <CardDescription>
            Create your admin user to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={createAdmin} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Admin User"}
          </Button>
          
          {status && (
            <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap text-sm">
              {status}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}