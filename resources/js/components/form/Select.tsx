"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Option {
  value: string
  label: string
}

interface SelectProps {
  options: Option[]
  placeholder?: string
  onChange: (value: string) => void
  className?: string
  defaultValue?: string
  value?: string // Thêm prop value để component có thể được controlled
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value, // Nhận value từ bên ngoài
}) => {
  // Sử dụng state nội bộ chỉ khi không có value từ bên ngoài (uncontrolled mode)
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue)

  // Cập nhật selectedValue khi value từ bên ngoài thay đổi
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    setSelectedValue(newValue)
    onChange(newValue) // Trigger parent handler
  }

  // Sử dụng value từ bên ngoài nếu có, nếu không thì sử dụng state nội bộ
  const currentValue = value !== undefined ? value : selectedValue

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        currentValue
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={currentValue}
      onChange={handleChange}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select
