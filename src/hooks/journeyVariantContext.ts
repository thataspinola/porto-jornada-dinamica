"use client";
import { createContext, useContext } from "react";
export const JourneyVariantContext = createContext<"web" | "app">("web");
export const useJourneyVariant = () => useContext(JourneyVariantContext);
