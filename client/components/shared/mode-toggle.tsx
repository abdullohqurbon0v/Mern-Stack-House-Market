"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button size={"icon"} variant={'ghost'} onClick={handleToggle}>
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  )
}
