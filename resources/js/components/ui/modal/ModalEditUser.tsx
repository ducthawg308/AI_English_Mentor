"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Modal } from "./index"
import Input from "@/components/form/input/InputField"
import Label from "@/components/form/Label"
import Button from "../button/Button"
import Select from "@/components/form/Select"
import { Eye, EyeOff, Upload, X } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string | null
  email_verified_at: string | null
  password?: string
  password_confirmation?: string
  avatar_file?: File
}

interface ModalEditUserProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<User>) => void
  user: User | null
}

interface SelectOption {
  value: string
  label: string
}

export default function ModalEditUser({ isOpen, onClose, onSave, user }: ModalEditUserProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "",
    avatar: null,
    email_verified_at: null,
    password: "",
    password_confirmation: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Định nghĩa options
  const statusOptions: SelectOption[] = [
    { value: "0", label: "Chưa kích hoạt" },
    { value: "1", label: "Đã kích hoạt" },
  ]

  const roleOptions: SelectOption[] = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ]

  useEffect(() => {
    if (user) {
      // Cập nhật formData
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        email_verified_at: user.email_verified_at,
        password: "",
        password_confirmation: "",
      })

      // Cập nhật preview avatar nếu có
      if (user.avatar) {
        setAvatarPreview(user.avatar)
      } else {
        setAvatarPreview(null)
      }

      console.log("User data loaded:", {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.email_verified_at ? "1" : "0",
        avatar: user.avatar,
      })
    } else {
      // Reset form data
      setFormData({
        name: "",
        email: "",
        role: "",
        avatar: null,
        email_verified_at: null,
        password: "",
        password_confirmation: "",
      })
      setAvatarPreview(null)
    }
    setErrors({})
  }, [user, isOpen])

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Họ tên là bắt buộc"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.role) {
      newErrors.role = "Vui lòng chọn vai trò"
    }

    if (!user) {
      // For new users, password is required
      if (!formData.password) {
        newErrors.password = "Mật khẩu là bắt buộc"
      } else if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
      }

      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Mật khẩu nhập lại không khớp"
      }
    } else {
      // For existing users, validate passwords only if provided
      if (formData.password && formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
      }

      if (formData.password && formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Mật khẩu nhập lại không khớp"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const handleRoleChange = (value: string) => {
    console.log("Role changed to:", value)
    setFormData({ ...formData, role: value })
    setErrors({ ...errors, role: "" })
  }

  const handleStatusChange = (value: string) => {
    console.log("Status changed to:", value)
    setFormData({
      ...formData,
      email_verified_at: value === "1" ? new Date().toISOString() : null,
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Kiểm tra kích thước file (giới hạn 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "Kích thước ảnh không được vượt quá 2MB" })
        return
      }

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, avatar: "Vui lòng chọn file hình ảnh" })
        return
      }

      // Cập nhật formData với file avatar
      setFormData({ ...formData, avatar_file: file })
      
      // Tạo URL preview cho avatar
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
      
      // Xóa lỗi nếu có
      setErrors({ ...errors, avatar: "" })
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    setFormData({ ...formData, avatar: null, avatar_file: undefined })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const dataToSave = { ...formData }
    // Remove password fields if empty for existing users
    if (user && !dataToSave.password) {
      delete dataToSave.password
      delete dataToSave.password_confirmation
    }

    onSave(dataToSave)
    // Reset password fields after submission
    setFormData((prev) => ({
      ...prev,
      password: "",
      password_confirmation: "",
    }))

    console.log("Dữ liệu gửi đi:", dataToSave);
  }

  // Lấy giá trị hiện tại cho status select
  const getCurrentStatusValue = () => {
    return formData.email_verified_at ? "1" : "0"
  }

  // Tạo URL avatar mặc định nếu không có avatar
  const getDefaultAvatarUrl = () => {
    if (formData.name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`
    }
    return `https://ui-avatars.com/api/?name=User&background=random&color=fff`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {user ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {user
              ? "Cập nhật thông tin chi tiết để giữ cho hồ sơ của người dùng được cập nhật."
              : "Nhập thông tin để thêm người dùng mới."}
          </p>
        </div>
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-3">
            <div className="mt-1">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Thông tin người dùng
              </h5>
              
              {/* Avatar upload section */}
              <div className="mb-6 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={avatarPreview || getDefaultAvatarUrl()}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      title="Xóa ảnh"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="flex cursor-pointer items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Upload size={14} />
                    <span>{avatarPreview ? "Thay đổi ảnh" : "Tải lên ảnh đại diện"}</span>
                  </label>
                  {errors.avatar && <p className="mt-1 text-center text-sm text-red-500">{errors.avatar}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Họ tên</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder={user ? "Nhập họ tên mới" : "Nhập họ tên"}
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Địa chỉ Email</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder={user ? "Nhập địa chỉ email mới" : "Nhập địa chỉ email"}
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={user ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                      value={formData.password || ""}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? <Eye width={16} height={16} /> : <EyeOff width={16} height={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Nhập lại mật khẩu</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      placeholder={user ? "Để trống nếu không đổi" : "Nhập lại mật khẩu"}
                      value={formData.password_confirmation || ""}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? <Eye width={16} height={16} /> : <EyeOff width={16} height={16} />}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Vai trò</Label>
                  <Select
                    options={roleOptions}
                    placeholder="Vai trò hệ thống"
                    onChange={handleRoleChange}
                    value={formData.role || ""}
                    className="dark:bg-dark-900"
                  />
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Trạng thái</Label>
                  <Select
                    options={statusOptions}
                    placeholder="Trạng thái tài khoản"
                    onChange={handleStatusChange}
                    value={getCurrentStatusValue()}
                    className="dark:bg-dark-900"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button size="sm" type="submit">
              {user ? "Lưu thay đổi" : "Thêm người dùng"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}