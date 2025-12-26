"use client"
import React from "react"
import { EditUserForm } from "@/components/pages/users/editUserForm";
export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = React.use(params);
    return (
        <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">تعديل مستخدم</h1>
                <p className="text-muted-foreground">أدخل المعلومات المطلوبة لتعديل حساب المستخدم</p>
              </div>
        
              <div className="flex justify-start items-center">
                <div className=" flex-1 lg:max-w-4xl rounded-lg p-6">
                  <EditUserForm userId={userId} />
                </div>
              
              </div>
            </div>
    )
}