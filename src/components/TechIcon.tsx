"use client";

import React from "react";
import {
  Code2,
  Database,
  Server,
  Globe,
  Palette,
  Layers,
  Cloud,
  Box,
  Cpu,
  GitBranch,
  FileCode,
  Workflow,
  Shield,
  Terminal,
  Smartphone,
  Layout,
  Flame,
  Zap,
  Sparkles,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Database,
  Server,
  Globe,
  Palette,
  Layers,
  Cloud,
  Box,
  Cpu,
  GitBranch,
  FileCode,
  Workflow,
  Shield,
  Terminal,
  Smartphone,
  Layout,
  Flame,
  Zap,
  Sparkles,
};

interface TechIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function TechIcon({ name, className = "w-5 h-5", size }: TechIconProps) {
  const IconComponent = ICON_MAP[name] || Code2;
  return <IconComponent className={className} size={size} />;
}
