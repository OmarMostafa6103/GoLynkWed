import React, { useState } from "react";
import {
  FaFilter,
  FaClipboardList,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaStop,
  FaUser,
  FaCalendarAlt,
  FaRoute,
  FaLock,
  FaClock,
  FaHashtag,
  FaSuitcaseRolling,
  FaExclamationTriangle,
} from "react-icons/fa";

const mockOrders = [
  {
    id: 1023,
    sender: "محمد أحمد",
    date: "1/7/2025",
    from: "الرياض",
    to: "اسطنبول",
    type: "شخصي",
    status: "معلق",
  },
  {
    id: 1024,
    sender: "سارة علي",
    date: "2/7/2025",
    from: "جدة",
    to: "القاهرة",
    type: "تجاري",
    status: "مقبول",
  },
  {
    id: 1025,
    sender: "خالد يوسف",
    date: "3/7/2025",
    from: "الدمام",
    to: "دبي",
    type: "شخصي",
    status: "معلق",
  },
  {
    id: 1026,
    sender: "منى حسن",
    date: "4/7/2025",
    from: "مكة",
    to: "الدوحة",
    type: "تجاري",
    status: "منتهي",
  },
  {
    id: 1027,
    sender: "سعيد عبد الله",
    date: "5/7/2025",
    from: "الرياض",
    to: "بيروت",
    type: "شخصي",
    status: "مرفوض",
  },
  {
    id: 1028,
    sender: "ليلى سمير",
    date: "6/7/2025",
    from: "جدة",
    to: "عمان",
    type: "تجاري",
    status: "معلق",
  },
  {
    id: 1029,
    sender: "يوسف فهد",
    date: "7/7/2025",
    from: "الدمام",
    to: "القاهرة",
    type: "شخصي",
    status: "مقبول",
  },
  {
    id: 1030,
    sender: "علي حسن",
    date: "8/7/2025",
    from: "مكة",
    to: "دبي",
    type: "تجاري",
    status: "منتهي",
  },
];

const statusColors = {
  معلق: "bg-yellow-100 text-yellow-800",
  مقبول: "bg-blue-100 text-blue-800",
  منتهي: "bg-gray-100 text-gray-700",
  مرفوض: "bg-red-100 text-red-700",
};

const mockTrips = [
  {
    id: 1023,
    traveler: "محمد أحمد",
    date: "1/7/2025",
    route: "من القاهرة إلى الإسكندرية",
    purpose: "علبة هدايا",
    status: "نشطة",
  },
  {
    id: 1024,
    traveler: "احمد محمد",
    date: "1/7/2025",
    route: "من القاهرة إلى الإسكندرية",
    purpose: "علبة هدايا",
    status: "معلقة",
  },
  {
    id: 1025,
    traveler: "احمد محمد",
    date: "1/7/2025",
    route: "من القاهرة إلى الإسكندرية",
    purpose: "علبة هدايا",
    status: "نشطة",
  },
  {
    id: 1026,
    traveler: "احمد محمد",
    date: "1/7/2025",
    route: "من القاهرة إلى الإسكندرية",
    purpose: "علبة هدايا",
    status: "معلقة",
  },
  {
    id: 1027,
    traveler: "احمد محمد",
    date: "1/7/2025",
    route: "من القاهرة إلى الإسكندرية",
    purpose: "علبة هدايا",
    status: "نشطة",
  },
  {
    id: 1028,
    traveler: "احمد محمد",
    date: "1/7/2025",
    route: "من القاهرة إلى الإسكندرية",
    purpose: "علبة هدايا",
    status: "معلقة",
  },
];

const tripStatusColors = {
  نشطة: "bg-blue-200 text-blue-800",
  معلقة: "bg-yellow-200 text-yellow-800",
};

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [trips, setTrips] = useState(mockTrips);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [selectAllTrips, setSelectAllTrips] = useState(false);

  const filteredOrders = orders.filter(
    (o) =>
      o.sender.includes(search) ||
      o.from.includes(search) ||
      o.to.includes(search) ||
      o.type.includes(search) ||
      o.status.includes(search) ||
      o.id.toString().includes(search)
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredOrders.map((o) => o.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    alert(`تم تنفيذ الإجراء: ${action} على الطلبات: ${selected.join(", ")}`);
  };

  const handleSelectAllTrips = () => {
    if (selectAllTrips) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(trips.map((t) => t.id));
    }
    setSelectAllTrips(!selectAllTrips);
  };

  const handleSelectTrip = (id) => {
    setSelectedTrips((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkActionTrips = (action) => {
    alert(
      `تم تنفيذ الإجراء: ${action} على الرحلات: ${selectedTrips.join(", ")}`
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* عنوان الصفحة */}
      <div className="flex items-center gap-2 mb-4">
        <FaClipboardList className="text-2xl text-blue-500" />
        <h1 className="text-2xl font-bold">جدول الطلبات</h1>
      </div>
      {/* شريط البحث */}
      <div className="flex items معها gap-2 mb-6">
        <button className="border rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <FaFilter />
        </button>
        <input
          type="text"
          placeholder="ابحث عن الطلب أو المرسل أو الوجهة..."
          className="border rounded-lg px-3 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* الجدول */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-2 px-3 text-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-2 px-3 text-center">اسم المرسل</th>
              <th className="py-2 px-3 text-center">التاريخ</th>
              <th className="py-2 px-3 text-center">من - إلى</th>
              <th className="py-2 px-3 text-center">النوع</th>
              <th className="py-2 px-3 text-center">الحالة</th>
              <th className="py-2 px-3 text-center">
                رقم الطلب <span className="text-xs text-gray-400">#</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <tr key={order.id} className={idx % 2 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={() => handleSelect(order.id)}
                    />
                  </td>
                  <td className="py-2 px-3 text-center">{order.sender}</td>
                  <td className="py-2 px-3 text-center">{order.date}</td>
                  <td className="py-2 px-3 text-center">
                    {order.from} <span className="text-gray-400">→</span>{" "}
                    {order.to}
                  </td>
                  <td className="py-2 px-3 text-center">{order.type}</td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg font-bold ${
                        statusColors[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center font-mono">
                    #{order.id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-400">
                  لا توجد طلبات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* أزرار الإجراءات الجماعية */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <button
          onClick={() => handleBulkAction("تعديل")}
          className="bg-blue-100 text-blue-800 px-4 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
        >
          <FaEdit />
          تعديل
        </button>
        <button
          onClick={() => handleBulkAction("حذف")}
          className="bg-red-100 text-red-800 px-4 py-1 rounded hover:bg-red-200 flex items-center gap-1"
        >
          <FaTrash />
          حذف
        </button>
        <button
          onClick={() => handleBulkAction("قبول")}
          className="bg-green-100 text-green-800 px-4 py-1 rounded hover:bg-green-200 flex items-center gap-1"
        >
          <FaCheck />
          قبول
        </button>
        <button
          onClick={() => handleBulkAction("رفض")}
          className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded hover:bg-yellow-200 flex items-center gap-1"
        >
          <FaTimes />
          رفض
        </button>
        <button
          onClick={() => handleBulkAction("إنهاء الطلب")}
          className="bg-gray-100 text-gray-700 px-4 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
        >
          <FaStop />
          إنهاء الطلب
        </button>
      </div>

      {/* جدول الرحلات */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <FaSuitcaseRolling className="text-2xl text-gray-700" />
          <h2 className="text-2xl font-bold">جدول الرحلات</h2>
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectAllTrips}
                    onChange={handleSelectAllTrips}
                  />
                </th>
                <th className="py-2 px-3 text-center">
                  <FaUser className="inline mb-1 text-blue-400" /> المسافر
                </th>
                <th className="py-2 px-3 text-center">
                  <FaCalendarAlt className="inline mb-1 text-red-400" /> التاريخ
                </th>
                <th className="py-2 px-3 text-center">
                  <FaRoute className="inline mb-1 text-orange-400" /> خط السير
                </th>
                <th className="py-2 px-3 text-center">
                  <FaLock className="inline mb-1 text-pink-400" /> الغرض
                </th>
                <th className="py-2 px-3 text-center">
                  <FaClock className="inline mb-1 text-yellow-400" /> الحالة
                </th>
                <th className="py-2 px-3 text-center">
                  <FaHashtag className="inline mb-1 text-red-400" /> الرقم
                </th>
              </tr>
            </thead>
            <tbody>
              {trips.length > 0 ? (
                trips.map((trip, idx) => (
                  <tr key={trip.id} className={idx % 2 ? "bg-gray-50" : ""}>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedTrips.includes(trip.id)}
                        onChange={() => handleSelectTrip(trip.id)}
                      />
                    </td>
                    <td className="py-2 px-3 text-center">{trip.traveler}</td>
                    <td className="py-2 px-3 text-center">{trip.date}</td>
                    <td className="py-2 px-3 text-center">{trip.route}</td>
                    <td className="py-2 px-3 text-center">{trip.purpose}</td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-lg font-bold flex items-center justify-center gap-1 ${
                          tripStatusColors[trip.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">
                      #{trip.id}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-400">
                    لا توجد رحلات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <button
            onClick={() => handleBulkActionTrips("تحديد الكل")}
            className="bg-gray-100 text-gray-700 px-4 py-1 rounded hover:bg-gray-200"
          >
            تحديد الكل
          </button>
          <button
            onClick={() => handleBulkActionTrips("إلغاء التحديد")}
            className="bg-gray-100 text-gray-700 px-4 py-1 rounded hover:bg-gray-200"
          >
            إلغاء التحديد
          </button>
          <button
            onClick={() => handleBulkActionTrips("قبول")}
            className="bg-green-100 text-green-800 px-4 py-1 rounded hover:bg-green-200 flex items-center gap-1"
          >
            <FaCheck />
            قبول
          </button>
          <button
            onClick={() => handleBulkActionTrips("إلغاء")}
            className="bg-red-100 text-red-800 px-4 py-1 rounded hover:bg-red-200 flex items-center gap-1"
          >
            <FaTimes />
            إلغاء
          </button>
          <button
            onClick={() => handleBulkActionTrips("إرسال تحذير")}
            className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded hover:bg-yellow-200 flex items-center gap-1"
          >
            <FaExclamationTriangle />
            إرسال تحذير
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
