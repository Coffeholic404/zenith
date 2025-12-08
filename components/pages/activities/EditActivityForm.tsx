"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { DevTool } from '@hookform/devtools';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import BirthdayDate from "@/components/pages/employees/add-employe/birthday-date";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import trash from "@/public/employees/TrashBin.svg"
import Image from "next/image"
import { Course, useGetCoursesQuery, useGetCourseByIdQuery } from "@/services/courses"
import { Plane, useGetPlanesQuery } from "@/services/plane"
import { PlaceItem, useGetPlacesQuery } from "@/services/place"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import {
  useGetActivityByIdQuery,
  useUpdateActivityMutation,
  ActivityJumper,
  ActivityJumperToUpdate,
  ActivityJumperWithId
} from "@/services/activity"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useGetEmployeesQuery } from "@/services/employe";
import { Skeleton } from "@/components/ui/skeleton";

const EditActivitiesFormSchema = z.object({
  character: z.string().min(1, {
    message: "حرف الدورة مطلوب",
  }),
  courseType: z.string().optional(),
  plane: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, {
    message: "تاريخ بداية النشاط مطلوب",
  }),
  windSpeed: z.string().min(1, {
    message: "سرعة الرياح مطلوبة",
  }),
  time: z.string().min(1, {
    message: "وقت النشاط مطلوب",
  }),
  // Current student being added/edited
  currentStudent: z.string().optional(),
  currentTrainer1Id: z.string().optional(),
  currentTrainer1Note: z.string().optional(),
  currentTrainer2Id: z.string().optional(),
  currentTrainer2Note: z.string().optional(),
  currentTrainer3Id: z.string().optional(),
  currentTrainer3Note: z.string().optional(),
  currentJumpCount: z.string().optional(),
  currentLandingLocation: z.string().optional(),
  currentJumpType: z.string().optional(),
  currentFreeFallTime: z.string().optional(),
  currentParachuteOpiningTime: z.string().optional(),
  currentParachuteOpinignHeight: z.string().optional(),
  currentPlaneExitHeight: z.string().optional(),
})

// Interface for jumper with display info and tracking
interface JumperWithDisplay extends ActivityJumper {
  studentName: string;
  jumperId?: string; // Present for existing jumpers
  isNew?: boolean; // True for newly added jumpers
  isModified?: boolean; // True if existing jumper was modified
}

export default function EditActivityForm({ activityId }: { activityId: string }) {
  const router = useRouter();

  // Fetch activity data
  const { data: activityData, isLoading: isLoadingActivity, isError: isErrorActivity } = useGetActivityByIdQuery(
    { uniqueID: activityId },
    { refetchOnMountOrArgChange: true }
  );

  const { data: courses, isLoading: isCoursesLoading, isSuccess: isCoursesSuccess } = useGetCoursesQuery({
    pageNumber: 1,
    pageSize: 100,
  })
  const { data: planes, isLoading: isPlanesLoading, isSuccess: isPlanesSuccess } = useGetPlanesQuery({
    pageNumber: 1,
    pageSize: 100,
  })
  const { data: places, isLoading: isPlacesLoading, isSuccess: isPlacesSuccess } = useGetPlacesQuery({
    pageNumber: 1,
    pageSize: 100,
  })
  const { data: employees, isLoading: isLoadingEmployees, isSuccess: isSuccessEmployees } = useGetEmployeesQuery({
    pageNumber: 1,
    pageSize: 100,
  })

  let trainers: any = []
  if (isSuccessEmployees) {
    trainers = employees?.result?.data?.filter((item) => item.employeeTypeName === "مدرب").map((item) => ({
      value: item.id,
      label: item.name,
    }))
  }

  const [updateActivity, { isLoading: isUpdating }] = useUpdateActivityMutation();

  // State for jumpers management
  const [addedJumpers, setAddedJumpers] = useState<JumperWithDisplay[]>([]);
  const [jumpersToDelete, setJumpersToDelete] = useState<string[]>([]);
  const [selectedJumperIndex, setSelectedJumperIndex] = useState<number | null>(null);
  const [isEditingJumper, setIsEditingJumper] = useState(false);
  const [loadedActivityId, setLoadedActivityId] = useState<string | null>(null);

  // Reset all state when activityId changes (navigating to different activity)
  useEffect(() => {
    setAddedJumpers([]);
    setJumpersToDelete([]);
    setSelectedJumperIndex(null);
    setIsEditingJumper(false);
    setLoadedActivityId(null);
  }, [activityId]);

  let placeData: PlaceItem[] = []
  if (isPlacesSuccess) {
    placeData = places?.result?.data || []
  }
  let planeData: Plane[] = []
  if (isPlanesSuccess) {
    planeData = planes?.result?.data || []
  }
  let courseData: Course[] = []
  if (isCoursesSuccess) {
    courseData = courses?.result?.data || []
  }
  const coursesCharacter = courseData.map((course) => ({
    label: course.character,
    value: course.uniqueID,
  }))
  const planesOptions = planeData.map((plane) => ({
    label: plane.name,
    value: plane.uniqueID,
  }))
  const placesOptions = placeData.map((place) => ({
    label: place.name,
    value: place.uniqueID,
  }))

  const form = useForm<z.infer<typeof EditActivitiesFormSchema>>({
    resolver: zodResolver(EditActivitiesFormSchema),
    defaultValues: {
      character: "",
      courseType: "",
      plane: "",
      location: "",
      startDate: "",
      windSpeed: "",
      time: "",
      currentStudent: "",
      currentTrainer1Id: "",
      currentTrainer1Note: "",
      currentTrainer2Id: "",
      currentTrainer2Note: "",
      currentTrainer3Id: "",
      currentTrainer3Note: "",
      currentJumpCount: "",
      currentLandingLocation: "",
      currentJumpType: "",
      currentFreeFallTime: "",
      currentParachuteOpiningTime: "",
      currentParachuteOpinignHeight: "",
      currentPlaneExitHeight: "",
    }
  })

  const watchedCharacter = useWatch({ control: form.control, name: "character" })
  const watchedStudent = useWatch({ control: form.control, name: "currentStudent" })

  const { data: courseById, isFetching: isCourseDetailsFetching, isSuccess: isCourseDetailsSuccess } = useGetCourseByIdQuery(
    { uniqueID: watchedCharacter || "" },
    { skip: !watchedCharacter }
  )

  const rawParticipants = isCourseDetailsSuccess ? courseById?.result?.participants || [] : []

  // Get unique students from participants
  const studentOptions = Array.from(
    new Map(
      rawParticipants.map((p) => [
        p.studentId,
        { label: p.studentName, value: p.studentId, code: p.studentCode, co_St_TrId: p.co_St_TrId },
      ])
    ).values()
  )

  // Get co_St_TrId for selected student
  const getCoStTrIdForStudent = (studentId: string): string => {
    const participant = rawParticipants.find(p => p.studentId === studentId);
    return participant?.co_St_TrId || "";
  }

  // Get student name for display
  const getStudentName = (studentId: string): string => {
    const student = studentOptions.find(s => s.value === studentId);
    return student?.label || "";
  }

  // Get student name from co_St_TrId
  const getStudentNameFromCoStTrId = (co_St_TrId: string): string => {
    const participant = rawParticipants.find(p => p.co_St_TrId === co_St_TrId);
    return participant?.studentName || "طالب";
  }

  // Pre-fill form with existing activity data
  useEffect(() => {
    // Wait for activity data AND options to be loaded before resetting form
    // CRITICAL: Check that activityData.result.uniqueID matches activityId to avoid using stale cached data
    if (
      activityData?.isSuccess &&
      activityData.result &&
      activityData.result.uniqueID === activityId &&
      loadedActivityId !== activityId &&
      isPlanesSuccess &&
      isPlacesSuccess &&
      isCoursesSuccess
    ) {
      const activity = activityData.result;

      // Format date to YYYY-MM-DD for date input
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Reset form with activity data
      form.reset({
        character: activity.courseId || "",
        courseType: activity.typeId || "",
        plane: activity.planeId || "",
        location: activity.placeId || "",
        startDate: formatDate(activity.date),
        windSpeed: activity.windSpeed || "",
        time: activity.time || "",
        currentStudent: "",
        currentTrainer1Id: "",
        currentTrainer1Note: "",
        currentTrainer2Id: "",
        currentTrainer2Note: "",
        currentTrainer3Id: "",
        currentTrainer3Note: "",
        currentJumpCount: "",
        currentLandingLocation: "",
        currentJumpType: "",
        currentFreeFallTime: "",
        currentParachuteOpiningTime: "",
        currentParachuteOpinignHeight: "",
        currentPlaneExitHeight: "",
      });

      // Load existing jumpers
      const existingJumpers: JumperWithDisplay[] = activity.jumpers.map((jumper) => ({
        co_St_TrId: jumper.co_St_TrId,
        studentName: getStudentNameFromCoStTrId(jumper.co_St_TrId) || "طالب",
        jumperId: jumper.id,
        jumperCount: jumper.jumperCount,
        freefallTime: jumper.freefallTime,
        freefallAltitude: jumper.freefallAltitude,
        deployAltitude: jumper.deployAltitude,
        exitAltitude: jumper.exitAltitude,
        landings: jumper.landings,
        typeOfJump: jumper.typeOfJump,
        trainer1Id: jumper.trainer1Id || undefined,
        trainer1Note: jumper.trainer1Note || undefined,
        trainer2Id: jumper.trainer2Id || undefined,
        trainer2Note: jumper.trainer2Note || undefined,
        trainer3Id: jumper.trainer3Id || undefined,
        trainer3Note: jumper.trainer3Note || undefined,
        isNew: false,
        isModified: false,
      }));

      setAddedJumpers(existingJumpers);
      setLoadedActivityId(activityId);
    }
  }, [activityData, form, loadedActivityId, activityId, isPlanesSuccess, isPlacesSuccess, isCoursesSuccess]);

  // Update student names when course participants are loaded
  useEffect(() => {
    if (isCourseDetailsSuccess && rawParticipants.length > 0 && addedJumpers.length > 0) {
      const updatedJumpers = addedJumpers.map(jumper => {
        const newName = getStudentNameFromCoStTrId(jumper.co_St_TrId);
        // Only update if the name actually changed to avoid infinite loops
        if (newName && newName !== jumper.studentName) {
          return { ...jumper, studentName: newName };
        }
        return jumper;
      });

      // Only set state if something actually changed
      const hasChanges = updatedJumpers.some((jumper, index) =>
        jumper.studentName !== addedJumpers[index].studentName
      );

      if (hasChanges) {
        setAddedJumpers(updatedJumpers);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCourseDetailsSuccess, rawParticipants.length]);

  // Update courseType when character changes or courses are loaded
  useEffect(() => {
    if (!isCoursesSuccess) return;
    const option = handleCourseTypeChange(watchedCharacter || "");
    if (option.value) {
      form.setValue("courseType", option.value);
    } else {
      form.setValue("courseType", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCharacter, isCoursesSuccess]);

  const handleCourseTypeChange = (value: string) => {
    let courseTypeOption = {} as { label: string, value: string };
    courseTypeOption.value = courseData.find((course) => course.uniqueID === value)?.typeId || ""
    courseTypeOption.label = courseData.find((course) => course.uniqueID === value)?.typeName || ""
    return courseTypeOption;
  }

  // Handle adding student to the jumpers list
  const handleAddStudent = () => {
    const currentStudentId = form.getValues("currentStudent");
    if (!currentStudentId) {
      toast({
        title: "خطأ",
        description: "يجب اختيار طالب",
        variant: "destructive"
      });
      return;
    }

    // Check if student already added
    const co_St_TrId = getCoStTrIdForStudent(currentStudentId);
    if (addedJumpers.some(j => j.co_St_TrId === co_St_TrId)) {
      toast({
        title: "خطأ",
        description: "تم إضافة هذا الطالب مسبقاً",
        variant: "destructive"
      });
      return;
    }

    // Get current form values for this student
    const jumpCount = parseInt(form.getValues("currentJumpCount") || "0");
    const freeFallTime = parseInt(form.getValues("currentFreeFallTime") || "0");
    const parachuteOpeningTime = parseInt(form.getValues("currentParachuteOpiningTime") || "0");
    const parachuteOpeningHeight = parseInt(form.getValues("currentParachuteOpinignHeight") || "0");
    const planeExitHeight = parseInt(form.getValues("currentPlaneExitHeight") || "0");
    const landingLocation = form.getValues("currentLandingLocation") || "";
    const jumpType = form.getValues("currentJumpType") || "";

    // Validate required fields
    if (!jumpCount || !landingLocation || !jumpType) {
      toast({
        title: "خطأ",
        description: "يجب ملء جميع الحقول المطلوبة للطالب",
        variant: "destructive"
      });
      return;
    }

    const newJumper: JumperWithDisplay = {
      co_St_TrId: co_St_TrId,
      studentName: getStudentName(currentStudentId),
      jumperCount: jumpCount,
      freefallTime: freeFallTime,
      freefallAltitude: parachuteOpeningTime,
      deployAltitude: parachuteOpeningHeight,
      exitAltitude: planeExitHeight,
      landings: landingLocation,
      typeOfJump: jumpType,
      trainer1Id: form.getValues("currentTrainer1Id") || undefined,
      trainer1Note: form.getValues("currentTrainer1Note") || undefined,
      trainer2Id: form.getValues("currentTrainer2Id") || undefined,
      trainer2Note: form.getValues("currentTrainer2Note") || undefined,
      trainer3Id: form.getValues("currentTrainer3Id") || undefined,
      trainer3Note: form.getValues("currentTrainer3Note") || undefined,
      isNew: true, // Mark as new jumper
      isModified: false,
    };

    setAddedJumpers([...addedJumpers, newJumper]);

    // Reset current student fields
    resetCurrentStudentFields();

    toast({
      title: "تم الإضافة",
      description: `تم إضافة الطالب ${newJumper.studentName}`,
    });
  };

  // Reset current student form fields
  const resetCurrentStudentFields = () => {
    form.setValue("currentStudent", "");
    form.setValue("currentTrainer1Id", "");
    form.setValue("currentTrainer1Note", "");
    form.setValue("currentTrainer2Id", "");
    form.setValue("currentTrainer2Note", "");
    form.setValue("currentTrainer3Id", "");
    form.setValue("currentTrainer3Note", "");
    form.setValue("currentJumpCount", "");
    form.setValue("currentLandingLocation", "");
    form.setValue("currentJumpType", "");
    form.setValue("currentFreeFallTime", "");
    form.setValue("currentParachuteOpiningTime", "");
    form.setValue("currentParachuteOpinignHeight", "");
    form.setValue("currentPlaneExitHeight", "");
  };

  // Handle removing student from jumpers list
  const handleRemoveStudent = (co_St_TrId: string) => {
    const jumperToRemove = addedJumpers.find(j => j.co_St_TrId === co_St_TrId);
    const removedIndex = addedJumpers.findIndex(j => j.co_St_TrId === co_St_TrId);

    // If this is an existing jumper (has jumperId), add to delete list
    if (jumperToRemove?.jumperId) {
      setJumpersToDelete([...jumpersToDelete, jumperToRemove.jumperId]);
    }

    setAddedJumpers(addedJumpers.filter(j => j.co_St_TrId !== co_St_TrId));

    // Clear selection if the removed student was selected
    if (selectedJumperIndex === removedIndex) {
      setSelectedJumperIndex(null);
      setIsEditingJumper(false);
      resetCurrentStudentFields();
    } else if (selectedJumperIndex !== null && removedIndex < selectedJumperIndex) {
      setSelectedJumperIndex(selectedJumperIndex - 1);
    }

    toast({
      title: "تم الحذف",
      description: "تم حذف الطالب من القائمة",
    });
  };

  // Handle selecting a student from the table to view/edit their info
  const handleSelectJumper = (index: number) => {
    const jumper = addedJumpers[index];
    if (!jumper) return;

    setSelectedJumperIndex(index);
    setIsEditingJumper(true);

    // Find the studentId from the co_St_TrId
    const participant = rawParticipants.find(p => p.co_St_TrId === jumper.co_St_TrId);
    const studentId = participant?.studentId || "";

    // Populate form fields with jumper data
    form.setValue("currentStudent", studentId);
    form.setValue("currentTrainer1Id", jumper.trainer1Id || "");
    form.setValue("currentTrainer1Note", jumper.trainer1Note || "");
    form.setValue("currentTrainer2Id", jumper.trainer2Id || "");
    form.setValue("currentTrainer2Note", jumper.trainer2Note || "");
    form.setValue("currentTrainer3Id", jumper.trainer3Id || "");
    form.setValue("currentTrainer3Note", jumper.trainer3Note || "");
    form.setValue("currentJumpCount", jumper.jumperCount.toString());
    form.setValue("currentLandingLocation", jumper.landings);
    form.setValue("currentJumpType", jumper.typeOfJump);
    form.setValue("currentFreeFallTime", jumper.freefallTime.toString());
    form.setValue("currentParachuteOpiningTime", jumper.freefallAltitude.toString());
    form.setValue("currentParachuteOpinignHeight", jumper.deployAltitude.toString());
    form.setValue("currentPlaneExitHeight", jumper.exitAltitude.toString());
  };

  // Handle updating an existing jumper
  const handleUpdateJumper = () => {
    if (selectedJumperIndex === null) return;

    const currentStudentId = form.getValues("currentStudent");
    if (!currentStudentId) {
      toast({
        title: "خطأ",
        description: "يجب اختيار طالب",
        variant: "destructive"
      });
      return;
    }

    // Get current form values
    const jumpCount = parseInt(form.getValues("currentJumpCount") || "0");
    const freeFallTime = parseInt(form.getValues("currentFreeFallTime") || "0");
    const parachuteOpeningTime = parseInt(form.getValues("currentParachuteOpiningTime") || "0");
    const parachuteOpeningHeight = parseInt(form.getValues("currentParachuteOpinignHeight") || "0");
    const planeExitHeight = parseInt(form.getValues("currentPlaneExitHeight") || "0");
    const landingLocation = form.getValues("currentLandingLocation") || "";
    const jumpType = form.getValues("currentJumpType") || "";

    // Validate required fields
    if (!jumpCount || !landingLocation || !jumpType) {
      toast({
        title: "خطأ",
        description: "يجب ملء جميع الحقول المطلوبة للطالب",
        variant: "destructive"
      });
      return;
    }

    const existingJumper = addedJumpers[selectedJumperIndex];
    const co_St_TrId = getCoStTrIdForStudent(currentStudentId);

    const updatedJumper: JumperWithDisplay = {
      co_St_TrId: co_St_TrId,
      studentName: getStudentName(currentStudentId),
      jumperId: existingJumper.jumperId, // Keep the jumperId if it exists
      jumperCount: jumpCount,
      freefallTime: freeFallTime,
      freefallAltitude: parachuteOpeningTime,
      deployAltitude: parachuteOpeningHeight,
      exitAltitude: planeExitHeight,
      landings: landingLocation,
      typeOfJump: jumpType,
      trainer1Id: form.getValues("currentTrainer1Id") || undefined,
      trainer1Note: form.getValues("currentTrainer1Note") || undefined,
      trainer2Id: form.getValues("currentTrainer2Id") || undefined,
      trainer2Note: form.getValues("currentTrainer2Note") || undefined,
      trainer3Id: form.getValues("currentTrainer3Id") || undefined,
      trainer3Note: form.getValues("currentTrainer3Note") || undefined,
      isNew: existingJumper.isNew, // Keep the isNew flag
      isModified: !existingJumper.isNew, // Mark as modified if it was an existing jumper
    };

    // Update the jumper in the array
    const newJumpers = [...addedJumpers];
    newJumpers[selectedJumperIndex] = updatedJumper;
    setAddedJumpers(newJumpers);

    // Reset editing state
    setSelectedJumperIndex(null);
    setIsEditingJumper(false);
    resetCurrentStudentFields();

    toast({
      title: "تم التحديث",
      description: `تم تحديث بيانات الطالب ${updatedJumper.studentName}`,
    });
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setSelectedJumperIndex(null);
    setIsEditingJumper(false);
    resetCurrentStudentFields();
  };

  // Handle form submission
  const onSubmit = form.handleSubmit(async (data) => {
    // Validate that at least one jumper is added
    if (addedJumpers.length === 0) {
      toast({
        title: "خطأ",
        description: "يجب إضافة طالب واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    // Separate jumpers into add and update arrays
    const jumpersToAdd: ActivityJumper[] = [];
    const jumpersToUpdate: ActivityJumperToUpdate[] = [];

    addedJumpers.forEach(jumper => {
      const { studentName, jumperId, isNew, isModified, ...jumperData } = jumper;

      if (isNew) {
        // New jumper - add to jumpersToAdd
        jumpersToAdd.push(jumperData);
      } else if (isModified && jumperId) {
        // Existing modified jumper - add to jumpersToUpdate
        jumpersToUpdate.push({
          jumperId,
          ...jumperData
        });
        // } else if (jumperId) {
        //   // Existing unmodified jumper - still include in jumpersToUpdate to keep it
        //   jumpersToUpdate.push({
        //     jumperId,
        //     ...jumperData
        //   });
        // }
      }
    });

    // Prepare final payload
    const payload = {
      uniqueID: activityId,
      courseId: data.character,
      placeId: data.location,
      planeId: data.plane,
      typeId: data.courseType,
      date: new Date(data.startDate).toISOString(),
      time: data.time,
      windSpeed: data.windSpeed,
      jumpersToAdd,
      jumpersToUpdate,
      jumpersToDelete
    };

    try {
      const result = await updateActivity(payload).unwrap();

      if (result.isSuccess) {
        toast({
          title: "نجح",
          description: "تم تحديث النشاط بنجاح",
        });

        // Redirect to activities page
        router.push('/activities');
      } else {
        toast({
          title: "خطأ",
          description: result.errorMessages.join(", "),
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.errorMessages?.join(", ") || "حدث خطأ أثناء تحديث النشاط",
        variant: "destructive"
      });
    }
  });

  // Loading state - wait for all data to be loaded AND form to be populated
  const isLoading = isLoadingActivity || isCoursesLoading || isPlanesLoading || isPlacesLoading || isLoadingEmployees;
  const isFormReady = loadedActivityId === activityId;

  if (isLoading || !isFormReady) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[378px_1fr] gap-4 lg:gap-8">
        {/* Left Column Skeleton - Basic Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Separator className="my-4" />
              {/* Student Table Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column Skeleton - Student & Trainer Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Info Section */}
              <Skeleton className="h-10 w-full" />

              {/* Trainers Section */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </div>

              {/* Action Button */}
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>

          {/* Bottom Buttons */}
          <div className="flex justify-end items-center gap-4 py-4">
            <Skeleton className="h-10 w-[118px]" />
            <Skeleton className="h-10 w-[225px]" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isErrorActivity) {
    return (
      <div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-deleteTxt font-vazirmatn">حدث خطأ أثناء تحميل بيانات النشاط</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <DevTool control={form.control} placement="top-left" />
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[378px_1fr] gap-4 lg:gap-8">
        <div className="" id="basic-info">
          <Card>
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              المعلومات الاساسية
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  key={`character-${activityId}`}
                  name="character"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Label htmlFor="form-rhf-select-character-edit" className="font-vazirmatn text-[14px]  block">حرف الدورة</Label>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          const option = handleCourseTypeChange(value)
                          form.setValue("courseType", option.value, { shouldValidate: true })
                        }}
                        disabled={isCoursesLoading || !isCoursesSuccess}
                      >
                        <SelectTrigger
                          id="form-rhf-select-character-edit"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="اختر حرف الدورة" />
                        </SelectTrigger>
                        <SelectContent >
                          {coursesCharacter.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  key={`courseType-${activityId}`}
                  name="courseType"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const selectedType = handleCourseTypeChange(watchedCharacter || "")
                    return (
                      <Field orientation="responsive" data-invalid={fieldState.invalid}>
                        <Label htmlFor="form-rhf-select-coursetype-edit" className="font-vazirmatn text-[14px]  block">نوع الدورة</Label>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        // disabled
                        >
                          <SelectTrigger
                            id="form-rhf-select-coursetype-edit"
                            aria-invalid={fieldState.invalid}
                            className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <SelectValue placeholder="اختر نوع الدورة" />
                          </SelectTrigger>
                          <SelectContent >
                            {selectedType.value && (
                              <SelectItem key={selectedType.value} value={selectedType.value}>
                                {selectedType.label}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </Field>
                    )
                  }}
                />
                <Controller
                  key={`plane-${activityId}`}
                  name="plane"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Label htmlFor="form-rhf-select-plane-edit" className="font-vazirmatn text-[14px]  block">الطائرة</Label>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-plane-edit"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="اختر الطائرة" />
                        </SelectTrigger>
                        <SelectContent >
                          {planesOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  key={`location-${activityId}`}
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Label htmlFor="form-rhf-select-location-edit" className="font-vazirmatn text-[14px]  block">المكان</Label>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-location-edit"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="اختر المكان" />
                        </SelectTrigger>
                        <SelectContent >
                          {placesOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Label htmlFor="startDate-edit" className="font-vazirmatn text-[14px]  block">تاريخ البدء</Label>
                      <BirthdayDate
                        {...field}
                        placeholder="اختر تاريخ البدء"
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="windSpeed"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="windSpeed-edit" className="font-vazirmatn text-[14px]  block">سرعة الرياح</Label>
                      <Input
                        {...field}
                        id="windSpeed-edit"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل سرعة الرياح"
                        autoComplete="off"
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="time"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid} className=" relative">

                      <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="وقت الدورة"
                        autoComplete="off"
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none relative"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <Label htmlFor="time-picker" className="px-1 absolute top-3 right-2 text-subtext font-vazirmatn font-normal">
                        الوقت
                      </Label>
                    </Field>
                  )}
                />
              </FieldGroup>
              <Separator className="my-4" />
              {/* student Table */}
              <div className='mt-4 space-y-4' id="student-table">
                <div className='bg-trainerTableBg rounded-xl px-4 py-2 flex items-center gap-36 font-vazirmatn text-sm'>
                  <span className=' text-trainerTableHeaderTxt text-[15px]'>اسم المتدرب</span>
                  <span className='w-10'></span>
                </div>
                {addedJumpers.length === 0 ? (
                  <div className="text-center py-4 text-subtext font-vazirmatn text-sm">
                    لم يتم إضافة طلاب بعد
                  </div>
                ) : (
                  addedJumpers.map((jumper, index) => (
                    <div
                      key={jumper.co_St_TrId}
                      className={cn(
                        'bg- px-4 py-3 flex items-center justify-between rounded-xl hover:bg-searchBg font-vazirmatn text-sm  border-searchBg cursor-pointer transition-colors',
                        selectedJumperIndex === index && 'bg-[#8870E733]/20 border border-sidebaractive'
                      )}
                      onClick={() => handleSelectJumper(index)}
                    >
                      <div className=' flex items-center gap-40'>
                        <span className=' text-collapsTxtClr text-[17px]'>{jumper.studentName}</span>
                        {jumper.isNew && (
                          <span className="text-xs text-sidebaractive">(جديد)</span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className='w-10 h-8 p-0 hover:bg-transparent'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStudent(jumper.co_St_TrId);
                        }}
                      >
                        <Image src={trash} alt="trash" className="w-4 h-4 text-deleteTxt" />
                      </Button>
                    </div>
                  ))
                )}

              </div>
            </CardContent>
          </Card>
        </div>

        <div id="student-And-trainer-info">
          <Card className=" ">
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              معلومات الطلاب
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className=" w-full flex">
                  <Controller
                    name="currentStudent"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field orientation="responsive" data-invalid={fieldState.invalid}>
                        <Label htmlFor="form-rhf-select-student-edit" className="font-vazirmatn text-[14px]  block">الطالب</Label>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            id="form-rhf-select-student-edit"
                            aria-invalid={fieldState.invalid}
                            className="char-select max-w-[320px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <SelectValue placeholder="اختر الطالب" />
                          </SelectTrigger>
                          <SelectContent >
                            {studentOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />

                </div>
                <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                  المدربون
                </CardHeader>
                <div className=" w-full grid grid-cols-2 gap-4">
                  <Controller
                    name="currentTrainer1Id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                        <Label htmlFor="currentTrainer1Id-edit" className="font-vazirmatn text-[14px]  block">المدرب 1</Label>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            id="currentTrainer1Id-edit"
                            className="char-select max-w-[317px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                          >
                            <SelectValue placeholder="اختر المدرب 1" />
                          </SelectTrigger>
                          <SelectContent>
                            {trainers.map((option: { value: string; label: string }) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentTrainer1Note"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-1">
                        <Label htmlFor="currentTrainer1Note-edit" className="font-vazirmatn text-[14px]  block">ملاحظات المدرب 1</Label>
                        <Input
                          {...field}
                          id="currentTrainer1Note-edit"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل ملاحظات المدرب 1"
                          autoComplete="off"
                          className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name="currentTrainer2Id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                        <Label htmlFor="currentTrainer2Id-edit" className="font-vazirmatn text-[14px]  block">المدرب 2</Label>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            id="currentTrainer2Id-edit"
                            className="char-select max-w-[317px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                          >
                            <SelectValue placeholder="اختر المدرب 2" />
                          </SelectTrigger>
                          <SelectContent>
                            {trainers.map((option: { value: string; label: string }) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentTrainer2Note"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-2">
                        <Label htmlFor="currentTrainer2Note-edit" className="font-vazirmatn text-[14px]  block">ملاحظات المدرب 2</Label>
                        <Input
                          {...field}
                          id="currentTrainer2Note-edit"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل ملاحظات المدرب 2"
                          autoComplete="off"
                          className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name="currentTrainer3Id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                        <Label htmlFor="currentTrainer3Id-edit" className="font-vazirmatn text-[14px]  block">المدرب 3</Label>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            id="currentTrainer3Id-edit"
                            className="char-select max-w-[317px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                          >
                            <SelectValue placeholder="اختر المدرب 3" />
                          </SelectTrigger>
                          <SelectContent>
                            {trainers.map((option: { value: string; label: string }) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentTrainer3Note"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-3">
                        <Label htmlFor="currentTrainer3Note-edit" className="font-vazirmatn text-[14px]  block">ملاحظات المدرب 3</Label>
                        <Input
                          {...field}
                          id="currentTrainer3Note-edit"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل ملاحظات المدرب 3"
                          autoComplete="off"
                          className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </Field>
                    )}
                  />
                </div>

                <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                  معلومات أساسية
                </CardHeader>
                <div className=" w-full grid grid-cols-2 gap-4">
                  <Controller
                    name="currentJumpCount"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Label htmlFor="currentJumpCount-edit" className="font-vazirmatn text-[14px]  block">عدد القفزات</Label>
                        <Input
                          {...field}
                          id="currentJumpCount-edit"
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل عدد القفزات"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentJumpType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Label htmlFor="currentJumpType-edit" className="font-vazirmatn text-[14px]  block">نوع القفز</Label>
                        <Input
                          {...field}
                          id="currentJumpType-edit"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل نوع القفز"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentParachuteOpiningTime"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Label htmlFor="currentParachuteOpiningTime-edit" className="font-vazirmatn text-[14px]  block">ارتفاع السقوط الحر</Label>
                        <Input
                          {...field}
                          id="currentParachuteOpiningTime-edit"
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل ارتفاع السقوط الحر"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentParachuteOpinignHeight"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Label htmlFor="currentParachuteOpinignHeight-edit" className="font-vazirmatn text-[14px]  block">ارتفاع فتح المظلة</Label>
                        <Input
                          {...field}
                          id="currentParachuteOpinignHeight-edit"
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل ارتفاع فتح المظلة"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentLandingLocation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-1 block">
                        <Label htmlFor="currentLandingLocation-edit" className="font-vazirmatn text-[14px]  block">موقع الهبوط</Label>
                        <Input
                          {...field}
                          id="currentLandingLocation-edit"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل موقع الهبوط"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px]  rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="currentFreeFallTime"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-2 block">
                        <Label htmlFor="currentFreeFallTime-edit" className="font-vazirmatn text-[14px]  block">وقت السقوط الحر</Label>
                        <Input
                          {...field}
                          id="currentFreeFallTime-edit"
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل وقت السقوط الحر"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="currentPlaneExitHeight"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-3 block">
                        <Label htmlFor="currentPlaneExitHeight-edit" className="font-vazirmatn text-[14px]  block">ارتفاع الخروج من الطائرة</Label>
                        <Input
                          {...field}
                          id="currentPlaneExitHeight-edit"
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="أدخل ارتفاع الخروج من الطائرة"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                {isEditingJumper ? (
                  <div className="flex gap-2">
                    <Button
                      id="update-student-btn"
                      type="button"
                      onClick={handleUpdateJumper}
                      className="bg-sidebaractive"
                      disabled={!watchedStudent}
                    >
                      تحديث الطالب
                    </Button>
                    <Button
                      id="cancel-edit-btn"
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      إلغاء التعديل
                    </Button>
                  </div>
                ) : (
                  <Button
                    id="add-student-btn"
                    type="button"
                    onClick={handleAddStudent}
                    className=" bg-sidebaractive"
                    disabled={!watchedStudent}
                  >
                    أضافة الطالب
                  </Button>
                )}
              </FieldGroup>
            </CardContent>
          </Card>
          <div className="flex justify-end items-center gap-4 py-4 font-vazirmatn">
            <Button
              type="button"
              variant="outline"
              className=" w-[118px] text-[14px]"
              onClick={() => router.back()}
            >
              الغاء
            </Button>

            <Button
              type="submit"
              disabled={isUpdating || addedJumpers.length === 0}
              className=" w-[225px] bg-sidebaractive text-white  text-[14px]"
            >
              {isUpdating ? "جاري التحديث..." : "تحديث النشاط"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
