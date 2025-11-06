"use client";

import { useState } from "react";
import { uploadFile } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function PDFUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const result = await uploadFile(formData);
      if (result.success) {
        setMessage({ type: "success", text: result.message || "File uploaded successfully." });
        event.target.value = ""; // Clear the input
      } else {
        setMessage({ type: "error", text: result.error || "Failed to upload file." });
        event.target.value = ""; // Clear the input
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to upload file." });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">PDF Upload</h1>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label htmlFor="pdf-upload" className="text-lg font-medium">
                Upload a PDF file
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="mt-2"
              />
            </div>
            <div className="text-sm">File size less then 20 MB</div>
            {isLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-muted-foreground">Uploading and processing...</span>
              </div>
            )}
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className="mt-4"
              >
                <AlertTitle>{message.type === "error" ? "Error" : "Success"}</AlertTitle>
                <AlertDescription
                  className={message.type === "success" ? "text-green-600" : "text-red-600"}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
