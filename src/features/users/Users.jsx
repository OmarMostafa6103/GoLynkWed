import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const mockUsers = [
  {
    id: 1,
    name: "محمد أحمد",
    phone: "0123456789",
    email: "ahmed@mail.com",
    role: "مسافر",
    status: "موثق",
    rating: 4.4,
    verified: true,
    waitingVerification: false,
    id_card: "https://via.placeholder.com/120x80?text=ID1",
    profile_picture: "https://via.placeholder.com/60x60?text=U1",
    blocked: false,
  },
  {
    id: 2,
    name: "أحمد محمد",
    phone: "0123456790",
    email: "ahmed2@mail.com",
    role: "مسافر",
    status: "قيد التحقق",
    rating: null,
    verified: false,
    waitingVerification: true,
    id_card: "https://via.placeholder.com/120x80?text=ID2",
    profile_picture: "https://via.placeholder.com/60x60?text=U2",
    blocked: false,
  },
  {
    id: 3,
    name: "سارة علي",
    phone: "0123456791",
    email: "sara@mail.com",
    role: "مرسل",
    status: "قيد التحقق",
    rating: null,
    verified: false,
    waitingVerification: true,
    id_card: "https://via.placeholder.com/120x80?text=ID3",
    profile_picture: "https://via.placeholder.com/60x60?text=U3",
    blocked: false,
  },
  {
    id: 4,
    name: "خالد يوسف",
    phone: "0123456792",
    email: "khaled@mail.com",
    role: "مرسل",
    status: "قيد التحقق",
    rating: null,
    verified: false,
    waitingVerification: true,
    id_card: "https://via.placeholder.com/120x80?text=ID4",
    profile_picture: "https://via.placeholder.com/60x60?text=U4",
    blocked: false,
  },
  {
    id: 5,
    name: "منى حسن",
    phone: "0123456793",
    email: "mona@mail.com",
    role: "مسافر",
    status: "قيد التحقق",
    rating: null,
    verified: false,
    waitingVerification: true,
    id_card: "https://via.placeholder.com/120x80?text=ID5",
    profile_picture: "https://via.placeholder.com/60x60?text=U5",
    blocked: false,
  },
  {
    id: 6,
    name: "سعيد عبد الله",
    phone: "0123456794",
    email: "saeed@mail.com",
    role: "مرسل",
    status: "قيد التحقق",
    rating: null,
    verified: false,
    waitingVerification: true,
    id_card: "https://via.placeholder.com/120x80?text=ID6",
    profile_picture: "https://via.placeholder.com/60x60?text=U6",
    blocked: false,
  },
  {
    id: 7,
    name: "ليلى سمير",
    phone: "0123456795",
    email: "laila@mail.com",
    role: "مسافر",
    status: "قيد التحقق",
    rating: null,
    verified: false,
    waitingVerification: true,
    id_card: "https://via.placeholder.com/120x80?text=ID7",
    profile_picture: "https://via.placeholder.com/60x60?text=U7",
    blocked: false,
  },
];

const Users = () => {
  const [users] = useState(mockUsers);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("الكل");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const statusColors = {
    موثق: "bg-green-100 text-green-800",
    "قيد التحقق": "bg-yellow-100 text-yellow-800",
    محظور: "bg-red-100 text-red-800",
  };

  const handleSelect = (userId) => {
    if (selected.includes(userId)) {
      setSelected(selected.filter((id) => id !== userId));
    } else {
      setSelected([...selected, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(filteredUsers.map((user) => user.id));
      setSelectAll(true);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`${action} users:`, selected);
    // هنا يمكن إضافة منطق الإجراء الجماعي
  };

  const handleUserAction = (userId, action) => {
    console.log(`${action} user:`, userId);
    // هنا يمكن إضافة منطق إجراء المستخدم الفردي
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole === "الكل" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "الكل" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const waitingVerificationUsers = users.filter(
    (user) => user.waitingVerification
  );

  return (
    <div
      className="bg-white min-h-screen w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
      dir="rtl"
    >
      {/* العنوان الرئيسي */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <span className="bg-[#FE563B] text-white rounded-lg p-2 text-xl sm:text-2xl">
          <i className="fas fa-users"></i>
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#222]">
          إدارة المستخدمين
        </h1>
      </div>

      {/* قسم التوثيق قيد الانتظار */}
      {waitingVerificationUsers.length > 0 && (
        <div className="bg-orange-50 rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8 shadow-sm border border-orange-200">
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2 text-center sm:text-right">
            <span>
              توثيق <span className="text-blue-500">قيد الانتظار</span>
            </span>
            <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs">
              <i className="fas fa-clock"></i> {waitingVerificationUsers.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {waitingVerificationUsers.slice(0, 8).map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg p-3 sm:p-4 border border-orange-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profile_picture}
                    alt={user.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {user.role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleUserAction(user.id, "تفعيل")}
                    className="flex-1 bg-green-500 text-white text-xs sm:text-sm py-1 sm:py-2 rounded hover:bg-green-600 transition-colors duration-200"
                  >
                    تفعيل
                  </button>
                  <button
                    onClick={() => openUserModal(user)}
                    className="flex-1 bg-blue-500 text-white text-xs sm:text-sm py-1 sm:py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    عرض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* فلاتر البحث */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البحث
            </label>
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الدور
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base"
            >
              <option value="الكل">الكل</option>
              <option value="مرسل">مرسل</option>
              <option value="مسافر">مسافر</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base"
            >
              <option value="الكل">الكل</option>
              <option value="موثق">موثق</option>
              <option value="قيد التحقق">قيد التحقق</option>
              <option value="محظور">محظور</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterRole("الكل");
                setFilterStatus("الكل");
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="mt-6 sm:mt-8">
        <div className="table-responsive">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-3 sm:px-6 text-right text-xs sm:text-sm font-medium text-gray-700">
                  الاسم
                </th>
                <th className="py-3 px-3 sm:px-6 text-right text-xs sm:text-sm font-medium text-gray-700 hidden sm:table-cell">
                  الهاتف
                </th>
                <th className="py-3 px-3 sm:px-6 text-right text-xs sm:text-sm font-medium text-gray-700 hidden lg:table-cell">
                  البريد
                </th>
                <th className="py-3 px-3 sm:px-6 text-right text-xs sm:text-sm font-medium text-gray-700">
                  الدور
                </th>
                <th className="py-3 px-3 sm:px-6 text-right text-xs sm:text-sm font-medium text-gray-700">
                  الحالة
                </th>
                <th className="py-3 px-3 sm:px-6 text-right text-xs sm:text-sm font-medium text-gray-700 hidden md:table-cell">
                  التقييم
                </th>
                <th className="py-3 px-3 sm:px-6 text-center text-xs sm:text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`${
                    idx % 2 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 cursor-pointer transition-colors duration-200`}
                  onClick={() => openUserModal(user)}
                >
                  <td className="py-3 px-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profile_picture}
                        alt={user.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm sm:text-base font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 sm:hidden">
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-6 text-sm sm:text-base text-gray-900 hidden sm:table-cell">
                    {user.phone}
                  </td>
                  <td className="py-3 px-3 sm:px-6 text-sm sm:text-base text-gray-900 hidden lg:table-cell">
                    {user.email}
                  </td>
                  <td className="py-3 px-3 sm:px-6">
                    <span className="text-sm sm:text-base text-gray-900">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs sm:text-sm font-bold ${
                        statusColors[user.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-6 text-sm sm:text-base text-gray-900 hidden md:table-cell">
                    {user.rating ? (
                      <span>
                        {user.rating}{" "}
                        <span role="img" aria-label="نجمة">
                          ⭐
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs sm:text-sm">
                        لا يوجد
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-6 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelect(user.id);
                      }}
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* أزرار الإجراءات الجماعية */}
      {selected.length > 0 && (
        <div className="mt-4 sm:mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="text-sm sm:text-base text-blue-700 font-medium">
              تم تحديد {selected.length} مستخدم
            </span>
            <button
              onClick={() => handleBulkAction("تفعيل")}
              className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base"
            >
              تفعيل
            </button>
            <button
              onClick={() => handleBulkAction("إرسال تحذير")}
              className="bg-yellow-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-sm sm:text-base"
            >
              إرسال تحذير <i className="fas fa-exclamation-triangle mr-1"></i>
            </button>
            <button
              onClick={() => handleBulkAction("حذف")}
              className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
            >
              حذف
            </button>
          </div>
        </div>
      )}

      {/* Modal for user details */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedUser && (
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">تفاصيل المستخدم</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.profile_picture}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    الهاتف
                  </label>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    الحالة
                  </label>
                  <span
                    className={`px-2 py-1 rounded text-sm font-bold ${
                      statusColors[selectedUser.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                {selectedUser.rating && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      التقييم
                    </label>
                    <p className="text-gray-900">{selectedUser.rating} ⭐</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    handleUserAction(selectedUser.id, "تفعيل");
                    setShowModal(false);
                  }}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  تفعيل
                </button>
                <button
                  onClick={() => {
                    handleUserAction(selectedUser.id, "حظر");
                    setShowModal(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  حظر
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
