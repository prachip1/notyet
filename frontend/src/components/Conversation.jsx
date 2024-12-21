// src/components/Conversation.jsx
import React, { useState, useEffect } from 'react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useAutoConversation } from '../hooks/useAutoConversation';

const Conversation = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const { transcript } = useVoiceAssistant();
  const { speak, speaking, cancelSpeech } = useSpeechSynthesis();
  const { nextPrompt, handleSilence } = useAutoConversation();

  useEffect(() => {
    // Start conversation when component mounts
    startConversation();

    // Cleanup on unmount
    return () => {
      cancelSpeech();
    };
  }, []);

  const startConversation = async () => {
    const greeting = `Hey ${user.name}, how are you doing today?`;
    addMessage(greeting, 'ai');
    await speak(greeting);
    
    // Wait for response or continue with prompts
    setTimeout(() => {
      if (!transcript) {
        handleNoResponse();
      }
    }, 8000);
  };

  const handleNoResponse = async () => {
    const prompts = [
      nextPrompt('grounding'),
      nextPrompt('breathing'),
      nextPrompt('silent')
    ];

    for (const prompt of prompts) {
      if (document.hidden) break;
      addMessage(prompt, 'ai');
      await speak(prompt);
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender, time: new Date().toISOString() }]);
  };

  useEffect(() => {
    if (transcript) {
      addMessage(transcript, 'user');
    }
  }, [transcript]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-4">
        <div className="h-[80vh] overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg max-w-[80%] ${
                message.sender === 'ai' 
                  ? 'bg-blue-50 ml-0' 
                  : 'bg-green-50 ml-auto'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        
        {speaking && (
          <div className="text-center text-blue-500 animate-pulse">
            Speaking...
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;