import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([
    {
      text: "¡Hola! Soy el asistente virtual del Programa de Economía Popular. ¿En qué puedo ayudarte hoy?",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Agregar mensaje del usuario
    setMessages([...messages, { text: inputValue, sender: 'user' }]);
    
    // Simular respuesta del bot (en una implementación real, aquí iría la lógica de procesamiento)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Gracias por tu mensaje. Nuestro equipo está trabajando para implementar respuestas inteligentes. Por favor, contáctanos por teléfono para obtener ayuda inmediata.", 
        sender: 'bot' 
      }]);
    }, 1000);
    
    setInputValue('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón para abrir/cerrar el chat */}
      <motion.button
        className="bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>
      
      {/* Ventana de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Encabezado del chat */}
            <div className="bg-primary-600 dark:bg-primary-800 text-white p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">Asistente Virtual</h3>
                  <p className="text-xs text-primary-100">Programa de Economía Popular</p>
                </div>
              </div>
            </div>
            
            {/* Mensajes */}
            <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${message.sender === 'user' ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Formulario de entrada */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-600 p-3 flex">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
