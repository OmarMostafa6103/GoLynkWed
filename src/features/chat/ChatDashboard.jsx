import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const ChatDashboard = ({ token }) => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const messagesEndRef = useRef(null);

  const mockConversations = [
    {
      id: 1,
      orderId: "ORD-001",
      sender: {
        name: "أحمد محمد",
        phone: "+201234567890",
        avatar: "https://via.placeholder.com/40",
      },
      traveler: {
        name: "محمد علي",
        phone: "+201234567891",
        avatar: "https://via.placeholder.com/40",
      },
      status: "completed",
      startDate: "2024-01-15 10:30",
      endDate: "2024-01-15 14:45",
      totalMessages: 24,
      lastMessage: "تم تسليم الطلب بنجاح",
      lastMessageTime: "14:45",
      pickupLocation: "القاهرة - المعادي",
      deliveryLocation: "الإسكندرية - سموحة",
      packageDetails: "هدية - 2 كجم",
      price: "150 جنيه",
    },
    {
      id: 2,
      orderId: "ORD-002",
      sender: {
        name: "فاطمة حسن",
        phone: "+201234567892",
        avatar: "https://via.placeholder.com/40",
      },
      traveler: {
        name: "علي أحمد",
        phone: "+201234567893",
        avatar: "https://via.placeholder.com/40",
      },
      status: "active",
      startDate: "2024-01-16 09:15",
      endDate: null,
      totalMessages: 18,
      lastMessage: "في الطريق للاستلام",
      lastMessageTime: "11:30",
      pickupLocation: "الجيزة - الدقي",
      deliveryLocation: "المنوفية - شبين الكوم",
      packageDetails: "أوراق مهمة - 500 جرام",
      price: "80 جنيه",
    },
    {
      id: 3,
      orderId: "ORD-003",
      sender: {
        name: "خالد محمود",
        phone: "+201234567894",
        avatar: "https://via.placeholder.com/40",
      },
      traveler: {
        name: "سارة أحمد",
        phone: "+201234567895",
        avatar: "https://via.placeholder.com/40",
      },
      status: "cancelled",
      startDate: "2024-01-14 16:20",
      endDate: "2024-01-14 17:30",
      totalMessages: 12,
      lastMessage: "تم إلغاء الطلب من قبل المرسل",
      lastMessageTime: "17:30",
      pickupLocation: "الإسكندرية - المنتزه",
      deliveryLocation: "الإسكندرية - سيدي جابر",
      packageDetails: "ملابس - 1.5 كجم",
      price: "60 جنيه",
    },
  ];

  const mockMessages = {
    1: [
      {
        id: 1,
        sender: "sender",
        message: "مرحباً، هل يمكنك استلام طرد من المعادي؟",
        timestamp: "10:30",
        date: "2024-01-15",
        type: "text",
      },
      {
        id: 2,
        sender: "traveler",
        message: "نعم بالطبع، متى تريد الاستلام؟",
        timestamp: "10:32",
        date: "2024-01-15",
        type: "text",
      },
    ],
    2: [
      {
        id: 1,
        sender: "sender",
        message: "مرحباً، هل يمكنك توصيل أوراق مهمة؟",
        timestamp: "09:15",
        date: "2024-01-16",
        type: "text",
      },
      {
        id: 2,
        sender: "traveler",
        message: "نعم، من أين وإلى أين؟",
        timestamp: "09:17",
        date: "2024-01-16",
        type: "text",
      },
    ],
  };

  useEffect(() => {
    setConversations(mockConversations);
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.sender.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.traveler.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || conversation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50 chat-container">
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col chat-sidebar">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            المحادثات المحفوظة
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            مراقبة وحفظ محادثات الطلبات
          </p>
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="البحث برقم الطلب أو الاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationSelect(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer conversation-item ${
                selectedConversation?.id === conversation.id
                  ? "bg-orange-50 border-r-4 border-orange-500"
                  : ""
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    طلب: {conversation.orderId}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : conversation.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {conversation.status === "completed"
                      ? "مكتمل"
                      : conversation.status === "active"
                      ? "نشط"
                      : "ملغي"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span>المرسل: {conversation.sender.name}</span>
                  <span>•</span>
                  <span>المسافر: {conversation.traveler.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  <div>من: {conversation.pickupLocation}</div>
                  <div>إلى: {conversation.deliveryLocation}</div>
                  <div>السعر: {conversation.price}</div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 truncate flex-1">
                    {conversation.lastMessage}
                  </p>
                  <div className="text-xs text-gray-500 ml-2">
                    {conversation.lastMessageTime}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>عدد الرسائل: {conversation.totalMessages}</span>
                  <span>التاريخ: {conversation.startDate.split(" ")[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    طلب: {selectedConversation.orderId}
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex message-bubble ${
                    message.sender === "sender"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "sender"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {message.sender === "sender" ? "المرسل" : "المسافر"}
                      </span>
                      <span className="text-xs opacity-75">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className="message-timestamp text-xs opacity-75 mt-1">
                      {message.date}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-comments text-4xl text-orange-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                نظام حفظ المحادثات
              </h3>
              <p className="text-gray-600">
                اختر محادثة من القائمة لعرض النسخة المحفوظة
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
