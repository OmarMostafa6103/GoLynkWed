import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
const topCities = [
  { name: "القاهرة", position: [30.0444, 31.2357] },
  { name: "الإسكندرية", position: [31.2001, 29.9187] },
  { name: "الجيزة", position: [30.0131, 31.2089] },
  { name: "المنصورة", position: [31.0364, 31.3807] },
  { name: "أسيوط", position: [27.1809, 31.1837] },
];
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaChartLine,
  FaMapMarkerAlt,
  FaChartPie,
  FaBell,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "الطلبات",
      data: [12, 19, 15, 22, 30, 18],
      borderColor: "#FF5722",
      backgroundColor: "rgba(255,87,34,0.1)",
      tension: 0.4,
      borderWidth: 4,
      pointRadius: 4,
    },
    {
      label: "الرحلات",
      data: [10, 14, 13, 17, 12, 15],
      borderColor: "#1565C0",
      backgroundColor: "rgba(21,101,192,0.1)",
      tension: 0.4,
      borderWidth: 4,
      pointRadius: 4,
    },
    {
      label: "المستخدمين",
      data: [8, 12, 10, 14, 20, 16],
      borderColor: "#222",
      backgroundColor: "rgba(33,33,33,0.1)",
      tension: 0.4,
      borderWidth: 4,
      pointRadius: 4,
    },
  ],
};

const lineOptions = {
  responsive: true,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "#eee" }, beginAtZero: true },
  },
};

const donutData = {
  labels: [
    "إجمالي الطلبات",
    "إجمالي الرحلات",
    "مستخدمين جدد",
    "متوسط التقييمات",
    "الطلبات المرفوضة",
  ],
  datasets: [
    {
      data: [120, 80, 30, 60, 10],
      backgroundColor: ["#FF5722", "#1565C0", "#2196F3", "#222", "#FFB300"],
      borderWidth: 2,
    },
  ],
};

const donutOptions = {
  cutout: "70%",
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
};

const donutLabels = [
  { color: "#FF5722", label: "إجمالي الطلبات", value: "120 طلب مكتمل" },
  { color: "#1565C0", label: "إجمالي الرحلات", value: "80 رحلة مكتملة" },
  { color: "#2196F3", label: "مستخدمين جدد", value: "30 مستخدم جديد" },
  { color: "#222", label: "متوسط التقييمات", value: "4.2 من 5" },
  { color: "#FFB300", label: "الطلبات المرفوضة", value: "10 طلب مرفوض" },
];

const alerts = [
  {
    title: "انخفاض مفاجئ في عدد الطلبات 🎉",
    details: [
      "انخفاض بنسبة 27% في عدد الطلبات من محافظة الإسكندرية خلال الـ 48 ساعة الماضية",
      "المعدل اليومي المعتاد: 85 طلب",
      "الحالي: 62 طلب فقط",
    ],
    img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  },
  {
    title: "زيادة في عدد المستخدمين الجدد 🚀",
    details: ["تم تسجيل 15 مستخدم جديد اليوم", "أعلى من المتوسط اليومي بـ 30%"],
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    title: "تنبيه: ارتفاع الطلبات المرفوضة ⚠️",
    details: [
      "تم رفض 5 طلبات خلال اليوم الماضي",
      "يرجى مراجعة أسباب الرفض مع فريق الدعم",
    ],
    img: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
  },
];

const Reports = () => {
  const [alertIndex, setAlertIndex] = useState(0);
  const [showMapModal, setShowMapModal] = useState(false);
  useEffect(() => {
    const interval = setInterval(
      () => setAlertIndex((prev) => (prev + 1) % alerts.length),
      8000
    );
    return () => clearInterval(interval);
  }, []);
  const [activeLine, setActiveLine] = useState(null);
  const customLineData = {
    ...lineData,
    datasets:
      activeLine === null ? lineData.datasets : [lineData.datasets[activeLine]],
  };
  const legendItems = [
    { color: "#FF5722", label: "الطلبات" },
    { color: "#1565C0", label: "الرحلات" },
    { color: "#222", label: "المستخدمين" },
  ];
  const months = [
    "كل الشهور",
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const [selectedMonth, setSelectedMonth] = useState("كل الشهور");

  return (
    <div
      className="p-2 sm:p-6 md:p-10 bg-gradient-to-br from-orange-50 to-white min-h-screen font-sans"
      dir="rtl"
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
          لوحة التقارير الذكية
        </h1>
        <p className="text-base md:text-lg text-gray-500 mt-2">
          مراقبة وتحليل الأداء في لمحة سريعة
        </p>
      </div>
      <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg p-4 md:p-8 hover:shadow-xl transition duration-300 border border-orange-100 mb-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <FaChartLine className="text-2xl text-blue-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-700">
            مؤشرات الأداء السريعة
          </h2>
        </div>
        <Line data={customLineData} options={lineOptions} height={120} />
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-base select-none">
          {legendItems.map((item, idx) => (
            <span
              key={item.label}
              className="flex items-center gap-1 cursor-pointer px-2 py-1 rounded transition"
              style={{
                opacity: activeLine === null || activeLine === idx ? 1 : 0.4,
                fontWeight: activeLine === idx ? "bold" : "normal",
                background: activeLine === idx ? "#fff7f5" : "transparent",
              }}
              onMouseEnter={() => setActiveLine(idx)}
              onMouseLeave={() => setActiveLine(null)}
            >
              <span
                className="w-5 h-2 rounded inline-block"
                style={{ background: item.color }}
              ></span>{" "}
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        <div className="relative bg-gradient-to-br from-white via-orange-50 to-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col items-center border border-orange-100 mb-8 xl:mb-0 overflow-hidden">
          <div className="w-full flex justify-end mb-4">
            <select
              className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm shadow focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-pink-100 text-pink-500 rounded-full p-2 shadow-sm flex items-center justify-center">
              <FaChartPie className="text-2xl md:text-3xl" />
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
              <span className="font-bold text-gray-700">في شهر يناير</span>
            </h3>
          </div>
          <div className="flex flex-col items-center w-full">
            <div
              className="relative flex items-center justify-center w-full"
              style={{ minHeight: 320 }}
            >
              <Doughnut
                data={donutData}
                options={{
                  ...donutOptions,
                  plugins: {
                    ...donutOptions.plugins,
                    legend: { display: false },
                  },
                }}
                className="!w-[260px] !h-[260px] md:!w-[320px] md:!h-[320px] drop-shadow-lg"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 w-full">
              {donutLabels.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-base md:text-lg font-medium bg-white/80 rounded-xl px-3 py-2 shadow border border-gray-100"
                >
                  <span
                    className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white shadow-sm inline-block"
                    style={{ background: item.color }}
                  ></span>
                  <span className="text-gray-700 font-bold">{item.label}:</span>
                  <span className="text-gray-500 font-normal">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg p-4 md:p-8 flex flex-col items-center hover:shadow-xl transition duration-300 border border-orange-100 h-full">
          <div className="w-full flex justify-end mb-4">
            <select
              className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm shadow focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-2xl text-orange-500" />
            <h3 className="text-lg md:text-xl font-bold text-gray-700">
              تحليل جغرافي
            </h3>
          </div>
          <div
            className="w-full max-w-lg mb-3 rounded-2xl overflow-hidden border border-orange-100 shadow cursor-pointer hover:ring-2 hover:ring-orange-300 transition"
            style={{ height: 350 }}
            onClick={() => setShowMapModal(true)}
            title="اضغط لتكبير الخريطة"
          >
            <MapContainer
              center={[26.8206, 30.8025]}
              zoom={5.5}
              style={{
                height: "350px",
                width: "100%",
                pointerEvents: "none",
                filter: "blur(0.5px) grayscale(0.1)",
              }}
              scrollWheelZoom={false}
              dragging={false}
              doubleClickZoom={false}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {topCities.map((city) => (
                <Marker key={city.name} position={city.position}>
                  <Popup>{city.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {showMapModal &&
            ReactDOM.createPortal(
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                onClick={() => setShowMapModal(false)}
              >
                <div
                  className="bg-white rounded-3xl shadow-2xl border border-orange-200 relative max-w-3xl w-full mx-4"
                  style={{ minHeight: 500, minWidth: 350 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute left-4 top-4 text-gray-500 hover:text-orange-500 text-2xl font-bold z-10"
                    onClick={() => setShowMapModal(false)}
                    aria-label="إغلاق الخريطة"
                  >
                    ×
                  </button>
                  <MapContainer
                    center={[26.8206, 30.8025]}
                    zoom={6.2}
                    style={{ height: 500, width: "100%" }}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    attributionControl={true}
                    dragging={true}
                    doubleClickZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {topCities.map((city) => (
                      <Marker key={city.name} position={city.position}>
                        <Popup>{city.name}</Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>,
              document.body
            )}
          <span className="text-sm text-gray-500">المدن الأعلى استخدامًا</span>
        </div>
      </div>
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-6 md:p-10 hover:shadow-xl transition duration-300 max-w-3xl mx-auto border border-orange-100">
        <div className="w-full flex justify-end mb-4">
          <select
            className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm shadow focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <FaBell className="text-2xl text-red-400" />
          <h3 className="text-xl md:text-2xl font-bold text-gray-700">
            التنبيهات الإدارية
          </h3>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={alerts[alertIndex].img}
            alt="alert"
            className="w-28 h-28 object-contain drop-shadow"
          />
          <div className="flex-1">
            <h4 className="font-extrabold text-lg md:text-xl mb-3 text-orange-600 flex items-center gap-2">
              {alerts[alertIndex].title}
            </h4>
            <ul className="list-disc pr-5 text-base text-gray-700 space-y-2">
              {alerts[alertIndex].details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex gap-2 justify-center mt-6">
          {alerts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setAlertIndex(idx)}
              className={`w-8 h-2 rounded-full transition-all duration-200 border border-orange-200 ${
                alertIndex === idx ? "bg-orange-400" : "bg-gray-200"
              }`}
              aria-label={`انتقل إلى التنبيه ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
