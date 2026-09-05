import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, CheckCheck, Send, Bell, Phone, ArrowLeft, MoreVertical, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhatsAppNotification } from '../types';

export const MockWhatsAppModal: React.FC = () => {
  const { isWhatsAppModalOpen, setIsWhatsAppModalOpen, activeWhatsAppNotification } = useApp();
  const [logs, setLogs] = useState<WhatsAppNotification[]>([]);
  const [activeChat, setActiveChat] = useState<WhatsAppNotification | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/whatsapp-logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        if (!activeChat && data.data.length > 0) {
          setActiveChat(activeWhatsAppNotification || data.data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to fetch WhatsApp logs:', e);
    }
  };

  useEffect(() => {
    if (isWhatsAppModalOpen) {
      fetchLogs();
    }
  }, [isWhatsAppModalOpen]);

  useEffect(() => {
    if (activeWhatsAppNotification) {
      setActiveChat(activeWhatsAppNotification);
    }
  }, [activeWhatsAppNotification]);

  if (!isWhatsAppModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#121B22] text-[#E9EDEF] rounded-3xl max-w-lg w-full h-[640px] max-h-[90vh] overflow-hidden shadow-2xl border border-[#2A3942] flex flex-col relative font-sans"
        >
          {/* WhatsApp Header */}
          <div className="bg-[#202C33] p-3.5 flex items-center justify-between border-b border-[#2A3942]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                🌶️
              </div>
              <div>
                <div className="font-bold text-sm text-[#E9EDEF] flex items-center gap-1.5">
                  <span>अस्सल गावरान चटणी Official</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#00A884] text-[9px] text-white flex items-center justify-center">
                    ✓
                  </span>
                </div>
                <div className="text-[11px] text-[#8696A0]">
                  Verified Business Account • Online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#8696A0]">
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp Message Log Selector tabs if multiple */}
          {logs.length > 1 && (
            <div className="bg-[#182229] px-3 py-1.5 flex gap-2 overflow-x-auto border-b border-[#2A3942] text-[11px]">
              {logs.map(log => (
                <button
                  key={log.id}
                  onClick={() => setActiveChat(log)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    activeChat?.id === log.id 
                      ? 'bg-[#00A884] text-white font-bold' 
                      : 'bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF]'
                  }`}
                >
                  #{log.orderId} ({log.type.replace('_', ' ')})
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp Chat Conversation Canvas */}
          <div className="flex-1 bg-[#0B141A] p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#202C33_1px,transparent_1px)] bg-[size:16px_16px]">
            {/* System Date Badge */}
            <div className="text-center my-2">
              <span className="text-[10px] bg-[#182229] text-[#8696A0] px-2.5 py-1 rounded-md shadow-xs">
                TODAY • 256-BIT END-TO-END ENCRYPTED
              </span>
            </div>

            {/* Bubble 1: Business Greeting */}
            <div className="flex justify-start">
              <div className="bg-[#202C33] max-w-[85%] rounded-2xl rounded-tl-none p-3 shadow-md border border-[#2A3942]/50 text-xs text-[#E9EDEF]">
                <p className="font-semibold text-[#00A884] text-[11px] mb-1">
                  🚩 अस्सल गावरान चटणी & मसाले
                </p>
                <p className="leading-relaxed">
                  नमस्कार! अस्सल गावरान चवीच्या जगात आपले स्वागत आहे. तुमची ऑर्डर अपडेट खालीलप्रमाणे आहे:
                </p>
                <span className="text-[9px] text-[#8696A0] float-right mt-1">10:00 AM</span>
              </div>
            </div>

            {/* Bubble 2: Active Dynamic WhatsApp Message */}
            {activeChat && (
              <div className="flex justify-start">
                <div className="bg-[#202C33] max-w-[90%] rounded-2xl rounded-tl-none p-3.5 shadow-md border border-[#2A3942]/50 text-xs text-[#E9EDEF] space-y-2">
                  <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                    {activeChat.messageText}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[#8696A0] border-t border-[#2A3942] pt-1.5">
                    <span>To: {activeChat.recipientPhone}</span>
                    <span className="flex items-center gap-1 text-[#53BDEB]">
                      <span>{new Date(activeChat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Footer Input Bar (Mock Interactive) */}
          <div className="bg-[#202C33] p-2.5 flex items-center gap-2 border-t border-[#2A3942]">
            <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 text-xs text-gray-400">
              Type a reply or track status...
            </div>
            <div className="w-9 h-9 rounded-full bg-[#00A884] flex items-center justify-center text-white shadow-xs">
              <Send className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
