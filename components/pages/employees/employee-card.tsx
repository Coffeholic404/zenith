import { EllipsisVertical } from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Separator } from "@/components/ui/separator"
export default function EmployeeCard() {
  return (
    <Card className=' min-w-[22.625rem] shadow-md p-2'>
        <CardContent className='  p-0'>
            <div className=' flex items-center justify-between '>
                <div className=' flex gap-2'>
                    <Avatar className=' size-16'>
                        <AvatarImage src="/placeholder.svg" alt="@shadcn" />
                        <AvatarFallback>
                            SC
                        </AvatarFallback>
                    </Avatar>
                    <div className=' font-vazirmatn'>
                        <p className=' font-medium text-lg text-cardTxt'>احمد محمد</p>
                        <p className=' text-sm text-subtext font-normal'> العنوان الوظيفي</p>
                    </div>
                </div>
                <div className=''>
                    <EllipsisVertical className=' size-6 text-subtext' />
                </div>
            </div>
        </CardContent>
    </Card> 
  );
}