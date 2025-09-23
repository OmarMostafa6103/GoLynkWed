import { useState } from "react";
import {
  FaSearch,
  FaExclamationCircle,
  FaUser,
  FaCalendarAlt,
  FaHashtag,
  FaCommentDots,
  FaFilter,
  FaEye,
  FaCheck,
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import { toast } from "react-toastify";

const mockComplaints = [
  {
    id: 1034,
    date: "26 يونيو 2025 - الساعة 3:40 م",
    sender: "سارة محمود",
    receiver: "يوسف أحمد",
    senderType: "sender",
    receiverType: "traveler",
    complaintType: "delay",
    description:
      "المسافر تأخر عن الموعد المتفق عليه 4 ساعات، ولم يرد على مكالماتي خلال الرحلة.",
    adminReply: "",
    status: "pending",
    orderId: "ORD-001",
    evidence: "صور من التطبيق، رسائل نصية",
    category: "service_quality",
  },
  {
    id: 1035,
    date: "27 يونيو 2025 - الساعة 2:10 م",
    sender: "أحمد علي",
    receiver: "محمد حسن",
    senderType: "sender",
    receiverType: "traveler",
    complaintType: "damage",
    description:
      "استلمت الشحنة لكن التغليف كان مفتوح والمنتج مكسور، رغم أني كتبت بوضوح أنه قابل للكسر.",
    adminReply: "",
    status: "pending",
    orderId: "ORD-002",
    evidence: "صور المنتج المكسور",
    category: "damage_loss",
  },
];

const Complaints = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [search, setSearch] = useState("");
  const [adminReplies, setAdminReplies] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    senderType: "all",
    receiverType: "all",
    category: "all",
    dateRange: "all",
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    investigating: complaints.filter((c) => c.status === "investigating")
      .length,
  };

  const filteredComplaints = complaints
    .filter((complaint) => {
      const matchesSearch =
        complaint.id.toString().includes(search) ||
        complaint.sender.toLowerCase().includes(search.toLowerCase()) ||
        complaint.receiver.toLowerCase().includes(search.toLowerCase()) ||
        complaint.orderId.toLowerCase().includes(search.toLowerCase()) ||
        complaint.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || complaint.status === filters.status;
      const matchesType =
        filters.type === "all" || complaint.complaintType === filters.type;
      const matchesSenderType =
        filters.senderType === "all" ||
        complaint.senderType === filters.senderType;
      const matchesReceiverType =
        filters.receiverType === "all" ||
        complaint.receiverType === filters.receiverType;
      const matchesCategory =
        filters.category === "all" || complaint.category === filters.category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesSenderType &&
        matchesReceiverType &&
        matchesCategory
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const COMPLAINTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages =
    Math.ceil(filteredComplaints.length / COMPLAINTS_PER_PAGE) || 1;
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * COMPLAINTS_PER_PAGE,
    currentPage * COMPLAINTS_PER_PAGE
  );

  const handleReplyChange = (id, value) => {
    setAdminReplies((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = (id) => {
    const reply = adminReplies[id];
    if (!reply || reply.trim() === "") {
      toast.error("يرجى كتابة رد إداري");
      return;
    }
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, adminReply: reply } : c))
    );
    setAdminReplies((prev) => ({ ...prev, [id]: "" }));
    toast.success("تم إرسال الرد الإداري بنجاح");
  };

  const handleResolveComplaint = (id) => {
    const complaint = complaints.find((c) => c.id === id);
    if (complaint) {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "resolved",
                adminReply: adminReplies[id] || c.adminReply,
                resolvedDate: new Date().toLocaleDateString("ar-EG"),
              }
            : c
        )
      );
      setAdminReplies((prev) => ({ ...prev, [id]: "" }));
      toast.success("تم حل الشكوى بنجاح");
    }
  };

  const handleReopenComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "pending" } : c))
    );
    toast.success("تم إعادة فتح الشكوى");
  };

  const handleExportComplaints = () => {
    const data = filteredComplaints.map((c) => ({
      "رقم الشكوى": c.id,
      التاريخ: c.date,
      المرسل: c.sender,
      المستلم: c.receiver,
      "نوع الشكوى": c.complaintType,
      الحالة: c.status,
      "رقم الطلب": c.orderId,
    }));

    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `شكاوى_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("تم تصدير الشكاوى بنجاح");
  };

  const handlePrintComplaints = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>تقرير الشكاوى</title></head><body><h1>تقرير الشكاوى</h1></body></html>`;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getComplaintTypeText = (type) => {
    const types = {
      delay: "تأخير",
      damage: "تلف",
      communication: "مشاكل تواصل",
      payment: "مشاكل دفع",
      behavior: "سلوك غير لائق",
      safety: "مشاكل أمان",
      lost_package: "فقدان الشحنة",
      wrong_address: "عنوان خاطئ",
      theft: "سرقة",
      false_accusation: "اتهام كاذب",
    };
    return types[type] || type;
  };

  const getUserTypeText = (type) => {
    const types = { sender: "مرسل", traveler: "مسافر", customer: "عميل" };
    return types[type] || type;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaExclamationCircle className="text-2xl text-red-500" />
          <h1 className="text-2xl font-bold">إدارة الشكاوى</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportComplaints}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <FaDownload />
            تصدير
          </button>
          <button
            onClick={handlePrintComplaints}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPrint />
            طباعة
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-500">{stats.total}</div>
          <div className="text-sm text-gray-600">إجمالي الشكاوى</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-orange-500">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">معلقة</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-500">
            {stats.investigating}
          </div>
          <div className="text-sm text-gray-600">قيد التحقيق</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-500">
            {stats.resolved}
          </div>
          <div className="text-sm text-gray-600">محلولة</div>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="ابحث برقم الشكوى، اسم المستخدم، أو رقم الطلب..."
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="border rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <FaSearch />
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <FaFilter />
            فلترة
          </button>
        </div>
      </div>

      {/* عدد النتائج */}
      <div className="mb-4 text-sm text-gray-500 text-right">
        عرض {paginatedComplaints.length} من {filteredComplaints.length} شكوى
      </div>

      {/* قائمة الشكاوى */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {paginatedComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className={`border-2 rounded-2xl p-4 flex flex-col gap-3 bg-white shadow-sm ${
              complaint.status === "pending"
                ? "border-orange-300"
                : "border-green-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaHashtag className="text-gray-400" />
                <span className="font-bold">#{complaint.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <span className="text-xs text-gray-500">{complaint.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FaUser className="text-blue-400" />
                <span>
                  المرسل: <span className="font-bold">{complaint.sender}</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaUser className="text-pink-400" />
                <span>
                  المستلم:{" "}
                  <span className="font-bold">{complaint.receiver}</span>
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaCommentDots className="text-orange-400 mt-1" />
              <div className="flex-1 text-sm text-gray-700">
                {complaint.description}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              {complaint.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleSendReply(complaint.id)}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 flex items-center gap-1"
                  >
                    <FaCommentDots /> إرسال رد
                  </button>
                  <button
                    onClick={() => handleResolveComplaint(complaint.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center gap-1"
                  >
                    <FaCheck /> حل الشكوى
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleReopenComplaint(complaint.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-1"
                >
                  <FaEye /> إعادة فتح
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center items-center mb-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`w-9 h-9 flex items-center justify-center rounded-full border text-lg font-bold transition-all duration-200 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-orange-500 hover:bg-orange-100"
            }`}
          >
            &#8592;
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 border ${
                currentPage === idx + 1
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className={`w-9 h-9 flex items-center justify-center rounded-full border text-lg font-bold transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-orange-500 hover:bg-orange-100"
            }`}
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default Complaints;
