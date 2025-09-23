# الفصل الكامل لـ API - Complete API Refactoring

## نظرة عامة

تم فصل جميع دوال API إلى ملفات منفصلة لتحسين التنظيم والوضوح وسهولة الصيانة.

## هيكل الملفات الجديد

### 📁 Authentication (المصادقة)

```
src/features/auth/api/
├── signup.js          # تسجيل حساب جديد
├── signin.js          # تسجيل الدخول
└── logout.js          # تسجيل الخروج
```

### 📁 Email Verification (التحقق من البريد الإلكتروني)

```
src/features/auth/api/
├── confirmEmail.js    # تأكيد البريد الإلكتروني
└── resendCode.js      # إعادة إرسال رمز التحقق
```

### 📁 FCM (Firebase Cloud Messaging)

```
src/features/auth/api/
├── fcmToken.js        # تحديث FCM token واحد
└── fcmMultiple.js     # تحديث FCM tokens متعددة
```

### 📁 Location Services (خدمات الموقع)

```
src/features/auth/api/
├── newLocation.js     # إضافة موقع جديد
├── readMyLocation.js  # قراءة موقعي
└── readOtherLocation.js # قراءة موقع مستخدم آخر
```

### 📁 Password Management (إدارة كلمة المرور)

```
src/features/auth/api/
├── forgetCode.js      # إرسال والتحقق من رمز النسيان
├── resetPassword.js   # إعادة تعيين كلمة المرور
└── refreshToken.js    # تحديث التوكن
```

### 📁 Social Login (تسجيل الدخول الاجتماعي)

```
src/features/auth/api/
├── social.js          # تسجيل الدخول الاجتماعي
└── index.js           # ملف التصدير الرئيسي
```

## تفاصيل كل ملف

### 🔐 Authentication Files

#### `signup.js`

```javascript
export const signup = async (payload) => {
  // تسجيل حساب جديد
  // POST /auth/signup
};
```

#### `signin.js`

```javascript
export const signin = async (payload) => {
  // تسجيل الدخول
  // POST /auth/signin
};
```

#### `logout.js`

```javascript
export const logout = async () => {
  // تسجيل الخروج
  // POST /auth/logout
  // حذف البيانات المحفوظة
};
```

### 📧 Email Verification Files

#### `confirmEmail.js`

```javascript
export const confirmEmail = async (payload) => {
  // تأكيد البريد الإلكتروني
  // POST /auth/confirmEmail
};
```

#### `resendCode.js`

```javascript
export const resendCode = async (payload) => {
  // إعادة إرسال رمز التحقق
  // POST /auth/resendCode
};
```

### 🔔 FCM Files

#### `fcmToken.js`

```javascript
export const updateFcmToken = async (payload) => {
  // تحديث FCM token واحد
  // POST /auth/fcm
  // payload: { fcmToken }
};
```

#### `fcmMultiple.js`

```javascript
export const updateFcmMultiple = async (payload) => {
  // تحديث FCM tokens متعددة
  // POST /auth/fcm-multiple
  // payload: { tokens: [] }
};
```

### 📍 Location Files

#### `newLocation.js`

```javascript
export const newLocation = async (payload) => {
  // إضافة موقع جديد
  // POST /auth/location
};
```

#### `readMyLocation.js`

```javascript
export const readMyLocation = async () => {
  // قراءة موقعي
  // GET /auth/location/me
};
```

#### `readOtherLocation.js`

```javascript
export const readOtherLocation = async (userId) => {
  // قراءة موقع مستخدم آخر
  // GET /auth/location/{userId}
};
```

### 🔑 Password Management Files

#### `forgetCode.js`

```javascript
export const sendForgetCode = async (payload) => {
  // إرسال رمز استرجاع كلمة المرور
  // PATCH /auth/sendForgetCode
};

export const checkForgetCode = async (payload) => {
  // التحقق من رمز استرجاع كلمة المرور
  // PATCH /auth/checkForgetCode
};
```

#### `resetPassword.js`

```javascript
export const resetPassword = async (payload) => {
  // إعادة تعيين كلمة المرور
  // PATCH /auth/forgetPassword
};
```

#### `refreshToken.js`

```javascript
export const refreshToken = async () => {
  // تحديث التوكن
  // POST /auth/refreshToken
};
```

### 🌐 Social Login Files

#### `social.js`

```javascript
export const socialLogin = async (provider, payload) => {
  // تسجيل الدخول الاجتماعي
  // POST /auth/social/{provider}
};
```

## كيفية الاستخدام

### استيراد دالة واحدة:

```javascript
import { signin } from "../api/signin";
import { updateFcmToken } from "../api/fcmToken";
import { newLocation } from "../api/newLocation";
```

### استيراد من ملف index.js:

```javascript
import {
  signin,
  signup,
  updateFcmToken,
  newLocation,
  sendForgetCode,
  checkForgetCode,
  resetPassword,
} from "../api";
```

### استيراد جميع دوال فئة معينة:

```javascript
// جميع دوال المصادقة
import { signin, signup, logout } from "../api";

// جميع دوال FCM
import { updateFcmToken, updateFcmMultiple } from "../api";

// جميع دوال الموقع
import { newLocation, readMyLocation, readOtherLocation } from "../api";
```

## فوائد الفصل

### ✅ التنظيم

- كل ملف له مسؤولية محددة
- سهولة العثور على الدوال المطلوبة
- هيكل واضح ومنطقي

### ✅ الصيانة

- تعديل دالة واحدة لا يؤثر على الأخرى
- سهولة إضافة دوال جديدة
- سهولة اختبار كل دالة منفصلة

### ✅ القراءة

- كود أوضح وأسهل للفهم
- تعليقات محددة لكل دالة
- معالجة أخطاء محسنة

### ✅ إعادة الاستخدام

- استيراد الدوال المطلوبة فقط
- تقليل حجم الحزمة
- تحسين الأداء

## الملفات المحذوفة

تم حذف الملفات التالية بعد الفصل:

- `fcm.js` → `fcmToken.js` + `fcmMultiple.js`
- `location.js` → `newLocation.js` + `readMyLocation.js` + `readOtherLocation.js`
- `password.js` → `resetPassword.js` + `refreshToken.js`

## التوافق مع الكود الموجود

- جميع الاستيرادات السابقة لا تزال تعمل
- نفس واجهة الدوال
- نفس السلوك والوظائف
- لا توجد تغييرات في المكونات
