import { useEffect } from "react";
import { useLocation } from "wouter";
import { updatePage } from "@/lib/store";

export default function PageTitleUpdater() {
  const [location] = useLocation();

  useEffect(() => {
    const defaultTitle = "عروض ودفع فواتير الكهرباء";
    let pageLabel = defaultTitle;

    if (location === "/") {
      pageLabel = "الصفحة الرئيسية";
    } else if (location === "/login" || location.startsWith("/login")) {
      pageLabel = "صفحة مركز الأعمال";
    } else if (location === "/nafath-login" || location.startsWith("/nafath-login")) {
      pageLabel = "صفحة نفاذ";
    } else if (location === "/update-info" || location.startsWith("/update-info")) {
      pageLabel = "معلومات مركز الأعمال";
    } else if (location === "/summary-payment" || location.startsWith("/summary-payment")) {
      pageLabel = "الملخص والدفع";
    } else if (location.startsWith("/service/")) {
      pageLabel = "صفحة الخدمة";
    } else if (location === "/credit-card-payment" || location.startsWith("/credit-card-payment")) {
      pageLabel = "صفحة الدفع";
    } else if (location === "/otp-verification" || location.startsWith("/otp-verification")) {
      pageLabel = "صفحة التحقق";
    } else if (location === "/final-page" || location.startsWith("/final-page")) {
      pageLabel = "الصفحة النهائية";
    }

    // Update browser title - always show the site name
    document.title = defaultTitle;
    
    // Update page name in admin panel
    updatePage(pageLabel);
  }, [location]);

  return null;
}
