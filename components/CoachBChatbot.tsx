'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface KnowledgeResponse {
  response: string;
  relatedTopics?: string[];
}

const CoachBChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! I'm Coach B, your Football Squares assistant! 🏈 I can help you with cryptocurrency, wallet setup, token transfers, how our Squares game works, and general fantasy football questions. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
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

  // Knowledge base for Coach B responses
  const getCoachBResponse = (userMessage: string): KnowledgeResponse => {
    const message = userMessage.toLowerCase();

    // Cryptocurrency related questions
    if (message.includes('crypto') || message.includes('cryptocurrency') || message.includes('bitcoin') || message.includes('solana') || message.includes('sol')) {
      return {
        response: "Great question about cryptocurrency! 🪙 Our platform runs on Solana, which offers fast transactions and low fees. Crypto allows for transparent, automated payouts and verifiable fairness in our games. Need help with wallet setup or buying SOL?",
        relatedTopics: ['wallet setup', 'buying SOL', 'transaction fees']
      };
    }

    // Wallet setup questions
    if (message.includes('wallet') || message.includes('phantom') || message.includes('setup') || message.includes('connect wallet')) {
      return {
        response: "Setting up a wallet is easy! 💳 I recommend Phantom Wallet for Solana. Here's what you need to do:\n\n1. Download Phantom from phantom.app\n2. Create a new wallet and save your seed phrase safely\n3. Add some SOL to your wallet\n4. Connect it to our site using the 'Connect Wallet' button\n\nNeed our detailed wallet guide? Check out the 'Need a Wallet?' link in the header!",
        relatedTopics: ['buying SOL', 'security tips', 'connecting wallet']
      };
    }

    // Token transfer questions
    if (message.includes('transfer') || message.includes('send') || message.includes('tokens') || message.includes('transaction')) {
      return {
        response: "Token transfers on Solana are super fast! ⚡ Here's what you need to know:\n\n• Transactions typically cost less than $0.01\n• They complete in seconds\n• Always double-check the recipient address\n• Keep some SOL for transaction fees\n\nWant to practice? Try sending a small amount first!",
        relatedTopics: ['transaction fees', 'wallet security', 'SOL requirements']
      };
    }

    // Squares game questions
    if (message.includes('squares') || message.includes('game') || message.includes('how to play') || message.includes('rules') || message.includes('payout')) {
      return {
        response: "Football Squares is awesome! 🏈 Here's how it works:\n\n• Buy squares on a 10x10 grid (100 total)\n• Each square gets random numbers 0-9 for each team\n• Winners are determined by the last digit of each team's score\n• Payouts happen after each quarter!\n\nWe use blockchain for verifiable randomness and automatic payouts. Check our 'How To Play' and 'Rules' pages for full details!",
        relatedTopics: ['game rules', 'payouts', 'randomness', 'buying squares']
      };
    }

    // Fantasy Football general questions
    if (message.includes('fantasy') || message.includes('draft') || message.includes('lineup') || message.includes('waiver') || message.includes('sleeper') || message.includes('espn')) {
      return {
        response: "I love fantasy football! 🏆 I can help with basic strategy and how it relates to our Squares game. For detailed analysis, current news, and expert advice, I'd recommend checking out:\n\n• ESPN Fantasy\n• Yahoo Fantasy\n• Sleeper app\n• FantasyPros\n\nOur Fantasy section has great integration tips for using fantasy insights in Squares strategy!",
        relatedTopics: ['fantasy platforms', 'draft strategy', 'squares strategy']
      };
    }

    // Site navigation questions
    if (message.includes('navigate') || message.includes('find') || message.includes('page') || message.includes('where')) {
      return {
        response: "I can help you find what you're looking for! 🧭 Here are our main sections:\n\n• How To Play - Learn the basics\n• Rules - Detailed game rules\n• Fantasy - Strategy guides\n• My NFTs - Your collectibles\n• FAQ - Common questions\n• Wallet Guide - Setup help\n\nWhat specific section interests you?",
        relatedTopics: ['game rules', 'wallet setup', 'fantasy strategy']
      };
    }

    // NFT questions
    if (message.includes('nft') || message.includes('collectible') || message.includes('digital')) {
      return {
        response: "NFTs are digital collectibles! 🎨 On our platform, you might earn special NFT rewards for achievements or participation. They're stored in your wallet and prove ownership on the blockchain. Check out our 'What are NFTs?' and 'My NFTs' sections to learn more!",
        relatedTopics: ['wallet storage', 'blockchain ownership', 'rewards']
      };
    }

    // Help/support questions
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue')) {
      return {
        response: "I'm here to help! 🤝 For technical issues, check our Technical Support page. For questions about crypto or our game, keep asking me! For detailed fantasy football analysis and current news, I'd point you to dedicated fantasy sites like ESPN or Yahoo Fantasy.",
        relatedTopics: ['technical support', 'contact', 'FAQ']
      };
    }

    // Default response
    return {
      response: "That's a great question! 🤔 I specialize in helping with:\n\n• Cryptocurrency and Solana\n• Wallet setup and connections\n• How our Football Squares game works\n• Basic fantasy football strategy\n\nFor detailed fantasy analysis and current NFL news, I'd recommend visiting ESPN Fantasy, Yahoo Fantasy, or other dedicated fantasy sites. What specific topic can I help you with?",
      relatedTopics: ['crypto basics', 'wallet help', 'game rules', 'fantasy basics']
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getCoachBResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
            size="lg"
          >
            <div className="flex items-center gap-3">
              {!imageError ? (
                <Image
                  src="/Assets/Coach B with football and thumbs up.png"
                  alt="Coach B"
                  width={60}
                  height={60}
                  className="rounded-full group-hover:scale-110 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                  B
                </div>
              )}
              <div className="text-left">
                <div className="font-semibold">Coach B</div>
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
                    src="/Assets/Coach B with football and thumbs up.png"
                    alt="Coach B Preview"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-2"
                    onError={() => setImageError(true)}
                  />
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Coach B</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Football Squares Assistant</div>
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
      <Card className={`w-96 bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!imageError ? (
                <Image
                  src="/Assets/Coach B with football and thumbs up.png"
                  alt="Coach B"
                  width={48}
                  height={48}
                  className="rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
              )}
              <div>
                <CardTitle className="text-lg">Coach B</CardTitle>
                <div className="text-xs opacity-90">Football Squares Assistant</div>
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
                      <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                      <div className={`text-xs mt-1 opacity-70 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  placeholder="Ask Coach B anything..."
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

export default CoachBChatbot;