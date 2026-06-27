"use client";

import React from "react";
import Image from "next/image";
import {
  XMarkIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import type { ToolDTO } from "@/types";

interface ToolDetailProps {
  tool: ToolDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare?: (tool: ToolDTO) => void;
  onAddToWorkflow?: (tool: ToolDTO) => void;
}

export default function ToolDetail({
  tool,
  isOpen,
  onClose,
  onCompare,
  onAddToWorkflow,
}: ToolDetailProps) {
  if (!tool || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-6 pt-16">
          {/* Logo & Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 flex items-center justify-center text-2xl font-bold">
              {tool.logo ? (
                <Image src={tool.logo} alt={tool.name} width={40} height={40} className="rounded-xl" />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {tool.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {tool.rating && (
                  <div className="flex items-center gap-1">
                    <StarSolid className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {tool.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                <Badge variant="default" size="sm">
                  {tool.pricing}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {tool.description}
          </p>

          {/* Website */}
          {tool.website && (
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 mb-6"
            >
              <GlobeAltIcon className="w-4 h-4" />
              Visit Website
            </a>
          )}

          {/* Capabilities */}
          {tool.capabilities && tool.capabilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Capabilities
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tool.capabilities.map((cap) => (
                  <Badge key={cap} variant="primary" size="sm">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {tool.categories && tool.categories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tool.categories.map((cat) => (
                  <Badge key={cat} variant="info" size="sm">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="space-y-4 mb-6">
            {tool.pros && tool.pros.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  Pros
                </h3>
                <ul className="space-y-1.5">
                  {tool.pros.map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.cons && tool.cons.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                  Cons
                </h3>
                <ul className="space-y-1.5">
                  {tool.cons.map((con, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <XCircleIcon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => onAddToWorkflow?.(tool)}
            >
              Add to Workflow
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => onCompare?.(tool)}
            >
              Compare Tool
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
