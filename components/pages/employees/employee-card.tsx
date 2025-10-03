import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import phone from "@/public/employees/Phone.svg";
import pencil from "@/public/table/Pen.svg"
import trash from "@/public/employees/TrashBin.svg"
import Image from "next/image";
import { Employee, useDeleteEmployeeMutation } from "@/services/employe";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
export default function EmployeeCard({ employee }: { employee: Employee }) {  
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id).unwrap();
      
      // Show success toast
      toast({
        title: "تم بنجاح",
        description: `تم حذف الموظف ${employee.name} بنجاح`,
        variant: "default",
      });
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Refresh the page to update the employee list
      router.refresh();
      
    } catch (error: any) {
      // Show error toast with the exact error message from API
      const errorMessage = error?.data?.errorMessages?.[0] || 
                          error?.data?.message || 
                          error?.message || 
                          "حدث خطأ أثناء حذف الموظف";
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Close the dialog even on error
      setIsDeleteDialogOpen(false);
    }
  };      

  return (
    <>
      <Card className=" min-w-[22.625rem] max-w-[24.625rem] flex-1 shadow-none p-2">
        <CardContent className="  p-0 space-y-4">
          <div className=" flex items-center justify-between ">
            <div className=" flex gap-2">
              <Avatar className=" size-16">
                <AvatarImage src={employee.attachment} alt="@shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className=" font-vazirmatn pt-2">
                <p className=" font-medium text-lg text-cardTxt">{employee.name}</p>
                <p className=" text-sm text-subtext font-normal">
                  {" "}
                   {employee.jobTitle}
                </p>
              </div>
            </div>
            <div className="">
              <Popover>
                <PopoverTrigger className=" size-6 text-subtext">
                  <EllipsisVertical className=" size-6 text-subtext" />
                </PopoverTrigger>
                <PopoverContent  className=" max-w-24 font-vazirmatn p-2 py-4 rounded-xl">
                  <div className=" flex flex-col gap-4">
                    <div
                      className=" flex items-center gap-2 cursor-pointer"
                    >
                      <Image
                        src={pencil}
                        alt="user rounded icon"
                        className=" size-6"
                      />
                      <p className=" font-normal text-base text-subtext">
                        تعديل
                      </p>
                    </div>
                    <div 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className=" flex items-center gap-2 cursor-pointer"
                    >
                      <Image
                        src={trash}
                        alt="trash icon"
                        className=" size-6"
                      />
                      <p className=" font-normal text-base text-deleteTxt">
                        حذف
                      </p>
                    </div>
                  </div>
                  <PopoverArrow />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Badge className=" text-[0.725rem] font-vazirmatn font-semibold text-cardTxt bg-studentClr ms-2">
              بغداد
            </Badge>
          </div>
          <Separator className="w-full mx-auto " />
          <CardFooter className="p-0  flex items-center justify-end">
            <div className=" flex items-center gap-2">
              <p className=" text-sm text-subtext font-semibold">{employee.phone}</p>
              <Image src={phone} alt="phone" className=" size-6" />
            </div>
          </CardFooter>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="font-vazirmatn">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-cardTxt">
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right text-subtext">
              هل أنت متأكد من حذف الموظف <span className="font-semibold text-cardTxt">{employee.name}</span>؟
              <br />
              <span className="text-sm text-deleteTxt">لا يمكن التراجع عن هذا الإجراء.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-vazirmatn">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteEmployee(employee.id || "")}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 font-vazirmatn"
            >
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
