import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { roleLabels } from "../features/auth/roles";
import {
  permissionLabels,
  roleToPermissions,
} from "../features/auth/permissions";
import apiClient from "../api/client";
import { tokenStorage } from "../api/client";

const AdminAccess = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Admin",
    countryCode: "+20",
    accessPages: [],
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // قائمة الصفحات المتاحة للأدمن
  const availablePages = [
    { key: "userMenagment", label: "إدارة المستخدمين" },
    { key: "orderMenagment", label: "إدارة الطلبات" },
    { key: "complaintsMenagment", label: "إدارة الشكاوى" },
    { key: "reportsMenagment", label: "إدارة التقارير" },
    { key: "chatMenag", label: "إدارة المحادثات" },
  ];

  // قائمة رموز البلدان المحدثة
  const countries = useMemo(
    () => [
      { code: "+20", name: "مصر", flag: "🇪🇬" },
      { code: "+966", name: "السعودية", flag: "🇸🇦" },
      { code: "+971", name: "الإمارات", flag: "🇦🇪" },
      { code: "+965", name: "الكويت", flag: "🇰🇼" },
      { code: "+973", name: "البحرين", flag: "🇧🇭" },
      { code: "+974", name: "قطر", flag: "🇶🇦" },
      { code: "+968", name: "عمان", flag: "🇴🇲" },
      { code: "+962", name: "الأردن", flag: "🇯🇴" },
      { code: "+961", name: "لبنان", flag: "🇱🇧" },
      { code: "+963", name: "سوريا", flag: "🇸🇾" },
      { code: "+964", name: "العراق", flag: "🇮🇶" },
      { code: "+967", name: "اليمن", flag: "🇾🇪" },
      { code: "+218", name: "ليبيا", flag: "🇱🇾" },
      { code: "+213", name: "الجزائر", flag: "🇩🇿" },
      { code: "+212", name: "المغرب", flag: "🇲🇦" },
      { code: "+216", name: "تونس", flag: "🇹🇳" },
      { code: "+249", name: "السودان", flag: "🇸🇩" },
      { code: "+1", name: "الولايات المتحدة", flag: "🇺🇸" },
      { code: "+44", name: "المملكة المتحدة", flag: "🇬🇧" },
      { code: "+33", name: "فرنسا", flag: "🇫🇷" },
      { code: "+49", name: "ألمانيا", flag: "🇩🇪" },
      { code: "+39", name: "إيطاليا", flag: "🇮🇹" },
      { code: "+34", name: "إسبانيا", flag: "🇪🇸" },
      { code: "+31", name: "هولندا", flag: "🇳🇱" },
      { code: "+32", name: "بلجيكا", flag: "🇧🇪" },
      { code: "+41", name: "سويسرا", flag: "🇨🇭" },
      { code: "+43", name: "النمسا", flag: "🇦🇹" },
      { code: "+91", name: "الهند", flag: "🇮🇳" },
      { code: "+86", name: "الصين", flag: "🇨🇳" },
      { code: "+81", name: "اليابان", flag: "🇯🇵" },
      { code: "+82", name: "كوريا الجنوبية", flag: "🇰🇷" },
      { code: "+60", name: "ماليزيا", flag: "🇲🇾" },
      { code: "+65", name: "سنغافورة", flag: "🇸🇬" },
      { code: "+90", name: "تركيا", flag: "🇹🇷" },
      { code: "+98", name: "إيران", flag: "🇮🇷" },
    ],
    []
  );

  // تحديد البلد المختار
  const selectedCountry = useMemo(() => {
    return (
      countries.find((country) => country.code === form.countryCode) ||
      countries[0]
    );
  }, [form.countryCode, countries]);

  // جلب قائمة المديرين
  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      let adminsList = [];

      // المحاولة الأولى: جلب من endpoint المديرين
      try {
        const response = await apiClient.get("/auth/admins");
        console.log(
          "📊 Admins data received from /auth/admins:",
          response.data
        );
        adminsList = response.data.data || response.data || [];
      } catch (error) {
        console.log("❌ /auth/admins failed, trying alternative endpoints");

        // المحاولة الثانية: جلب جميع المستخدمين وفلترة المديرين
        try {
          const usersResponse = await apiClient.get("/users");
          console.log("📊 Users data received:", usersResponse.data);
          const allUsers = usersResponse.data.data || usersResponse.data || [];
          adminsList = allUsers.filter(
            (user) => user.role === "SuperAdmin" || user.role === "Admin"
          );
        } catch (usersError) {
          console.log("❌ /users also failed");
        }
      }

      // إضافة المستخدم الحالي إذا كان مدير ولم يكن موجود في القائمة
      const currentUser = tokenStorage.getUser();
      if (
        currentUser &&
        (currentUser.role === "SuperAdmin" || currentUser.role === "Admin")
      ) {
        const userExists = adminsList.some(
          (admin) => admin._id === currentUser._id
        );
        if (!userExists) {
          console.log("➕ Adding current user to admins list:", currentUser);
          adminsList.unshift({
            _id: currentUser._id,
            name: currentUser.userName,
            userName: currentUser.userName,
            email: currentUser.email,
            role: currentUser.role,
            createdAt: new Date().toISOString(),
            isActive: true,
            phone: currentUser.phone || null,
            accessPages: currentUser.accessPages || [],
          });
        }
      }

      console.log("👥 Final admins list:", adminsList);

      // تسجيل أدوار المديرين
      if (adminsList.length > 0) {
        adminsList.forEach((admin, index) => {
          console.log(`👤 Admin ${index + 1}:`, {
            name: admin.name || admin.userName,
            role: admin.role,
            email: admin.email,
          });
        });
      }

      setAdmins(adminsList);
    } catch (error) {
      console.error("خطأ في جلب المديرين:", error);

      // في حالة فشل جميع المحاولات، اعرض المستخدم الحالي على الأقل
      const currentUser = tokenStorage.getUser();
      if (
        currentUser &&
        (currentUser.role === "SuperAdmin" || currentUser.role === "Admin")
      ) {
        console.log("📝 Showing current user only due to API error");
        setAdmins([
          {
            _id: currentUser._id,
            name: currentUser.userName,
            userName: currentUser.userName,
            email: currentUser.email,
            role: currentUser.role,
            createdAt: new Date().toISOString(),
            isActive: true,
            phone: currentUser.phone || null,
            accessPages: currentUser.accessPages || [],
          },
        ]);
      } else {
        toast.error("حدث خطأ في جلب قائمة المديرين");
      }
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // معالجة تغيير قيم النموذج
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // معالجة تغيير الصفحات المسموحة
  const handleAccessPagesChange = (pageKey) => {
    const updatedPages = form.accessPages.includes(pageKey)
      ? form.accessPages.filter((page) => page !== pageKey)
      : [...form.accessPages, pageKey];

    setForm({ ...form, accessPages: updatedPages });
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // التحقق من أن الأدمن العادي لديه صفحات مسموحة
    if (form.role === "Admin" && form.accessPages.length === 0) {
      toast.warning("يرجى اختيار صفحة واحدة على الأقل للأدمن العادي");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        userName: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };

      // إضافة الهاتف إذا كان موجوداً وبصيغة صحيحة
      if (form.phone && form.phone.trim()) {
        let phoneNumber = form.phone.trim();

        // التأكد من أن الرقم يبدأ بكود البلد المختار
        if (!phoneNumber.startsWith(form.countryCode)) {
          phoneNumber = form.countryCode + phoneNumber;
        }

        submitData.phone = phoneNumber;
      }

      // إضافة الصفحات المسموحة للأدمن العادي فقط
      if (form.role === "Admin") {
        submitData.accessPages = form.accessPages;
      }

      const response = await apiClient.post("/auth/createAccount", submitData);

      if (response.status === 201) {
        toast.success("تم إنشاء الحساب بنجاح!");
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "Admin",
          countryCode: "+20",
          accessPages: [],
        });
        setShowCreateForm(false);
        fetchAdmins();
      }
    } catch (error) {
      console.error("خطأ في إنشاء الحساب:", error);

      if (error.response?.status === 409) {
        toast.error(
          "البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر."
        );
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  // معالجة حذف المدير
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المدير؟")) return;

    try {
      await apiClient.delete(`/auth/admin/${adminId}`);
      toast.success("تم حذف المدير بنجاح");
      fetchAdmins();
    } catch (error) {
      console.error("خطأ في حذف المدير:", error);
      toast.error("حدث خطأ في حذف المدير");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* العنوان الرئيسي مع أيقونة السوبر أدمن */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-600">
              <span className="text-3xl">👑</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                لوحة تحكم السوبر أدمن
              </h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            إدارة المديرين والصلاحيات بصلاحيات السوبر أدمن الكاملة
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  إجمالي المديرين
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {admins.length}
                </p>
              </div>
              <span className="text-3xl text-blue-500">👥</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  المديرين النشطين
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {admins.filter((admin) => admin.isActive !== false).length}
                </p>
              </div>
              <span className="text-3xl text-green-500">✅</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">
                  السوبر أدمن
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {(() => {
                    const superAdminCount = admins.filter((admin) => {
                      console.log(
                        `🔍 Checking admin role: ${
                          admin.role
                        } (type: ${typeof admin.role})`
                      );
                      return admin.role === "SuperAdmin";
                    }).length;
                    console.log(
                      `👑 Total SuperAdmins found: ${superAdminCount}`
                    );
                    return superAdminCount;
                  })()}
                </p>
              </div>
              <span className="text-3xl text-yellow-500">👑</span>
            </div>
          </div>
        </div>

        {/* زر إضافة مدير جديد */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">➕</span>
              {showCreateForm ? "إلغاء" : "إضافة مدير جديد"}
            </span>
          </button>
        </div>

        {/* نموذج إضافة مدير جديد */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🆕</span>
              إنشاء حساب مدير جديد
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* الاسم */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="example@domain.com"
                  />
                </div>

                {/* رقم الهاتف مع كود البلد */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف (اختياري)
                  </label>
                  <div className="flex">
                    {/* اختيار كود البلد */}
                    <select
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleInputChange}
                      className="px-3 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>

                    {/* رقم الهاتف */}
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="1234567890"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    البلد المختار: {selectedCountry.flag} {selectedCountry.name}
                  </p>
                </div>

                {/* كلمة المرور */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="أدخل كلمة مرور قوية"
                  />
                </div>

                {/* الدور */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الدور *
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Admin">مدير</option>
                    <option value="SuperAdmin">سوبر أدمن</option>
                  </select>
                </div>
              </div>

              {/* الصفحات المسموحة - تظهر للأدمن العادي فقط */}
              {form.role === "Admin" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    الصفحات المسموحة *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availablePages.map((page) => (
                      <div key={page.key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={page.key}
                          checked={form.accessPages.includes(page.key)}
                          onChange={() => handleAccessPagesChange(page.key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={page.key}
                          className="mr-2 text-sm text-gray-700"
                        >
                          {page.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    اختر الصفحات التي يُسمح للأدمن بالوصول إليها
                  </p>
                </div>
              )}

              {/* رسالة للسوبر أدمن */}
              {form.role === "SuperAdmin" && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <span className="text-xl">👑</span>
                    <p className="text-sm font-medium">
                      السوبر أدمن لديه صلاحيات كاملة لجميع الصفحات تلقائياً
                    </p>
                  </div>
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإنشاء...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg">✨</span>
                      إنشاء الحساب
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 sm:flex-none bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* قائمة المديرين */}
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              قائمة المديرين
            </h2>
          </div>

          <div className="p-6">
            {loadingAdmins ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">جاري تحميل المديرين...</span>
                </div>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">👤</span>
                <p className="text-gray-500 text-lg">
                  لا توجد حسابات مديرين حتى الآن
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  قم بإضافة أول مدير باستخدام الزر أعلاه
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        المدير
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        البريد الإلكتروني
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        الهاتف
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        الدور
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        الصفحات المسموحة
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        الحالة
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {(admin.name || admin.userName)
                                ?.charAt(0)
                                ?.toUpperCase() || "؟"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {admin.name || admin.userName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(admin.createdAt).toLocaleDateString(
                                  "ar-EG"
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          <div className="break-all">{admin.email}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {admin.phone || (
                            <span className="text-gray-400">غير محدد</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              admin.role === "SuperAdmin"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {admin.role === "SuperAdmin" && <span>👑</span>}
                            {admin.role === "SuperAdmin" ? "سوبر أدمن" : "مدير"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {admin.role === "SuperAdmin" ? (
                            <span className="text-yellow-600 font-medium">
                              جميع الصفحات
                            </span>
                          ) : admin.accessPages &&
                            admin.accessPages.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {admin.accessPages.map((page) => {
                                const pageInfo = availablePages.find(
                                  (p) => p.key === page
                                );
                                return (
                                  <span
                                    key={page}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                                  >
                                    {pageInfo ? pageInfo.label : page}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              لا توجد صفحات
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              admin.isActive !== false
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {admin.isActive !== false ? (
                              <>
                                <span>✅</span>
                                نشط
                              </>
                            ) : (
                              <>
                                <span>❌</span>
                                غير نشط
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleDeleteAdmin(admin._id)}
                              className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg transition-colors"
                              title="حذف المدير"
                            >
                              <span className="text-lg">🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* قسم صلاحيات الأدوار */}
        <div className="bg-white rounded-xl shadow p-4 border mt-6">
          <h2 className="font-bold mb-2">صلاحيات الأدوار</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {Object.entries(roleToPermissions).map(([role, perms]) => (
              <div key={role} className="border rounded p-3 bg-gray-50">
                <h3 className="font-semibold text-blue-600 mb-2">
                  {roleLabels[role]}
                </h3>
                <ul className="space-y-1">
                  {perms.map((p) => (
                    <li key={p} className="text-gray-600">
                      • {permissionLabels[p] || p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
