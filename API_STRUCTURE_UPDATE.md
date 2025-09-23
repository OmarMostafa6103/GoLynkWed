# تحديث هيكل API - API Structure Update

## التغييرات المطبقة

تم فصل دوال استرجاع كلمة المرور إلى ملفات منفصلة لتحسين التنظيم والوضوح.

### الملفات الجديدة:

#### 1. `src/features/auth/api/forgetCode.js`

يحتوي على دوال إرسال والتحقق من رمز استرجاع كلمة المرور:

```javascript
// إرسال رمز استرجاع كلمة المرور
export const sendForgetCode = async (payload) => {
  // إرسال طلب PATCH إلى /auth/sendForgetCode
};

// التحقق من رمز استرجاع كلمة المرور
export const checkForgetCode = async (payload) => {
  // إرسال طلب PATCH إلى /auth/checkForgetCode
};
```

#### 2. `src/features/auth/api/password.js` (محدث)

يحتوي على دوال إعادة تعيين كلمة المرور وتحديث التوكن:

```javascript
// إعادة تعيين كلمة المرور
export const resetPassword = async (payload) => {
  // إرسال طلب PATCH إلى /auth/forgetPassword
};

// تحديث التوكن
export const refreshToken = async () => {
  // إرسال طلب POST إلى /auth/refreshToken
};
```

### الملفات المحدثة:

#### 1. `src/features/auth/api/index.js`

تم تحديث التصدير ليشمل الملفات الجديدة:

```javascript
// تصدير دوال رمز النسيان
export { sendForgetCode, checkForgetCode } from "./forgetCode";

// تصدير دوال كلمة المرور
export { resetPassword, refreshToken } from "./password";
```

#### 2. `src/features/auth/components/ForgotPassword.jsx`

تم تحديث الاستيراد:

```javascript
// استيراد دوال رمز النسيان
import { sendForgetCode, checkForgetCode } from "../api/forgetCode";

// استيراد دالة إعادة تعيين كلمة المرور
import { resetPassword } from "../api/password";
```

## فوائد التحديث:

1. **تنظيم أفضل**: فصل المسؤوليات بين إرسال/التحقق من الرمز وإعادة تعيين كلمة المرور
2. **وضوح الكود**: كل ملف له مسؤولية محددة
3. **سهولة الصيانة**: يمكن تعديل كل جزء بشكل منفصل
4. **إعادة الاستخدام**: يمكن استيراد الدوال المطلوبة فقط

## كيفية الاستخدام:

### في المكونات:

```javascript
// استيراد دوال رمز النسيان فقط
import { sendForgetCode, checkForgetCode } from "../api/forgetCode";

// استيراد دالة إعادة تعيين كلمة المرور فقط
import { resetPassword } from "../api/password";
```

### من ملف index.js:

```javascript
// استيراد جميع الدوال
import {
  sendForgetCode,
  checkForgetCode,
  resetPassword,
  refreshToken,
} from "../api";
```

## التوافق مع الكود الموجود:

- جميع الاستيرادات السابقة لا تزال تعمل
- لا توجد تغييرات في واجهة الدوال
- نفس السلوك والوظائف
