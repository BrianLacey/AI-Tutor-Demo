"use client"

import { createContext } from "react";
import { IGlobalContext } from "@/lib/types";

export const GlobalContext = createContext<IGlobalContext | null>(null);
