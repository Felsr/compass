"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Sparkles, TrendingUp, BookOpen, MapPin, Lightbulb } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIGuidanceAgentProps {
  userRole: "student" | "parent" | "government"
  currentSection?: string
}

export function AIGuidanceAgent({ userRole, currentSection }: AIGuidanceAgentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("[v0] AI Guidance Agent mounted with role:", userRole)
    console.log("[v0] Current section:", currentSection)
  }, [userRole, currentSection])

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`ai-chat-${userRole}`)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        )
      } catch (error) {
        console.error("Failed to load chat history:", error)
      }
    } else {
      // Initialize with welcome message
      const welcomeMessage = getWelcomeMessage()
      setMessages([welcomeMessage])
    }
  }, [userRole])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`ai-chat-${userRole}`, JSON.stringify(messages))
    }
  }, [messages, userRole])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getWelcomeMessage = (): Message => {
    const roleSpecificContent = {
      student:
        "Hi! I'm your AI Career Advisor. I can help you explore career paths, understand course options, calculate education ROI, and guide you through your academic journey. What would you like to know?",
      parent:
        "Hello! I'm here to help you guide your child's educational journey. I can explain ROI calculations, compare degree options, discuss career prospects, and help you make informed investment decisions. How can I assist you today?",
      government:
        "Greetings! I can help you understand educational trends, analyze enrollment data, and provide insights into career market dynamics. What information are you looking for?",
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content: roleSpecificContent[userRole],
      timestamp: new Date(),
      suggestions: getInitialSuggestions(),
    }
  }

  const getInitialSuggestions = (): string[] => {
    const suggestions = {
      student: [
        "What career is right for me?",
        "How do I calculate education ROI?",
        "Which courses have the best job prospects?",
        "Help me explore the dashboard features",
      ],
      parent: [
        "How do I evaluate my child's career options?",
        "What does ROI mean in education?",
        "Which degrees offer the best returns?",
        "How can I support my child's career planning?",
      ],
      government: [
        "Show me enrollment trends",
        "What are the skill gaps in the market?",
        "How can we improve career guidance?",
        "Explain the dashboard analytics",
      ],
    }
    return suggestions[userRole]
  }

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI thinking time
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))
    setIsTyping(false)

    // Context-aware responses based on user role and current section
    const response = getContextualResponse(userMessage.toLowerCase())

    return {
      id: Date.now().toString(),
      type: "ai",
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
    }
  }

  const getContextualResponse = (message: string) => {
    // ROI-related queries
    if (message.includes("roi") || message.includes("return") || message.includes("investment")) {
      return {
        content:
          userRole === "parent"
            ? "ROI (Return on Investment) in education measures how much financial return you can expect from your child's educational investment. It's calculated as: (Expected Career Earnings - Total Education Cost) ÷ Total Education Cost × 100. For example, if a degree costs ₹10 lakhs and leads to ₹15 lakhs higher lifetime earnings, the ROI is 50%. Use our ROI Calculator to get personalized calculations!"
            : "ROI helps you understand the financial value of your education. It compares what you'll earn in your career versus what you spend on education. Higher ROI means better financial returns. Check the ROI Calculator tab to see projections for different career paths!",
        suggestions: ["Show me the ROI calculator", "Compare different degree ROIs", "What factors affect ROI?"],
      }
    }

    // Career exploration queries
    if (message.includes("career") || message.includes("job") || message.includes("profession")) {
      return {
        content:
          userRole === "student"
            ? "Great question! Career choice depends on your interests, skills, and market demand. I recommend: 1) Take our Career Discovery Quiz, 2) Explore high-demand fields like AI/ML, Data Science, Healthcare, and Renewable Energy, 3) Consider salary prospects and growth potential. What subjects do you enjoy most?"
            : "When helping your child choose a career, consider their natural interests, academic strengths, and future market trends. Growing fields include Technology (AI, Cybersecurity), Healthcare, Green Energy, and Digital Marketing. The key is balancing passion with practical prospects.",
        suggestions: ["Take the career quiz", "Show me trending careers", "What skills are in demand?"],
      }
    }

    // Dashboard navigation help
    if (message.includes("dashboard") || message.includes("feature") || message.includes("navigate")) {
      const dashboardGuide = {
        student:
          "Your dashboard has 4 main sections: 1) Overview - see your progress and quick stats, 2) ROI Calculator - calculate education returns, 3) Recommendations - AI-suggested careers and courses, 4) Career Path - visualize your journey. Click any tab to explore!",
        parent:
          "Your dashboard includes: Home (overview), Degree Comparison (compare options), Success Stories (real examples), Career Explorer (market insights), ROI Insights (financial analysis), and Resources (helpful guides). Use the sidebar to navigate between sections.",
        government:
          "Your dashboard provides enrollment analytics, student interest trends, supply-demand analysis, and policy insights. Use the charts and filters to drill down into specific data points.",
      }

      return {
        content: dashboardGuide[userRole],
        suggestions: ["Show me the ROI calculator", "Explain the recommendations", "How do I use the career path?"],
      }
    }

    // Course/education queries
    if (message.includes("course") || message.includes("degree") || message.includes("college")) {
      return {
        content:
          userRole === "parent"
            ? "When choosing courses, consider: 1) Market demand and job availability, 2) Your child's interests and aptitudes, 3) ROI and earning potential, 4) College reputation and placement records. Engineering, Medicine, Business, and emerging fields like Data Science offer good prospects. Would you like specific course recommendations?"
            : "Course selection should align with your career goals. High-demand courses include Computer Science, Data Science, AI/ML, Healthcare, Business Analytics, and Digital Marketing. Consider factors like your interests, job market, salary potential, and course duration. What field interests you most?",
        suggestions: ["Compare engineering vs medical", "Show me course ROI data", "What are emerging fields?"],
      }
    }

    // Salary/earning queries
    if (message.includes("salary") || message.includes("earning") || message.includes("income")) {
      return {
        content:
          "Salary expectations vary by field and experience. Here are average starting salaries in India: Software Engineer (₹6-12 LPA), Data Scientist (₹8-15 LPA), Doctor (₹6-10 LPA), MBA Graduate (₹8-20 LPA), Civil Engineer (₹4-8 LPA). Remember, these grow significantly with experience. Location, company size, and skills also impact earnings.",
        suggestions: ["Show salary trends by field", "Calculate my earning potential", "What skills increase salary?"],
      }
    }

    // Default helpful response
    const defaultResponses = {
      student:
        "I'm here to help with your career planning! I can assist with career exploration, course selection, ROI calculations, skill development advice, and navigating your dashboard. What specific area would you like to explore?",
      parent:
        "I'm here to support your child's educational journey! I can help you understand career options, calculate education ROI, compare degrees, and make informed investment decisions. What would you like to know more about?",
      government:
        "I can help you analyze educational data, understand market trends, and develop policy insights. What specific information or analysis would you like to explore?",
    }

    return {
      content: defaultResponses[userRole],
      suggestions: getInitialSuggestions(),
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Generate AI response
    const aiResponse = await generateAIResponse(userMessage.content)
    setMessages((prev) => [...prev, aiResponse])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case "student":
        return <BookOpen className="w-4 h-4" />
      case "parent":
        return <TrendingUp className="w-4 h-4" />
      case "government":
        return <MapPin className="w-4 h-4" />
    }
  }

  const getRoleColor = () => {
    switch (userRole) {
      case "student":
        return "from-blue-500 to-purple-600"
      case "parent":
        return "from-green-500 to-blue-600"
      case "government":
        return "from-orange-500 to-red-600"
      default:
        return "from-blue-600 to-indigo-700"
    }
  }

  const getRoleAccentColor = () => {
    switch (userRole) {
      case "student":
        return "bg-blue-500"
      case "parent":
        return "bg-green-500"
      case "government":
        return "bg-orange-500"
      default:
        return "bg-blue-600"
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9999]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        style={{ zIndex: 9999 }}
      >
        <Button
          onClick={() => {
            console.log("[v0] AI chat button clicked, isOpen:", !isOpen)
            setIsOpen(!isOpen)
          }}
          size="lg"
          className={`rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r ${getRoleColor()} hover:scale-110 relative border-2 border-white/20`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="w-6 h-6 text-white" />
                <motion.div
                  className={`absolute -top-1 -right-1 w-4 h-4 ${getRoleAccentColor()} rounded-full border-2 border-white`}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-[9998] w-80 sm:w-96 max-h-[600px]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ zIndex: 9998 }}
          >
            <Card className="shadow-2xl border-2 border-border/30 backdrop-blur-lg bg-card/98 overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${getRoleColor()} text-white`}>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  AI Career Advisor
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-white/25 text-white border-white/40 backdrop-blur-sm"
                  >
                    {userRole || "Guest"}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-white/90 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Intelligent career guidance at your fingertips
                </p>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages Area */}
                <ScrollArea className="h-80 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "ai" && (
                          <div
                            className={`w-8 h-8 bg-gradient-to-br ${getRoleColor()} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}
                          >
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>

                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-7 bg-transparent hover:bg-muted"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>

                        {message.type === "user" && (
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        <div
                          className={`w-8 h-8 bg-gradient-to-br ${getRoleColor()} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex gap-1">
                            <motion.div
                              className={`w-2 h-2 ${getRoleAccentColor()} rounded-full`}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                            />
                            <motion.div
                              className={`w-2 h-2 ${getRoleAccentColor()} rounded-full`}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                            />
                            <motion.div
                              className={`w-2 h-2 ${getRoleAccentColor()} rounded-full`}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about careers, courses, or ROI..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      className={`bg-gradient-to-r ${getRoleColor()} hover:opacity-90 transition-opacity shadow-lg`}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {getRoleIcon()}
                    <span>
                      Powered by AI •{" "}
                      {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Mode` : "Guest Mode"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
