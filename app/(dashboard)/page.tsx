import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChartComponent } from '@/components/charts/area-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { LineChartComponent } from '@/components/charts/line-chart';
import { PieChartComponent } from '@/components/charts/pie-chart';
import MiniCard from '@/components/pages/control/card';
import Charts from '@/components/pages/control/charts';
import Updates from '@/components/pages/control/updates';
import QuickActions from '@/components/pages/control/quickActions';

export default function Home() {
  return (
    <div className="space-y-6 mainn">
      {/* <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-primary/10 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            التحليلات
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            التقارير
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">45,231.89 ر.س</div>
                <p className="text-xs text-primary/80">+20.1% من الشهر الماضي</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المستخدمين</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">+2,350</div>
                <p className="text-xs text-primary/80">+180.1% من الشهر الماضي</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المبيعات</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">+12,234</div>
                <p className="text-xs text-primary/80">+19% من الشهر الماضي</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المشاهدات</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">+573,678</div>
                <p className="text-xs text-primary/80">+201 منذ آخر ساعة</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 ">
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-primary">الإيرادات الشهرية</CardTitle>
                <CardDescription>إجمالي الإيرادات على مدار العام</CardDescription>
              </CardHeader>
              <CardContent className="p-0 ">
                <AreaChartComponent />
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-primary">المبيعات والإيرادات</CardTitle>
                <CardDescription>مقارنة بين المبيعات والإيرادات حسب الربع</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <BarChartComponent />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-primary">تحليل الأداء</CardTitle>
                <CardDescription>مقارنة بين الزيارات والمشاهدات والمبيعات</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <LineChartComponent />
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-primary">توزيع المبيعات</CardTitle>
                <CardDescription>توزيع المبيعات حسب المنتج</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <PieChartComponent />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">التحليلات</CardTitle>
              <CardDescription>عرض تحليلات البيانات الخاصة بك هنا.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">بيانات التحليلات ستظهر هنا</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">التقارير</CardTitle>
              <CardDescription>عرض التقارير الخاصة بك هنا.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">بيانات التقارير ستظهر هنا</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
      <MiniCard />
      <Charts />
      <Updates />
      <QuickActions />
    </div>
  );
}
