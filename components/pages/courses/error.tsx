import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error() {
    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <div className="space-y-4">
            <Card className="flex justify-center items-center py-8">
                <CardContent className="max-w-2xl mx-auto p-6">
                    <Alert variant="destructive" className="border-2">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="font-vazirmatn text-lg font-semibold mb-2">
                            خطأ في تحميل البيانات
                        </AlertTitle>
                        <AlertDescription className="font-vazirmatn text-base mb-4">
                            عذراً، حدث خطأ أثناء تحميل تفاصيل الدورة. يرجى المحاولة مرة أخرى.
                        </AlertDescription>
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="font-vazirmatn mt-2 gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            إعادة المحاولة
                        </Button>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    )
}
