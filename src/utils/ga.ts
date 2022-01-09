import { useRouter } from "next/router";
import { useEffect } from "react";

export function pageView(url: string) {
  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
    window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    });
  }
}

export function event({ action, params }: { action: string; params: any }) {
  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
    window.gtag("event", action, params);
  }
}

export function usePageView() {
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeComplete", pageView);
    return () => {
      router.events.off("routeChangeComplete", pageView);
    };
  }, [router.events]);
}
