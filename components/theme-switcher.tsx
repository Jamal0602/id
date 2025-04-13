"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sun, Moon, Palette } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [neonColor, setNeonColor] = useState("#00FF41") // Default neon green color
  const [isOpen, setIsOpen] = useState(false)

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)

    // Load saved neon color from localStorage if available
    const savedColor = localStorage.getItem("neonColor")
    if (savedColor) {
      setNeonColor(savedColor)
      if (theme === "neon") {
        applyNeonTheme(savedColor)
      }
    }
  }, [theme])

  const applyNeonTheme = (color: string) => {
    document.documentElement.style.setProperty("--neon-color", color)
    document.documentElement.style.setProperty("--neon-text", color)
    localStorage.setItem("neonColor", color)
  }

  const handleNeonColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setNeonColor(newColor)
    applyNeonTheme(newColor)
    if (theme === "neon") {
      setTheme("neon")
    }
  }

  const handleThemeChange = (value: string) => {
    setTheme(value)
    if (value === "neon") {
      applyNeonTheme(neonColor)
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Palette className="h-[1.2rem] w-[1.2rem]" style={{ color: neonColor }} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Theme</h4>
            <p className="text-sm text-muted-foreground">Select a theme for the dashboard.</p>
          </div>
          <Tabs defaultValue={theme} onValueChange={handleThemeChange}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
              <TabsTrigger value="neon">Neon</TabsTrigger>
            </TabsList>
          </Tabs>

          {theme === "neon" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="neon-color">Neon Color</Label>
                <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: neonColor }} />
              </div>
              <Input id="neon-color" type="color" value={neonColor} onChange={handleNeonColorChange} />
              <div className="grid grid-cols-5 gap-2 mt-2">
                {["#00FF41", "#FF00FF", "#00FFFF", "#FFFF00", "#FF3131"].map((color) => (
                  <button
                    key={color}
                    className={`h-6 w-full rounded-md border ${neonColor === color ? "ring-2 ring-primary" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setNeonColor(color)
                      applyNeonTheme(color)
                      if (theme === "neon") {
                        setTheme("neon")
                      }
                    }}
                    aria-label={`Set neon color to ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Apply Theme
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
