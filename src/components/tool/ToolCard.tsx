"use client";

import React from "react";
import Image from "next/image";
import { StarIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/Card";
import Badge from "../ui/Badge";
import type { ToolDTO } from "@/types";

interface ToolCardProps {
  tool: ToolDTO;
  onClick?: (tool: ToolDTO) => void;
  className?: string;
  compact?: boolean;
}

const pricingColors: Record<string, { label: string; variant: "success" | "warning" | "info" | "default" }> = {
  free: { label: "Free", variant: "success" },
  freemium: { label: "Freemium", variant: "info" },
  paid: { label: "Paid", variant: "warning" },
  enterprise: { label: "Enterprise", variant: "default" },
};

export default function ToolCard({ tool, onClick, className, compact = false }: ToolCardProps) {
  const pricing = pricingColors[tool.pricing ?? "freemium"] || pricingColors.freemium;

  if (compact) {
    return (
      <div
        className={twMerge(
          "flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50",
          "cursor-pointer hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-200",
          className
        )}
        onClick={() => onClick?.(tool)}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 flex items-center justify-center text-lg flex-shrink-0">
          {tool.logo ? (
            <Image src={tool.logo} alt={tool.name} width={24} height={24} className="rounded" />
          ) : (
            tool.name.charAt(0)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {tool.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {tool.categories?.slice(0, 2).join(" · ")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card hover padding="md" onClick={() => onClick?.(tool)} className={className}>
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/40 dark:to-accent-900/40 flex items-center justify-center text-xl">
          {tool.logo ? (
            <Image src={tool.logo} alt={tool.name} width={32} height={32} className="rounded-lg" />
          ) : (
            tool.name.charAt(0)
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pricing.variant} size="sm">
            {pricing.label}
          </Badge>
          {tool.rating && (
            <div className="flex items-center gap-1 text-amber-400">
              <StarIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {tool.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardTitle className="mb-1">{tool.name}</CardTitle>
      <CardDescription>{tool.description}</CardDescription>

      {tool.capabilities && tool.capabilities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tool.capabilities.slice(0, 3).map((cap) => (
            <Badge key={cap} variant="primary" size="sm">
              {cap}
            </Badge>
          ))}
          {tool.capabilities.length > 3 && (
            <Badge variant="default" size="sm">
              +{tool.capabilities.length - 3}
            </Badge>
          )}
        </div>
      )}

      <CardFooter>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {tool.categories?.slice(0, 2).join(" · ")}
        </span>
        <ArrowTrendingUpIcon className="w-4 h-4 text-gray-300 dark:text-gray-600" />
      </CardFooter>
    </Card>
  );
}
