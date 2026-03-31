import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Loader2 } from 'lucide-react';
import { chatApi } from '../../api/chatApi';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn hôm nay?',
      sender: 'bot',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(userMessage.text);

      // Determine the bot's response text based on potential API response structures
      let botText = 'Xin lỗi, tôi không thể xử lý yêu cầu lúc này.';
      if (typeof response === 'string') botText = response;
      else if (response?.message) botText = response.message;
      else if (response?.response) botText = response.response;
      else if (response?.data) botText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);

      const botMessage = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Đã có lỗi xảy ra khi kết nối. Vui lòng thử lại sau.',
        sender: 'bot',
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white border border-neutral-200 transition-all transform origin-bottom-right">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <span className="font-semibold text-body-md">AI Assistant</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-primary-200 transition-colors"
              aria-label="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] bg-neutral-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-600'
                      }`}
                  >
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`py-2 px-3 rounded-2xl ${msg.sender === 'user'
                        ? 'bg-primary-500 text-white rounded-tr-none'
                        : msg.isError
                          ? 'bg-red-100 text-red-600 rounded-tl-none'
                          : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none'
                      }`}
                  >
                    <p className="text-body-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%] flex-row">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200 text-neutral-600">
                    <Bot size={16} />
                  </div>
                  <div className="py-2 px-4 rounded-2xl bg-white border border-neutral-200 text-neutral-800 rounded-tl-none flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-neutral-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-neutral-100 border-none rounded-full py-2 px-4 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                title="Gửi"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-primary-600 text-white p-5 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center animate-[bounce_2s_infinite]"
          aria-label="Open Chat"
        >
          <Bot size={40} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
