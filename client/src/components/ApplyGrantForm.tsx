import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { submitApplication } from "@/services/applications";

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
    setValue("supportAreas", updatedAreas);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform data to match the expected format or update your submitApplication function
      const submissionData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        helpDescription: data.helpDescription,
        supportAreas: data.supportAreas,
        // Add any other required fields with default values if needed
        startupName: "", // You may need to update your backend to make these optional
        founderName: "",
        stage: "",
        sector: "",
        dpiit: "",
      };
      
      await submitApplication(submissionData);
      setSubmitted(true);
      reset();

      // Optional delay before redirect
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 max-w-3xl mx-auto mt-10 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Grants Support Form</h2>
        <p className="text-gray-600 text-base max-w-xl mx-auto">
          We help Indian founders identify relevant grants, validate readiness, and submit applications.
          Fill in the details — our team will get in touch if you're a fit.
        </p>
      </div>

      {submitted ? (
        <div className="text-green-600 text-center font-medium text-lg">✅ Form submitted successfully!</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              className={`w-full px-4 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                errors.name 
                  ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <div className="flex items-start mt-2 text-red-600">
                <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">
                  {errors.name.message}
                </p>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              className={`w-full px-4 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                errors.phone 
                  ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {errors.phone && (
              <div className="flex items-start mt-2 text-red-600">
                <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">
                  {errors.phone.message}
                </p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <div className="flex items-start mt-2 text-red-600">
                <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">
                  {errors.email.message}
                </p>
              </div>
            )}
          </div>

          {/* What do you need help with? */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <label htmlFor="helpDescription" className="block text-sm font-medium text-gray-700 mb-2">
              What do you need help with? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="helpDescription"
              {...register("helpDescription")}
              rows={4}
              placeholder="Please describe in detail what kind of support your startup is looking for (minimum 20 characters)..."
              className={`mt-1 block w-full rounded-md border shadow-sm sm:text-sm px-4 py-2 transition-colors focus:outline-none focus:ring-2 ${
                errors.helpDescription 
                  ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
              }`}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">
                {watch("helpDescription")?.length || 0}/500 characters
              </div>
            </div>
            {errors.helpDescription && (
              <div className="flex items-start mt-2 text-red-600">
                <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">
                  {errors.helpDescription.message}
                </p>
              </div>
            )}
          </div>

          {/* Support Areas Checkboxes */}
          <div className={`border border-gray-200 rounded-lg p-4 shadow-sm transition-colors ${
            errors.supportAreas ? 'bg-red-50 border-red-300' : 'bg-gray-50'
          }`}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select areas where you need support <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportAreas.map((area) => (
                <div key={area} className="flex items-center group">
                  <input
                    type="checkbox"
                    id={area}
                    checked={selectedAreas.includes(area)}
                    onChange={() => handleCheckboxChange(area)}
                    className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded transition-colors"
                  />
                  <label 
                    htmlFor={area} 
                    className="ml-2 text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors select-none"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {selectedAreas.length}/7 areas selected
            </div>
            {errors.supportAreas && (
              <div className="flex items-start mt-3 text-red-600">
                <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">
                  {errors.supportAreas.message}
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-blue hover:bg-accent-blue text-white font-semibold text-lg py-3 rounded-md shadow-md"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}
    </div>
  );
};