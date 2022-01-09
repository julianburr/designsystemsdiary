import { useRouter } from "next/router";
import { useEffect } from "react";

export function pageview(url: string) {
  window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  });
}

export function event({ action, params }: { action: string; params: any }) {
  window.gtag("event", action, params);
}

export function usePageView() {
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeComplete", pageview);
    return () => {
      router.events.off("routeChangeComplete", pageview);
    };
  }, [router.events]);
}
