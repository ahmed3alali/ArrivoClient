// components/ErrorMessage.tsx
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message }) => (
  <div className="text-center py-16  rounded-lg shadow-sm mb-4">
    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
    <h2 className="text-xl font-semibold text-red-600 mb-2">
حدث خطأ اثناء تحميل البيانات 
    </h2>
    <p className="text-gray-600 max-w-md mx-auto">
    حاول اعادة تحميل الصفحة او تواصل مع خدمة العملاء حتى نساعدكم بكل سرور 
    </p>
  </div>
);
