import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { roleLabels } from "../features/auth/roles";
import {
  permissionLabels,
  roleToPermissions,
} from "../features/auth/permissions";
import { tokenStorage } from "../api/client";
import apiClient from "../api/client";

const AdminAccess = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    address: "",
    role: "Admin",
    accessPages: [],
    countryCode: "+20", // كود البلد الافتراضي (مصر)
  });

  // قائمة الصفحات المتاحة للمسؤولين
  const availablePages = [
    { id: "userMenagment", label: "إدارة المستخدمين" },
    { id: "orderMenagment", label: "إدارة الطلبات" },
    { id: "complaintsMenagment", label: "إدارة الشكاوى" },
    { id: "reportsMenagment", label: "إدارة التقارير" },
    { id: "chatMenag", label: "إدارة المحادثات" },
  ];

  // قائمة البلدان مع أكوادها
  const countries = [
    { code: "+20", name: "مصر", flag: "🇪🇬" },
    { code: "+966", name: "السعودية", flag: "🇸🇦" },
    { code: "+971", name: "الإمارات", flag: "🇦🇪" },
    { code: "+965", name: "الكويت", flag: "🇰🇼" },
    { code: "+973", name: "البحرين", flag: "🇧🇭" },
    { code: "+974", name: "قطر", flag: "🇶🇦" },
    { code: "+968", name: "عُمان", flag: "🇴🇲" },
    { code: "+962", name: "الأردن", flag: "🇯🇴" },
    { code: "+961", name: "لبنان", flag: "🇱🇧" },
    { code: "+963", name: "سوريا", flag: "🇸🇾" },
    { code: "+964", name: "العراق", flag: "🇮🇶" },
    { code: "+967", name: "اليمن", flag: "🇾🇪" },
    { code: "+212", name: "المغرب", flag: "🇲🇦" },
    { code: "+213", name: "الجزائر", flag: "🇩🇿" },
    { code: "+216", name: "تونس", flag: "🇹🇳" },
    { code: "+218", name: "ليبيا", flag: "🇱🇾" },
    { code: "+249", name: "السودان", flag: "🇸🇩" },
    { code: "+1", name: "الولايات المتحدة", flag: "🇺🇸" },
    { code: "+44", name: "المملكة المتحدة", flag: "🇬🇧" },
    { code: "+33", name: "فرنسا", flag: "🇫🇷" },
    { code: "+49", name: "ألمانيا", flag: "🇩🇪" },
    { code: "+39", name: "إيطاليا", flag: "🇮🇹" },
    { code: "+34", name: "إسبانيا", flag: "🇪🇸" },
    { code: "+7", name: "روسيا", flag: "🇷🇺" },
    { code: "+86", name: "الصين", flag: "🇨🇳" },
    { code: "+81", name: "اليابان", flag: "🇯🇵" },
    { code: "+82", name: "كوريا الجنوبية", flag: "🇰🇷" },
    { code: "+91", name: "الهند", flag: "🇮🇳" },
    { code: "+92", name: "باكستان", flag: "🇵🇰" },
    { code: "+90", name: "تركيا", flag: "🇹🇷" },
  ];

  // الحصول على المستخدم الحالي
  const currentUser = tokenStorage.getUser();

  const isSuper = useMemo(
    () => currentUser?.role === "SuperAdmin",
    [currentUser]
  );

  // تحميل قائمة المسؤولين من الAPI
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/user");
      // فلترة المستخدمين للحصول على المسؤولين فقط (Admin و SuperAdmin)
      const allUsers = response.data.users || [];
      const adminUsers = allUsers.filter(
        (user) => user.role === "Admin" || user.role === "SuperAdmin"
      );
      setAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("فشل في تحميل قائمة المسؤولين");
    } finally {
      setLoading(false);
    }
  };

  // إضافة مسؤول جديد
  const addAdmin = async (e) => {
    e.preventDefault();
    if (!isSuper) {
      toast.error("فقط السوبر أدمن يمكنه إضافة مسؤولين");
      return;
    }

    try {
      setSubmitting(true);

      // تحضير بيانات الإنشاء
      const createAccountData = {
        userName: form.userName,
        email: form.email,
        role: form.role,
      };

      // إضافة الهاتف إذا كان موجوداً وبصيغة صحيحة
      if (form.phone && form.phone.trim()) {
        let phoneNumber = form.phone.trim();

        // التأكد من أن الرقم يبدأ بكود البلد المختار
        if (!phoneNumber.startsWith("+")) {
          // إزالة أي أصفار في البداية
          phoneNumber = phoneNumber.replace(/^0+/, "");
          // إضافة كود البلد المختار
          phoneNumber = form.countryCode + phoneNumber;
        }

        createAccountData.phone = phoneNumber;
      }

      // إضافة العنوان إذا كان موجوداً
      if (form.address && form.address.trim()) {
        createAccountData.address = form.address.trim();
      }

      // إضافة accessPages فقط للأدمن (وليس SuperAdmin)
      if (form.role === "Admin") {
        createAccountData.accessPages = form.accessPages;
      }

      const response = await apiClient.post(
        "/auth/createAccount",
        createAccountData
      );

      if (response.data.message === "Done") {
        toast.success(
          `تم إنشاء حساب ${
            form.role === "SuperAdmin" ? "السوبر أدمن" : "الأدمن"
          } بنجاح`
        );
        setForm({
          userName: "",
          email: "",
          phone: "",
          address: "",
          role: "Admin",
          accessPages: [],
          countryCode: "+20",
        });
        // إعادة تحميل قائمة المسؤولين
        await fetchAdmins();
      }
    } catch (error) {
      console.error("Error adding admin:", error);

      // معالجة خطأ البريد الإلكتروني المكرر (409)
      if (error.response?.status === 409) {
        toast.error(
          "هذا البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر."
        );
        return;
      }

      // معالجة أخطاء التحقق من صحة البيانات
      if (error.response?.data?.validationError) {
        const validationErrors = error.response.data.validationError;
        const phoneError = validationErrors.find(
          (err) => err.path && err.path.includes("phone")
        );

        if (phoneError) {
          toast.error(
            "رقم الهاتف يجب أن يكون بصيغة دولية صحيحة. مثال: +201012345678"
          );
        } else {
          const firstError = validationErrors[0];
          toast.error(firstError.message || "خطأ في التحقق من البيانات");
        }
      } else {
        const errorMessage =
          error.response?.data?.message || "فشل في إضافة المسؤول";
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // حذف مسؤول
  const removeAdmin = async (adminId) => {
    if (!isSuper) {
      toast.error("فقط السوبر أدمن يمكنه حذف المسؤولين");
      return;
    }

    if (!confirm("هل أنت متأكد من حذف هذا المسؤول؟")) {
      return;
    }

    // حالياً، لا يوجد endpoint لحذف المستخدمين في API
    toast.error(
      "حذف المستخدمين غير متاح حالياً في API. يرجى التواصل مع المطور."
    );
    console.log("Admin ID for deletion:", adminId); // للاستخدام عندما يصبح endpoint متاحاً
  };

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    fetchAdmins();
  }, []);

  // إنشاء خريطة الصلاحيات للعرض
  const permissionsDisplay = useMemo(() => {
    return Object.entries(roleToPermissions).map(([role, permissions]) => ({
      role,
      roleLabel: roleLabels[role] || role,
      permissions: permissions.map((permission) => ({
        permission,
        label: permissionLabels[permission] || permission,
      })),
    }));
  }, []);

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">
          إدارة المسؤولين والصلاحيات
        </h1>
        {isSuper && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <span className="text-lg md:text-2xl">👑</span>
            <div>
              <p className="font-bold text-yellow-800 text-sm">
                صلاحية سوبر أدمن
              </p>
              <p className="text-xs text-yellow-700">جميع الوظائف متاحة لك</p>
            </div>
          </div>
        )}
      </div>

      {/* لوحة معلومات SuperAdmin */}
      {isSuper && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl md:text-3xl">👑</span>
            <div>
              <h3 className="font-bold text-lg text-yellow-800">
                مرحباً بك، سوبر أدمن!
              </h3>
              <p className="text-yellow-700 text-sm">
                لديك صلاحية كاملة لإدارة النظام
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-users text-blue-500"></i>
                <h4 className="font-semibold text-sm">إدارة المسؤولين</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• إضافة مسؤولين جدد</li>
                <li>• عرض جميع المسؤولين</li>
                <li>• حذف المسؤولين (عندما يصبح متاحاً)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-shield-alt text-green-500"></i>
                <h4 className="font-semibold text-sm">الصلاحيات الكاملة</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• الوصول لجميع الصفحات</li>
                <li>• إدارة المستخدمين</li>
                <li>• عرض جميع التقارير</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-cog text-purple-500"></i>
                <h4 className="font-semibold text-sm">إعدادات النظام</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• تحديث إعدادات الموقع</li>
                <li>• إدارة قاعدة البيانات</li>
                <li>• إعدادات الأمان</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* رسالة تحذيرية للمستخدمين غير المخولين */}
      {!isSuper && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-red-500"></i>
            <h3 className="font-bold text-red-800">غير مخول للوصول</h3>
          </div>
          <p className="text-red-700 mt-2">
            فقط المستخدمون بصلاحية &quot;SuperAdmin&quot; يمكنهم إدارة
            المسؤولين.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4 md:gap-6">
        {/* نموذج إضافة مسؤول */}
        <div
          className={`bg-white rounded-xl shadow-sm p-4 md:p-6 border xl:col-span-1 ${
            isSuper ? "border-yellow-300" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            {isSuper && <span className="text-lg">👑</span>}
            <h2 className="font-bold">إضافة مسؤول جديد</h2>
            {isSuper && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                متاح للسوبر أدمن
              </span>
            )}
          </div>

          {!isSuper && (
            <div className="text-sm text-red-600 mb-3 bg-red-50 p-3 rounded border border-red-200">
              <i className="fas fa-lock mr-2"></i>
              فقط السوبر أدمن يمكنه إضافة/حذف المسؤولين
            </div>
          )}

          {isSuper && (
            <div className="text-sm text-green-600 mb-3 bg-green-50 p-3 rounded border border-green-200">
              <i className="fas fa-check-circle mr-2"></i>
              أنت تملك صلاحية كاملة لإضافة المسؤولين
            </div>
          )}

          <form onSubmit={addAdmin} className="flex flex-col gap-3">
            <input
              className="border rounded-lg px-3 py-2 disabled:bg-gray-100"
              placeholder="اسم المستخدم"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              disabled={!isSuper || submitting}
              required
            />
            <input
              className="border rounded-lg px-3 py-2 disabled:bg-gray-100"
              placeholder="البريد الإلكتروني"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!isSuper || submitting}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                رقم الهاتف (اختياري)
              </label>
              <div className="flex gap-2">
                <select
                  className="border rounded-lg px-2 py-2 disabled:bg-gray-100 w-32 text-sm"
                  value={form.countryCode}
                  onChange={(e) =>
                    setForm({ ...form, countryCode: e.target.value })
                  }
                  disabled={!isSuper || submitting}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  className="border rounded-lg px-3 py-2 disabled:bg-gray-100 flex-1"
                  placeholder="رقم الهاتف"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={!isSuper || submitting}
                />
              </div>
              <div className="text-xs text-gray-600">
                اختر البلد من القائمة واكتب رقم الهاتف (بدون كود البلد). مثال:
                1012345678
              </div>
            </div>

            <input
              className="border rounded-lg px-3 py-2 disabled:bg-gray-100"
              placeholder="العنوان (اختياري)"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              disabled={!isSuper || submitting}
            />

            <select
              className="border rounded-lg px-3 py-2 disabled:bg-gray-100"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value, accessPages: [] })
              }
              disabled={!isSuper || submitting}
            >
              <option value="Admin">أدمن</option>
              <option value="SuperAdmin">سوبر أدمن</option>
            </select>

            {/* قسم اختيار الصفحات للأدمن فقط */}
            {form.role === "Admin" && (
              <div className="border rounded-lg p-3 bg-gray-50">
                <label className="block text-sm font-medium mb-2">
                  الصفحات المسموح بالوصول إليها:
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availablePages.map((page) => (
                    <label key={page.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.accessPages.includes(page.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              accessPages: [...form.accessPages, page.id],
                            });
                          } else {
                            setForm({
                              ...form,
                              accessPages: form.accessPages.filter(
                                (p) => p !== page.id
                              ),
                            });
                          }
                        }}
                        disabled={!isSuper || submitting}
                        className="rounded"
                      />
                      <span className="text-sm">{page.label}</span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  اختر الصفحات التي يمكن للأدمن الوصول إليها
                </div>
              </div>
            )}

            {/* رسالة تحذيرية للسوبر أدمن */}
            {form.role === "SuperAdmin" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">👑</span>
                  <span className="text-sm font-medium text-yellow-800">
                    إنشاء سوبر أدمن
                  </span>
                </div>
                <p className="text-xs text-yellow-700">
                  السوبر أدمن له صلاحية الوصول لجميع الصفحات تلقائياً
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isSuper || submitting}
              className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 ${
                isSuper && !submitting
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  إضافة مسؤول
                </>
              )}
            </button>
          </form>
        </div>

        {/* قائمة المسؤولين */}
        <div
          className={`bg-white rounded-xl shadow-sm p-4 md:p-6 border xl:col-span-2 lg:col-span-1 ${
            isSuper ? "border-yellow-300" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2">
              {isSuper && <span className="text-lg">👑</span>}
              <h2 className="font-bold">قائمة المسؤولين</h2>
              {isSuper && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                  عرض كامل للسوبر أدمن
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isSuper && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                  <i className="fas fa-eye mr-1"></i>
                  يمكنك رؤية جميع المسؤولين
                </span>
              )}
              <button
                onClick={fetchAdmins}
                disabled={loading}
                className="text-blue-500 hover:text-blue-700 disabled:text-gray-400 p-2"
                title="تحديث القائمة"
              >
                <i
                  className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`}
                ></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">جاري تحميل المسؤولين...</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          اسم المستخدم
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          البريد الإلكتروني
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الدور
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          تاريخ الإنشاء
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            لا توجد مسؤولين مسجلين
                          </td>
                        </tr>
                      ) : (
                        admins.map((admin, idx) => (
                          <tr key={admin._id} className="hover:bg-gray-50">
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                              <div className="font-medium">
                                {admin.userName}
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-center hidden sm:table-cell">
                              <div className="break-all text-xs">
                                {admin.email}
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-center">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  admin.role === "SuperAdmin"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {admin.role === "SuperAdmin"
                                  ? "سوبر أدمن 👑"
                                  : "أدمن"}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500 text-center hidden md:table-cell">
                              {admin.createdAt
                                ? new Date(admin.createdAt).toLocaleDateString(
                                    "ar-EG"
                                  )
                                : "غير محدد"}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-center">
                              {admin.role !== "SuperAdmin" ? (
                                <div className="flex flex-col gap-1">
                                  <button
                                    disabled={!isSuper}
                                    onClick={() => removeAdmin(admin._id)}
                                    className={`px-3 py-1 rounded text-xs flex items-center justify-center gap-1 ${
                                      isSuper
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    }`}
                                    title={
                                      isSuper
                                        ? "حذف المسؤول"
                                        : "تحتاج صلاحية سوبر أدمن"
                                    }
                                  >
                                    <i className="fas fa-trash"></i>
                                    <span className="hidden sm:inline">
                                      حذف
                                    </span>
                                  </button>
                                  {!isSuper && (
                                    <span className="text-xs text-gray-400 hidden md:block">
                                      يتطلب صلاحية سوبر أدمن
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                                    👑 محمي
                                  </span>
                                  <span className="text-xs text-gray-400 hidden md:block">
                                    لا يمكن حذف السوبر أدمن
                                  </span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border mt-6">
        <h2 className="font-bold mb-4">صلاحيات الأدوار</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissionsDisplay.map(({ role, roleLabel, permissions }) => (
            <div key={role} className="border rounded-lg p-4">
              <h3 className="font-bold mb-2 text-lg">{roleLabel}</h3>
              <ul className="space-y-1">
                {permissions.map(({ permission, label }) => (
                  <li
                    key={permission}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-green-500">•</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
