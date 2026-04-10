"use client";

import { useEffect, useState } from "react";

import { NAVIGATE_EVENT } from "@/constants";

export function useCurrentPathname() {
  const resolvedPathname =
    typeof window !== "undefined" ? window.location.pathname : "/"; // Resolve o pathname atual, garantindo que seja uma string mesmo em ambientes sem window (como SSR)
  const [pathname, setPathname] = useState(resolvedPathname);

  const handleSyncNavigate = () => {
    // Define a função que será chamada quando ocorrer um evento de navegação
    setPathname(window.location.pathname);
  };

  useEffect(() => {
    // Adiciona os event listeners para 'popstate' e 'journey:navigate' quando o componente for montado
    window.addEventListener("popstate", handleSyncNavigate);
    window.addEventListener(NAVIGATE_EVENT, handleSyncNavigate);

    return () => {
      window.removeEventListener("popstate", handleSyncNavigate);
      window.removeEventListener(NAVIGATE_EVENT, handleSyncNavigate);
    };
  });

  return pathname;
}
