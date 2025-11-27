import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const Chatbot = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { text, sender: 'user'|'bot', timestamp, jobs? }
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Web Speech API (voice input)
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Voice recognition is not supported in your browser');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }
    recognition.lang =
      language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
    setIsListening(true);
    recognition.start();
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    const userMessage = {
      text: trimmed,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        message: trimmed,
        language,
        userId: user?._id || null,
        // send minimal context to keep request small
        context: messages.slice(-5).map((m) => ({
          text: m.text,
          sender: m.sender,
        })),
      };

      const { data } = await axios.post(`${API_URL}/api/chat`, payload);

      const botMessage = {
        text: data.message || '',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        jobs: Array.isArray(data.jobs) ? data.jobs : null, // jobs: [{title, company, location, postedAt, externalUrl?}]
      };
      setMessages((prev) => [...prev, botMessage]);

      // TTS for the primary bot message only
      if (botMessage.text) {
        speak(botMessage.text);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          text:
            'Sorry, I encountered a problem while fetching results. Please try again.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <>
      {/* Floating chat toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all z-50 animate-bounce"
          aria-label="Open chat"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 max-w-[calc(100vw-3rem)] md:w-96">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <h3 className="font-semibold">Job Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-blue-600 text-white text-sm rounded px-2 py-1 border-none outline-none"
                aria-label="Select language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-600 p-1 rounded"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">
                  Hi{user?.name ? `, ${user.name}` : ''}! How can I help you
                  find a job today?
                </p>
                <p className="text-sm mt-2">
                  Try asking: "Find jobs" or "Explore the jobs"
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                  {/* Job Cards (from PGRKAM or internal) */}
                  {msg.jobs && msg.jobs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.jobs.map((job, jIdx) => (
                        <div
                          key={`${index}-${jIdx}`}
                          className="bg-blue-50 p-3 rounded text-xs border border-blue-200"
                        >
                          <p className="font-semibold text-gray-800">
                            {job.title}
                          </p>
                          {job.company && (
                            <p className="text-gray-600">{job.company}</p>
                          )}
                          {(job.location || job.postedAt) && (
                            <p className="text-gray-500">
                              {job.location ? job.location : ''}{' '}
                              {job.postedAt ? `• ${job.postedAt}` : ''}
                            </p>
                          )}

                          {/* Prefer externalUrl (PGRKAM). Fallback to internal route if provided */}
                          {job.externalUrl ? (
                            <a
                              href={job.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium mt-1 inline-block"
                            >
                              View on PGRKAM →
                            </a>
                          ) : job._id ? (
                            <a
                              href={`/jobs/${job._id}`}
                              className="text-primary hover:underline font-medium mt-1 inline-block"
                            >
                              View Details →
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] opacity-70 mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.12s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.24s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              {recognition && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-lg transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                >
                  <MicrophoneIcon className="h-6 w-6" />
                </button>
              )}
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                disabled={isLoading || !inputMessage.trim()}
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="h-6 w-6 rotate-90 md:rotate-0" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;