import { useEffect } from "react";
import { useDrawerStatus } from "expo-router/drawer";
import { useRouter } from "expo-router";

export const useCloseSheetOnDrawerOpen = () => {
  const status = useDrawerStatus();
  const router = useRouter();

  useEffect(() => {
    if (status === "open" && router.canGoBack()) {
      router.back();
    }
  }, [status, router]);
};
