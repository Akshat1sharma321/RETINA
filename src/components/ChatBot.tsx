
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      text: "Hello! I'm NAVI Assistant. How can I help you today?", 
      sender: "bot", 
      timestamp: new Date() 
    }
  ]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'm here to help you with your NAVI smart glasses!",
        "You can ask me about features, navigation, or how to use your device.",
        "If you need emergency assistance, please go to the Emergency page.",
        "Your NAVI glasses are designed to provide audio descriptions of your surroundings.",
        "The camera feature allows caregivers to see what you're seeing in real-time."
      ];
      
      const botMsg: Message = {
        id: Date.now().toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-96 rounded-xl overflow-hidden bg-black/90 border border-white/10 backdrop-blur-md shadow-xl animate-fade-in">
          <div className="flex items-center justify-between p-3 bg-navi-900/40 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h3 className="font-medium">NAVI Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={toggleChat}
            >
              <X size={16} />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100%-6rem)] p-3 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-navi-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={sendMessage} className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-gray-900/80">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700"
              />
              <Button type="submit" size="icon" variant="default" className="bg-navi-600 hover:bg-navi-700">
                <Send size={16} />
              </Button>
            </div>
          </form>
        </div>
      )}
      
      <Button
        onClick={toggleChat}
        size="icon"
        className="h-14 w-14 rounded-full bg-navi-600 hover:bg-navi-700 shadow-lg"
      >
        <MessageCircle size={24} />
      </Button>
    </div>
  );
};

export default ChatBot;
