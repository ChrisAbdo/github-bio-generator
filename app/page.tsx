"use client";

import type { NextPage } from "next";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 2 ${vibe} github biographies with no hashtags and clearly labeled "1." and "2.". ${
    vibe === "Funny"
      ? "Make sure there is a joke in there and it's a little ridiculous."
      : null
  }
      Make sure each generated biography is less than 200 characters, has short sentences that are found in Github bios, and base them on this context: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  const clearForm = () => {
    setBio("");
    setVibe("");
    setSelectValue("");
  };

  return (
    <div>
      <div className="bg-white">
        <Navbar />

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Create a new Github bio in seconds!</CardTitle>
                <CardDescription>All it takes is a few clicks.</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Current Bio</Label>

                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        placeholder={
                          "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
                        }
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Vibe Type</Label>
                      <Select
                        value={selectValue}
                        onValueChange={(e) => {
                          setSelectValue(e);
                          setVibe(e);
                          console.log(e);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                          <SelectContent position="popper">
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="funny">Funny</SelectItem>
                          </SelectContent>
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={clearForm}>
                  Clear
                </Button>
                {!loading && (
                  <Button
                    onClick={(e) => generateBio(e)}
                    disabled={bio.length === 0 || vibe.length === 0}
                  >
                    Generate Bio
                  </Button>
                )}

                {loading && (
                  <Button>
                    <Loader2 size={24} className="animate-spin" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="flex max-w-5xl mx-auto flex-col items-center py-2">
            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4">
              <div>
                {generatedBios && (
                  <>
                    <div>
                      <h2
                        className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto mb-2"
                        ref={bioRef}
                      >
                        Your generated bios
                      </h2>
                    </div>
                    <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                      {generatedBios
                        .substring(generatedBios.indexOf("1") + 3)
                        .split("2.")
                        .map((generatedBio) => {
                          return (
                            <div
                              className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedBio);
                              }}
                              key={generatedBio}
                            >
                              <p>{generatedBio}</p>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
