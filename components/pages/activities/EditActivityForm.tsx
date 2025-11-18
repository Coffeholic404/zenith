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
import { useGetActivityByIdQuery, useUpdateActivityMutation, ActivityJumper, ActivityJumperWithId, ActivityJumperToUpdate } from "@/services/activity"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useGetEmployeesQuery } from "@/services/employe";

// Schema for individual jumper entry (student with trainers)
const jumperSchema = z.object({
  co_St_TrId: z.string().min(1, { message: "معرف الطالب مطلوب" }),
  studentName: z.string().optional(), // For display only
  jumperCount: z.number().min(1, { message: "عدد القفزات مطلوب" }),
  freefallTime: z.number().min(0, { message: "وقت السقوط الحر مطلوب" }),
  freefallAltitude: z.number().min(0, { message: "ارتفاع السقوط الحر مطلوب" }),
  deployAltitude: z.number().min(0, { message: "ارتفاع فتح المظلة مطلوب" }),
  exitAltitude: z.number().min(0, { message: "ارتفاع الخروج من الطائرة مطلوب" }),
  landings: z.string().min(1, { message: "موقع الهبوط مطلوب" }),
  typeOfJump: z.string().min(1, { message: "نوع القفزة مطلوب" }),
  trainer1Id: z.string().optional(),
  trainer1Note: z.string().optional(),
  trainer2Id: z.string().optional(),
  trainer2Note: z.string().optional(),
  trainer3Id: z.string().optional(),
  trainer3Note: z.string().optional(),
})

const AddActivitiesFormSchema = z.object({
  character: z.string().min(1, {
    message: "حرف الدورة مطلوب",
  }),
  courseType: z.string().min(1, {
    message: "نوع الدورة مطلوب",
  }),
  plane: z.string().min(1, {
    message: "نوع الطائرة مطلوب",
  }),
  location: z.string().min(1, {
    message: "موقع الدورة مطلوب",
  }),
  startDate: z.string().min(1, {
    message: "تاريخ بداية النشاط مطلوب",
  }),
  windSpeed: z.string().min(1, {
    message: "سرعة الرياح مطلوبة",
  }),
  time: z.string().min(1, {
    message: "وقت النشاط مطلوب",
  }),
  // Current student being added (not part of final submission)
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

// Interface for jumper with display info
interface JumperWithDisplay extends ActivityJumper {
  studentName: string;
  jumperId?: string; // Only present for existing jumpers
  isNew?: boolean; // Track if this is a newly added jumper
  isModified?: boolean; // Track if this existing jumper was modified
}

export default function EditActivitiesForm({id}: {id: string}) {
  const router = useRouter();

  // Fetch activity data for editing
  const { data: activityData, isLoading: isActivityLoading, isSuccess: isActivitySuccess } = useGetActivityByIdQuery(
    { uniqueID: id },
    { skip: !id }
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
  const { data: employees, isLoading: isLoadingEmployees, isError: isErrorEmployees, isSuccess: isSuccessEmployees } = useGetEmployeesQuery({
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

  // State for added jumpers (students with their info)
  const [addedJumpers, setAddedJumpers] = useState<JumperWithDisplay[]>([]);
  // State for tracking deleted jumper IDs (existing jumpers that were removed)
  const [deletedJumperIds, setDeletedJumperIds] = useState<string[]>([]);
  // State for tracking original jumpers from API (for comparison)
  const [originalJumpers, setOriginalJumpers] = useState<JumperWithDisplay[]>([]);
  // State for tracking which jumper is selected for editing
  const [selectedJumperIndex, setSelectedJumperIndex] = useState<number | null>(null);
  const [isEditingJumper, setIsEditingJumper] = useState(false);
  // Flag to track if form has been initialized with activity data
  const [isFormInitialized, setIsFormInitialized] = useState(false);

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

  const form = useForm<z.infer<typeof AddActivitiesFormSchema>>({
    resolver: zodResolver(AddActivitiesFormSchema),
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

  // Get unique trainers from participants
  const trainerOptions = Array.from(
    new Map(
      rawParticipants.map((p) => [
        p.trainerId,
        { label: p.trainerName, value: p.trainerId },
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

  useEffect(() => {
    if (!isCoursesSuccess) return
    const option = handleCourseTypeChange(watchedCharacter || "")
    if (option.value) {
      form.setValue("courseType", option.value, { shouldValidate: true })
    } else {
      form.setValue("courseType", "", { shouldValidate: true })
    }

  }, [watchedCharacter, isCoursesSuccess, courseData])

  // Effect to prefill form with activity data
  useEffect(() => {
    if (!isActivitySuccess || !activityData?.result || isFormInitialized) return;

    const activity = activityData.result;

    // Prefill basic info
    form.setValue("character", activity.courseId, { shouldValidate: true });
    form.setValue("plane", activity.planeId, { shouldValidate: true });
    form.setValue("location", activity.placeId, { shouldValidate: true });
    form.setValue("windSpeed", activity.windSpeed, { shouldValidate: true });
    form.setValue("time", activity.time, { shouldValidate: true });

    // Format date for input (YYYY-MM-DD)
    const activityDate = new Date(activity.date);
    const formattedDate = activityDate.toISOString().split('T')[0];
    form.setValue("startDate", formattedDate, { shouldValidate: true });

    // Prefill jumpers - map the existing jumpers to include student names
    // Note: Student names will be populated once course details are fetched
    const existingJumpers: JumperWithDisplay[] = activity.jumpers.map((jumper) => ({
      ...jumper,
      studentName: "", // Will be updated when course details are available
      isNew: false,
      isModified: false,
    }));

    setAddedJumpers(existingJumpers);
    setOriginalJumpers(JSON.parse(JSON.stringify(existingJumpers))); // Deep copy for comparison
    setIsFormInitialized(true);
  }, [isActivitySuccess, activityData, isFormInitialized, form]);

  // Effect to update student names once course details are fetched
  useEffect(() => {
    if (!isCourseDetailsSuccess || !rawParticipants.length || addedJumpers.length === 0) return;

    // Update student names for jumpers that don't have names yet
    const updatedJumpers = addedJumpers.map((jumper) => {
      if (!jumper.studentName) {
        // Find student name from participants using co_St_TrId
        const participant = rawParticipants.find(p => p.co_St_TrId === jumper.co_St_TrId);
        return {
          ...jumper,
          studentName: participant?.studentName || "غير معروف",
        };
      }
      return jumper;
    });

    // Only update if names were actually changed
    const hasChanges = updatedJumpers.some((j, i) => j.studentName !== addedJumpers[i].studentName);
    if (hasChanges) {
      setAddedJumpers(updatedJumpers);
      // Also update original jumpers with names
      setOriginalJumpers(prev => prev.map((jumper) => {
        if (!jumper.studentName) {
          const participant = rawParticipants.find(p => p.co_St_TrId === jumper.co_St_TrId);
          return {
            ...jumper,
            studentName: participant?.studentName || "غير معروف",
          };
        }
        return jumper;
      }));
    }
  }, [isCourseDetailsSuccess, rawParticipants, addedJumpers]);

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
      freefallAltitude: parachuteOpeningTime, // Using as freefall altitude
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
      isNew: true, // Mark as new jumper for add operation
      isModified: false,
    };

    setAddedJumpers([...addedJumpers, newJumper]);

    // Reset current student fields
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

    toast({
      title: "تم الإضافة",
      description: `تم إضافة الطالب ${newJumper.studentName}`,
    });
  };

  // Handle removing student from jumpers list
  const handleRemoveStudent = (co_St_TrId: string) => {
    const removedIndex = addedJumpers.findIndex(j => j.co_St_TrId === co_St_TrId);
    const removedJumper = addedJumpers[removedIndex];

    // If this is an existing jumper (has jumperId), track it for deletion
    if (removedJumper && removedJumper.jumperId && !removedJumper.isNew) {
      setDeletedJumperIds(prev => [...prev, removedJumper.jumperId!]);
    }

    setAddedJumpers(addedJumpers.filter(j => j.co_St_TrId !== co_St_TrId));

    // Clear selection if the removed student was selected
    if (selectedJumperIndex === removedIndex) {
      setSelectedJumperIndex(null);
      setIsEditingJumper(false);
      // Clear current student fields
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
    } else if (selectedJumperIndex !== null && removedIndex < selectedJumperIndex) {
      // Adjust selected index if a student before the selected one was removed
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

    const co_St_TrId = getCoStTrIdForStudent(currentStudentId);
    const existingJumper = addedJumpers[selectedJumperIndex];

    const updatedJumper: JumperWithDisplay = {
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
      // Preserve jumperId for existing jumpers
      jumperId: existingJumper.jumperId,
      isNew: existingJumper.isNew || false,
      // Mark as modified only if it's an existing jumper (has jumperId and not new)
      isModified: !existingJumper.isNew && !!existingJumper.jumperId,
    };

    // Update the jumper in the array
    const newJumpers = [...addedJumpers];
    newJumpers[selectedJumperIndex] = updatedJumper;
    setAddedJumpers(newJumpers);

    // Reset editing state
    setSelectedJumperIndex(null);
    setIsEditingJumper(false);

    // Reset current student fields
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

    toast({
      title: "تم التحديث",
      description: `تم تحديث بيانات الطالب ${updatedJumper.studentName}`,
    });
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setSelectedJumperIndex(null);
    setIsEditingJumper(false);

    // Reset current student fields
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

    // Separate jumpers into add and update categories
    const jumpersToAdd: ActivityJumper[] = addedJumpers
      .filter(jumper => jumper.isNew)
      .map(({ studentName, jumperId, isNew, isModified, ...jumper }) => jumper);

    const jumpersToUpdate: ActivityJumperToUpdate[] = addedJumpers
      .filter(jumper => !jumper.isNew && jumper.isModified && jumper.jumperId)
      .map(({ studentName, isNew, isModified, ...jumper }) => ({
        jumperId: jumper.jumperId!,
        co_St_TrId: jumper.co_St_TrId,
        jumperCount: jumper.jumperCount,
        freefallTime: jumper.freefallTime,
        freefallAltitude: jumper.freefallAltitude,
        deployAltitude: jumper.deployAltitude,
        exitAltitude: jumper.exitAltitude,
        landings: jumper.landings,
        typeOfJump: jumper.typeOfJump,
        trainer1Id: jumper.trainer1Id,
        trainer1Note: jumper.trainer1Note,
        trainer2Id: jumper.trainer2Id,
        trainer2Note: jumper.trainer2Note,
        trainer3Id: jumper.trainer3Id,
        trainer3Note: jumper.trainer3Note,
      }));

    // Prepare final payload for update
    const payload = {
      uniqueID: id,
      courseId: data.character, // character field contains courseId
      placeId: data.location,
      planeId: data.plane,
      typeId: data.courseType,
      date: new Date(data.startDate).toISOString(),
      time: data.time,
      windSpeed: data.windSpeed,
      jumpersToAdd,
      jumpersToUpdate,
      jumpersToDelete: deletedJumperIds,
    };

    try {
      const result = await updateActivity(payload).unwrap();

      if (result.isSuccess) {
        toast({
          title: "نجح",
          description: "تم تحديث النشاط بنجاح",
        });

        // Reset form and state
        form.reset();
        setAddedJumpers([]);
        setDeletedJumperIds([]);
        setOriginalJumpers([]);

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

  // Show loading state while fetching activity data
  if (isActivityLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sidebaractive mx-auto mb-4"></div>
          <p className="font-vazirmatn text-subtext">جاري تحميل بيانات النشاط...</p>
        </div>
      </div>
    );
  }

  return (
    <div >
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
                  name="character"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
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
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="حرف الدورة" />
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
                  name="courseType"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const selectedType = handleCourseTypeChange(watchedCharacter || "")
                    return (
                      <Field orientation="responsive" data-invalid={fieldState.invalid}>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled
                        >
                          <SelectTrigger
                            id="form-rhf-select-language"
                            aria-invalid={fieldState.invalid}
                            className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <SelectValue placeholder="نوع الدورة" />
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
                  name="plane"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="الطائرة" />
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
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="المكان" />
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
                      <BirthdayDate
                        {...field}
                        placeholder="تاريخ البدء"
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="windSpeed"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="سرعة الرياح "
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
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            id="form-rhf-select-language"
                            aria-invalid={fieldState.invalid}
                            className="char-select max-w-[320px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <SelectValue placeholder="الطالب" />
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
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            className="char-select max-w-[317px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                          >
                            <SelectValue placeholder="المدرب 1" />
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
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="ملاحظات المدرب 1"
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
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            className="char-select max-w-[317px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                          >
                            <SelectValue placeholder="المدرب 2" />
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
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="ملاحظات المدرب 2"
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
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!watchedCharacter || isCourseDetailsFetching}
                        >
                          <SelectTrigger
                            className="char-select max-w-[317px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                          >
                            <SelectValue placeholder="المدرب 3" />
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
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="ملاحظات المدرب 3"
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
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="عدد القفزات"
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
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="نوع القفز"
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
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="وقت فتح المظلة"
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
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="ارتفاع فتح المظلة"
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
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="موقع الهبوط"
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
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="وقت السقوط الحر"
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
                        <Input
                          {...field}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="ارتفاع الخروج من الطائرة"
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
              {isUpdating ? "جاري التحديث..." : "حفظ التغييرات"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
