// Dashboard.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaUserPlus,
  FaClipboardList,
  FaSuitcaseRolling,
  FaUserCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCrown,
} from "react-icons/fa";
import { tokenStorage } from "../../api/client";

const Dashboard = () => {
  // الحصول على بيانات المستخدم
  const user = tokenStorage.getUser();

  const notifications = [
    {
      id: 1,
      message: "تم استلام شكوى جديدة من المستخدم رقم 12234",
      time: "اليوم 9:41 صباحًا",
    },
    {
      id: 2,
      message: "تم استلام شكوى جديدة من المستخدم رقم 12234",
      time: "اليوم 8:20 صباحًا",
    },
    { id: 3, message: "تم تسجيل مستخدم جديد", time: "أمس 6:30 مساءً" },
    { id: 4, message: "طلب جديد بانتظار الموافقة", time: "أمس 3:15 مساءً" },
  ];

  const chartData = [
    { day: "السبت", orders: 30, trips: 15 },
    { day: "الأحد", orders: 25, trips: 10 },
    { day: "الإثنين", orders: 15, trips: 20 },
    { day: "الثلاثاء", orders: 20, trips: 10 },
    { day: "الأربعاء", orders: 35, trips: 25 },
    { day: "الخميس", orders: 30, trips: 18 },
    { day: "الجمعة", orders: 10, trips: 5 },
  ];

  const statsCards = [
    {
      label: "إجمالي المستخدمين",
      value: "3,154",
      icon: <FaUsers />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
    {
      label: "المستخدمين الجدد",
      value: "26",
      icon: <FaUserPlus />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
    {
      label: "المستخدمين النشطاء",
      value: "10",
      icon: <FaUserCheck />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
    {
      label: "الطلبات الحالية",
      value: "87",
      icon: <FaClipboardList />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
    {
      label: "الرحلات الحالية",
      value: "26",
      icon: <FaSuitcaseRolling />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
    {
      label: "حسابات محتاجة توثيق",
      value: "20",
      icon: <FaExclamationTriangle />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
    {
      label: "عدد الطلبات المكتملة",
      value: "10",
      icon: <FaCheckCircle />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
    {
      label: "الشكاوى المتعلقة",
      value: "4",
      icon: <FaExclamationTriangle />,
      color: "text-[#FE563B]",
      bg: "bg-white",
    },
  ];

  return (
    <div
      className="bg-white min-h-screen w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
      dir="rtl"
    >
      {/* العنوان الرئيسي */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <span className="bg-[#FE563B] text-white rounded-lg p-2 text-xl sm:text-2xl">
          <FaUsers />
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#222]">
          لوحة الإحصائيات
        </h1>
      </div>

      {/* رسالة ترحيب للسوبر أدمين */}
      {user?.role === "SuperAdmin" && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-500 text-2xl" />
            <div>
              <h3 className="font-bold text-yellow-800 text-lg">
                مرحباً بك، {user.userName} 👑
              </h3>
              <p className="text-yellow-700 text-sm">
                أنت تمتلك صلاحيات السوبر أدمن - لديك وصول كامل لجميع أجزاء
                النظام
              </p>
            </div>
          </div>
        </div>
      )}

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className="flex items-center border border-[#FE563B] rounded-xl bg-white p-4 sm:p-5 gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all duration-200 min-w-0"
          >
            <div className="bg-[#FE563B] rounded-lg w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl shrink-0">
              {card.icon}
            </div>
            <div className="truncate flex-1">
              <div className="text-[#222] font-bold text-sm sm:text-base truncate">
                {card.label}
              </div>
              <div className="text-[#FE563B] text-base sm:text-lg lg:text-xl font-extrabold">
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* إشعارات ورسم بياني */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* إشعارات */}
        <div className="flex-1 border border-[#FE563B] rounded-xl bg-white p-4 sm:p-6 shadow-sm min-w-0">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <span className="bg-[#FE563B] text-white rounded-lg p-2 text-base sm:text-lg lg:text-xl">
              <FaExclamationTriangle />
            </span>
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#222]">
              أحدث الإشعارات الإدارية
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-lg px-3 sm:px-4 py-2 sm:py-3 gap-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[#FE563B] break-words">
                    {n.message}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    {n.time}
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 hover:underline text-xs sm:text-sm font-bold mt-2 sm:mt-0 transition-colors duration-200 whitespace-nowrap">
                  عرض الشكوى
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* رسم بياني */}
        <div className="flex-1 border border-[#FE563B] rounded-xl bg-white p-4 sm:p-6 shadow-sm min-w-0">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <span className="bg-[#FE563B] text-white rounded-lg p-2 text-base sm:text-lg lg:text-xl">
              <FaClipboardList />
            </span>
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#222]">
              عدد الطلبات والرحلات في يناير
            </h2>
          </div>
          <div className="w-full h-48 sm:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="day"
                  stroke="#FE563B"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                />
                <YAxis stroke="#FE563B" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #FE563B",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="orders" fill="#FE563B" name="الطلبات" />
                <Bar dataKey="trips" fill="#3366cc" name="الرحلات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
