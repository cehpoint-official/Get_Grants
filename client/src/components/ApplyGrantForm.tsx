import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { submitApplication } from "@/services/applications";
import { useAuth } from "@/hooks/use-auth";
import { InsertApplication } from "@shared/schema";

const formSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  helpDescription: z.string()
    .min(1, "Please describe what help you need")
    .min(20, "Please provide at least 20 characters for better understanding")
    .max(500, "Description must be less than 500 characters"),
  supportAreas: z.array(z.string())
    .min(1, "Please select at least one support area")
    .max(7, "You can select maximum 7 areas"),
});

type FormValues = z.infer<typeof formSchema>;

export const GrantApplicationForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [_, navigate] = useLocation();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supportAreas: []
    }
  });

  const supportAreas = [
    "Grants and incubation support",
    "Pitch deck",
    "Financial and valuation report",
    "Startup india registration",
    "Developing MVP",
    "Marketing",
    "Other areas"
  ];

  const selectedAreas = watch("supportAreas") || [];

  const handleCheckboxChange = (area: string) => {
    const currentAreas = selectedAreas;
    const updatedAreas = currentAreas.includes(area)
      ? currentAreas.filter(item => item !== area)
      : [...currentAreas, area];
    setValue("supportAreas", updatedAreas, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const submissionData: InsertApplication = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        helpDescription: data.helpDescription,
        supportAreas: data.supportAreas,
        userId: user?.uid,
        status: "Pending",
        // Optional fields ko undefined bhejein agar unki value nahi hai
        startupName: "",
        founderName: "",
        stage: "",
        sector: "",
        dpiit: "",
      };

      await submitApplication(submissionData);
      setSubmitted(true);
      reset();
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Submission failed", err);
      // Aap yahan user ko error message dikha sakte hain
    }
  };

  return (
    <div
      className="shadow-2xl rounded-2xl p-6 md:p-10 max-w-3xl mx-auto mt-10"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-violet mb-2">Grants Support Form</h2>
        <p className="text-gray-700 text-base max-w-xl mx-auto">
          We help Indian founders identify relevant grants, validate readiness, and submit applications.
          Fill in the details — our team will get in touch if you're a fit.
        </p>
      </div>

      {submitted ? (
        <div className="text-center p-6 bg-green-100 border-2 border-green-300 rounded-xl">
          <span className="text-5xl">✅</span>
          <p className="text-green-800 font-semibold text-xl mt-4">Form submitted successfully!</p>
          <p className="text-green-700">We will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none ${
                errors.name
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-400 bg-white focus:border-gray-500'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none ${
                errors.phone
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-400 bg-white focus:border-gray-500'
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none ${
                errors.email
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-400 bg-white focus:border-gray-500'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="helpDescription" className="block text-sm font-medium text-gray-700 mb-1">
              What do you need help with? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="helpDescription"
              {...register("helpDescription")}
              rows={4}
              placeholder="Please describe in detail what kind of support your startup is looking for..."
              className={`mt-1 block w-full rounded-lg border-2 shadow-sm sm:text-sm px-4 py-3 transition-colors focus:outline-none ${
                errors.helpDescription
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-400 bg-white focus:border-gray-500'
              }`}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {watch("helpDescription")?.length || 0}/500
            </div>
            {errors.helpDescription && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.helpDescription.message}</p>
            )}
          </div>

          <div className={`border-2 rounded-lg p-4 transition-colors ${
            errors.supportAreas ? 'bg-red-50 border-red-400' : 'bg-white border-gray-400'
          }`}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select areas where you need support <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportAreas.map((area) => (
                <div key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    id={area}
                    checked={selectedAreas.includes(area)}
                    onChange={() => handleCheckboxChange(area)}
                    className="h-4 w-4 text-violet focus:ring-violet border-violet rounded transition-colors cursor-pointer"
                  />
                  <label htmlFor={area} className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
                    {area}
                  </label>
                </div>
              ))}
            </div>
            <div className="text-right mt-2 text-xs text-violet">
              {selectedAreas.length}/7 selected
            </div>
            {errors.supportAreas && (
               <p className="mt-2 text-sm text-red-600 font-medium">{errors.supportAreas.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-violet hover:bg-pink text-white font-semibold text-lg py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      )}
    </div>
  );
};