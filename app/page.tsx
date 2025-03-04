"use client"

import type React from "react"

import { useState } from "react"
import {
  Upload,
  FileText,
  MessageSquare,
  ArrowRight,
  Loader2,
  Info,
  BookOpen,
  Shield,
  Scale,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@ai-sdk/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function LegalPDFAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      fileId: file?.name || "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const analyzePDF = async () => {
    if (!file) return

    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append("pdf", file)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.text()
        setSummary(result)
        setActiveTab("summary")
      } else {
        console.error("Analysis failed")
      }
    } catch (error) {
      console.error("Error analyzing PDF:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return
    handleSubmit(e)
  }

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Document Summarization",
      description: "Get concise summaries of complex legal documents in seconds",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Interactive Chat",
      description: "Ask questions and get instant answers about your legal documents",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure Processing",
      description: "Your documents are processed securely and never stored permanently",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-slate-800">LegalPDF Analyzer</span>
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              Beta
            </Badge>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-slate-600 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#" className="text-slate-600 hover:text-primary transition-colors">
              Pricing
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                Understand Legal Documents <span className="text-primary">in Seconds</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Upload your legal documents, get instant summaries, and chat with AI to understand complex legal
                language.
              </p>
              <Alert className="max-w-3xl mx-auto bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  Powered by Llama-3 via Groq API for accurate legal document analysis and chat.
                </AlertDescription>
              </Alert>
            </div>

            {/* Main Application */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md mx-auto">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="summary" disabled={!summary}>
                  Summary
                </TabsTrigger>
                <TabsTrigger value="chat" disabled={!summary}>
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Upload className="h-5 w-5 text-primary" />
                      Upload Legal Document
                    </CardTitle>
                    <CardDescription className="text-base">
                      Upload your legal document in PDF format for AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center bg-slate-50 transition-all hover:bg-slate-100">
                      <input
                        type="file"
                        id="pdf-upload"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center cursor-pointer">
                        <FileText className="h-16 w-16 text-slate-400 mb-4" />
                        <span className="text-slate-600 mb-2 text-lg">
                          {file ? file.name : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-sm text-slate-500">PDF files only (max 10MB)</span>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      onClick={analyzePDF}
                      disabled={!file || isAnalyzing}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze Document
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="summary">
                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <FileText className="h-5 w-5 text-primary" />
                      Document Summary
                    </CardTitle>
                    <CardDescription className="text-base">AI-generated summary of your legal document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-6 rounded-lg border border-slate-200 min-h-[300px] text-slate-700 leading-relaxed">
                      {summary}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => setActiveTab("chat")} size="lg" className="bg-primary hover:bg-primary/90">
                      Chat with Document
                      <MessageSquare className="ml-2 h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Chat with Your Document
                    </CardTitle>
                    <CardDescription className="text-base">Ask questions about your legal document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 h-[400px] overflow-y-auto mb-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                        >
                          <div
                            className={`inline-block p-4 rounded-lg max-w-[80%] ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-white border border-slate-200 text-slate-800"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="text-left">
                          <div className="inline-block p-4 rounded-lg bg-white border border-slate-200 text-slate-800">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question about your document..."
                        className="flex-1 resize-none"
                        rows={2}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-primary hover:bg-primary/90 self-end"
                        size="lg"
                      >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Powerful Features</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our AI-powered tools help legal professionals save time and improve understanding
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="mb-2">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Three simple steps to understand your legal documents</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 h-full w-0.5 bg-primary/20 hidden md:block"></div>

                {[
                  {
                    step: "01",
                    title: "Upload Your Document",
                    description: "Upload any legal PDF document to our secure platform",
                  },
                  {
                    step: "02",
                    title: "Get AI Summary",
                    description: "Our AI analyzes the document and provides a comprehensive summary",
                  },
                  {
                    step: "03",
                    title: "Chat for Clarity",
                    description: "Ask specific questions about the document to get detailed answers",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-8 mb-12">
                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to simplify legal documents?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/90">
              Join thousands of legal professionals who save time and improve understanding with our AI tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl text-white">LegalPDF</span>
              </div>
              <p className="text-slate-400 mb-4">AI-powered legal document analysis for professionals.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-slate-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2025 LegalPDF Analyzer. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

