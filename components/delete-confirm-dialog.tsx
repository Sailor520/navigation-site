"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Website } from "@/lib/types"
import { useSmartDataStore } from "@/lib/smart-data-store"

interface DeleteConfirmDialogProps {
  website: Website
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteConfirmDialog({ website, open, onOpenChange }: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { deleteWebsite } = useSmartDataStore()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      await deleteWebsite(website.id)

      toast({
        title: "网站删除成功",
        description: `"${website.name}" 已从导航中删除`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error('删除网站失败:', error)
      toast({
        title: "删除失败",
        description: "删除网站时出现错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            确认删除网站
          </DialogTitle>
          <DialogDescription>
            您确定要删除网站 <span className="font-medium">"{website.name}"</span> 吗？
            <br />
            <span className="text-red-600">此操作无法撤销。</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "删除中..." : "确认删除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
