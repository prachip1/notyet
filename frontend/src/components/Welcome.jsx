import React, { useState, useEffect } from 'react';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useAutoConversation } from './hooks/useAutoConversation';

export default function Welcome() {
    const [user, setUser] = useState(null);
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [messages, setMessages] = useState([]);
    const { startListening, stopListening, transcript } = useVoiceAssistant();
    const { speak, speaking, cancelSpeech } = useSpeechSynthesis();
    const { nextPrompt, handleSilence } = useAutoConversation();

    useEffect(() => {
        const savedUser = localStorage.getItem('anxietyCompanionUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsFirstVisit(false);
          startConversation();
        }
      }, []);

      const startConversation = async () => {
        if (!user) return;
        
        const greeting = `Hey ${user.name}, how are you doing today?`;
        addMessage(greeting, 'ai');
        speak(greeting);
        
        setTimeout(() => {
          if (!transcript) {
            handleNoResponse();
          }
        }, 8000);
      };
      const handleNoResponse = async () => {
        const prompts = [
          `Hey ${user.name}, I understand sometimes it's hard to talk. Let's try something together.`,
          "Let's do the 3-3-3 exercise. Can you look around and tell me three things you can see?",
          "It's okay if you don't want to speak. I'll stay here with you.",
          "You're safe here. Let's ground ourselves. What colors do you notice around you?"
        ];
        
        for (let i = 0; i < prompts.length; i++) {
          if (document.hidden) break;
          
          addMessage(prompts[i], 'ai');
          await speak(prompts[i]);
          await new Promise(resolve => setTimeout(resolve, 10000));
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
    
      useEffect(() => {
        const handleVisibilityChange = () => {
          if (document.hidden) {
            cancelSpeech();
          } else if (user) {
            startConversation();
          }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
      }, [user]);
    
      const handleFirstTimeSignup = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const newUser = { name, dateJoined: new Date().toISOString() };
        localStorage.setItem('anxietyCompanionUser', JSON.stringify(newUser));
        setUser(newUser);
        setIsFirstVisit(false);
        startConversation();
      };
    
      if (isFirstVisit) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <form onSubmit={handleFirstTimeSignup} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
                  <p className="text-gray-600 mt-2">Let's get to know each other</p>
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="What's your name?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Start
                </button>
              </form>
            </div>
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-gray-50 p-4">
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
        </div>
      );
}
