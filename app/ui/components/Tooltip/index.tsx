"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Info, HelpCircle, AlertCircle } from "lucide-react"

interface CustomTooltipProps {
  content: React.ReactNode | string
  children?: React.ReactNode
  placement?: "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end"
  trigger?: "hover" | "click" | "focus"
  icon?: "info" | "help" | "warning" | "error" | "none"
  iconSize?: number
  maxWidth?: number
  disabled?: boolean
  arrow?: boolean
  delay?: number
  className?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  children,
  placement = "top",
  trigger = "hover",
  icon = "info",
  iconSize = 16,
  maxWidth = 320,
  disabled = false,
  arrow = true,
  delay = 0,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let top = 0
    let left = 0

    switch (placement) {
      case "top":
        top = triggerRect.top + scrollTop - tooltipRect.height - 8
        left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case "bottom":
        top = triggerRect.bottom + scrollTop + 8
        left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case "left":
        top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8
        break
      case "right":
        top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.right + scrollLeft + 8
        break
      case "top-start":
        top = triggerRect.top + scrollTop - tooltipRect.height - 8
        left = triggerRect.left + scrollLeft
        break
      case "top-end":
        top = triggerRect.top + scrollTop - tooltipRect.height - 8
        left = triggerRect.right + scrollLeft - tooltipRect.width
        break
      case "bottom-start":
        top = triggerRect.bottom + scrollTop + 8
        left = triggerRef.current.offsetLeft
        break
      case "bottom-end":
        top = triggerRect.bottom + scrollTop + 8
        left = triggerRect.right + scrollLeft - tooltipRect.width
        break
    }

    // Keep tooltip within viewport
    const padding = 8
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < padding) left = padding
    if (left + tooltipRect.width > viewportWidth - padding) {
      left = viewportWidth - tooltipRect.width - padding
    }
    if (top < padding + scrollTop) top = padding + scrollTop
    if (top + tooltipRect.height > viewportHeight - padding + scrollTop) {
      top = viewportHeight - tooltipRect.height - padding + scrollTop
    }

    setPosition({ top, left })
  }

  const handleOpen = () => {
    if (disabled) return
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setOpen(true), delay)
    } else {
      setOpen(true)
    }
  }

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpen(false)
  }

  const handleToggle = () => {
    if (disabled) return
    if (open) {
      handleClose()
    } else {
      handleOpen()
    }
  }

  useEffect(() => {
    if (open && mounted) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        calculatePosition()
      }, 10)

      const handleResize = () => calculatePosition()
      const handleScroll = () => calculatePosition()

      window.addEventListener("resize", handleResize)
      window.addEventListener("scroll", handleScroll, true)

      return () => {
        clearTimeout(timer)
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("scroll", handleScroll, true)
      }
    }
  }, [open, placement, mounted])

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      trigger === "click" &&
      open &&
      triggerRef.current &&
      tooltipRef.current &&
      !triggerRef.current.contains(event.target as Node) &&
      !tooltipRef.current.contains(event.target as Node)
    ) {
      handleClose()
    }
  }

  if (mounted) {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }
}, [open, trigger, mounted])


  const renderIcon = () => {
    const iconProps = { size: iconSize }
    const iconClasses = {
      info: "text-blue-500",
      help: "text-teal-600",
      warning: "text-amber-500",
      error: "text-red-500",
    }

    switch (icon) {
      case "info":
        return <Info {...iconProps} className={iconClasses.info} />
      case "help":
        return <HelpCircle {...iconProps} className={iconClasses.help} />
      case "warning":
        return <AlertCircle {...iconProps} className={iconClasses.warning} />
      case "error":
        return <AlertCircle {...iconProps} className={iconClasses.error} />
      default:
        return null
    }
  }

  const renderContent = () => {
    if (typeof content === "string") {
      // Parse string content for basic HTML-like formatting
      const parts = content.split(/(\[link\](.*?)\[\/link\])/g)
      return (
        <div className="prose prose-sm max-w-none">
          {parts.map((part, index) => {
            if (part.startsWith("[link]") && part.endsWith("[/link]")) {
              const linkText = part.replace(/\[link\]|\[\/link\]/g, "")
              const [text, url] = linkText.split("|")
              return (
                <a
                  key={index}
                  href={url || text}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 font-medium no-underline hover:underline transition-colors"
                >
                  {text}
                </a>
              )
            }
            return <span key={index}>{part}</span>
          })}
        </div>
      )
    }
    return (
      <div className="prose prose-sm max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-teal-600 [&_a]:font-medium [&_a]:no-underline hover:[&_a]:underline hover:[&_a]:text-teal-700 [&_a]:transition-colors [&_ul]:mb-2 [&_ul:last-child]:mb-0 [&_ul]:pl-4 [&_li]:mb-1 [&_li:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_em]:italic [&_em]:text-gray-600">
        {content}
      </div>
    )
  }

  const getArrowClasses = () => {
    if (!arrow) return ""

    const arrowClasses = {
      top: "after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-r-[6px] after:border-t-[6px] after:border-l-transparent after:border-r-transparent after:border-t-gray-200 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-l-[6px] before:border-r-[6px] before:border-t-[6px] before:border-l-transparent before:border-r-transparent before:border-t-white before:mt-[-1px]",
      bottom:
        "after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-r-[6px] after:border-b-[6px] after:border-l-transparent after:border-r-transparent after:border-b-gray-200 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-l-[6px] before:border-r-[6px] before:border-b-[6px] before:border-l-transparent before:border-r-transparent before:border-b-white before:mb-[-1px]",
      left: "after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-t-[6px] after:border-b-[6px] after:border-l-[6px] after:border-t-transparent after:border-b-transparent after:border-l-gray-200 before:content-[''] before:absolute before:left-full before:top-1/2 before:-translate-y-1/2 before:border-t-[6px] before:border-b-[6px] before:border-l-[6px] before:border-t-transparent before:border-b-transparent before:border-l-white before:ml-[-1px]",
      right:
        "after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-t-[6px] after:border-b-[6px] after:border-r-[6px] after:border-t-transparent after:border-b-transparent after:border-r-gray-200 before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-t-[6px] before:border-b-[6px] before:border-r-[6px] before:border-t-transparent before:border-b-transparent before:border-r-white before:mr-[-1px]",
    }

    const baseDirection = placement.split("-")[0] as keyof typeof arrowClasses
    return arrowClasses[baseDirection] || ""
  }

  const triggerElement = children || (
    <button
      type="button"
      className="inline-flex items-center justify-center p-1 text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      disabled={disabled}
    >
      {renderIcon()}
    </button>
  )

  const triggerProps = {
    ref: triggerRef,
    ...(trigger === "hover" && {
      onMouseEnter: handleOpen,
      onMouseLeave: handleClose,
    }),
    ...(trigger === "click" && {
      onClick: handleToggle,
    }),
    ...(trigger === "focus" && {
      onMouseEnter: handleOpen,
      onMouseLeave: handleClose,
      onFocus: handleOpen,
      onBlur: handleClose,
    }),
  }

  const tooltipElement = (
    <div
      ref={tooltipRef}
      className={`
        fixed z-[9999] bg-white text-gray-700 shadow-lg border border-gray-200 rounded-lg p-3 text-sm leading-relaxed
        transition-all duration-200 ease-in-out pointer-events-auto
        ${arrow ? "absolute" : ""}
        ${getArrowClasses()}
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        ${className || ""}
      `}
      style={{
        top: position.top,
        left: position.left,
        maxWidth,
      }}
    >
      {renderContent()}
    </div>
  )

  return (
    <>
      <span {...triggerProps} className={`inline-flex ${disabled ? "cursor-default" : "cursor-pointer"}`}>
        {triggerElement}
      </span>

      {/* Render tooltip in portal to avoid layout issues */}
      {mounted && open && createPortal(tooltipElement, document.body)}
    </>
  )
}

export default CustomTooltip
