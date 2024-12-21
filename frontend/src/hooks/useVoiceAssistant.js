// src/hooks/useVoiceAssistant.js
import { useState, useEffect } from 'react';

export const useVoiceAssistant = () => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        setTranscript(transcript);
      };

      recognition.onend = () => {
        // Automatically restart recognition when it ends
        recognition.start();
      };

      setRecognition(recognition);
      recognition.start(); // Start listening immediately
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return { startListening, stopListening, transcript };
};

// src/hooks/useSpeechSynthesis.js
import { useState } from 'react';

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        setSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onend = () => {
          setSpeaking(false);
          resolve();
        };

        utterance.onerror = () => {
          setSpeaking(false);
          resolve();
        };

        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  return { speak, speaking, cancelSpeech };
};