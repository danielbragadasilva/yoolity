"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type User, PermissionLevel } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string(),
  status: z.enum(["Active", "Inactive"]),
  permissionLevel: z.coerce.number(),
})

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (user: User) => void
  onUpdate: (user: User) => void
  user: User | null
}

export function AddUserDialog({ open, onOpenChange, onAdd, onUpdate, user }: AddUserDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Viewer",
      status: "Active",
      permissionLevel: PermissionLevel.VIEWER,
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissionLevel: user.permissionLevel,
      })
    } else {
      form.reset({
        name: "",
        email: "",
        role: "Viewer",
        status: "Active",
        permissionLevel: PermissionLevel.VIEWER,
      })
    }
  }, [user, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (user) {
      onUpdate({
        ...user,
        ...values,
      })
    } else {
      onAdd({
        ...values,
        id: "",
        createdAt: new Date(),
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permissionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission Level</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number.parseInt(value))
                        // Update role based on permission level
                        const permLevel = Number.parseInt(value)
                        let role = "Viewer"
                        if (permLevel === PermissionLevel.ADMIN) role = "Admin"
                        else if (permLevel === PermissionLevel.EDITOR) role = "Editor"
                        form.setValue("role", role)
                      }}
                      defaultValue={field.value.toString()}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select permission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PermissionLevel.ADMIN.toString()}>Administrator</SelectItem>
                        <SelectItem value={PermissionLevel.EDITOR.toString()}>Editor</SelectItem>
                        <SelectItem value={PermissionLevel.VIEWER.toString()}>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">{user ? "Update" : "Add"} User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
