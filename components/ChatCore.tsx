'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface KnowledgeResponse {
  response: string;
  relatedTopics?: string[];
}

export interface ChatbotConfig {
  name: string;
  title: string;
  description: string;
  avatarSrc: string;
  avatarAlt: string;
  fallbackInitial: string;
  initialMessage: string;
  gradientFrom: string;
  gradientTo: string;
  getResponse: (userMessage: string) => KnowledgeResponse;
}

interface ChatCoreProps {
  config: ChatbotConfig;
}

const ChatCore = ({ config }: ChatCoreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: config.initialMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        const response = config.getResponse(inputText);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    ); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group`}
            size="lg"
          >
            <div className="flex items-center gap-3">
              {!imageError ? (
                <Image
                  src={config.avatarSrc}
                  alt={config.avatarAlt}
                  width={60}
                  height={60}
                  className="rounded-full group-hover:scale-110 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} rounded-full flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {config.fallbackInitial}
                </div>
              )}
              <div className="text-left">
                <div className="font-semibold">{config.name}</div>
                <div className="text-xs opacity-90">Ask me anything!</div>
              </div>
            </div>
          </Button>

          {/* Hover Preview */}
          {isHovering && !imageError && (
            <div className="absolute bottom-full left-0 mb-4 transform transition-all duration-300 ease-in-out">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <Image
                    src={config.avatarSrc}
                    alt={`${config.name} Preview`}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-2"
                    onError={() => setImageError(true)}
                  />
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {config.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {config.description}
                  </div>
                </div>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card
        className={`w-96 bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}
      >
        <CardHeader
          className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white p-3 rounded-t-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!imageError ? (
                <Image
                  src={config.avatarSrc}
                  alt={config.avatarAlt}
                  width={48}
                  height={48}
                  className="rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} rounded-full flex items-center justify-center text-white font-bold text-xl`}
                >
                  {config.fallbackInitial}
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <div className="text-xs opacity-90">{config.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-72 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.text}
                      </div>
                      <div
                        className={`text-xs mt-1 opacity-70 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${config.name} anything...`}
                  className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ChatCore;
