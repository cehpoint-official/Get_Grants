import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  sectors: { label: string; value: string }[];
  programName?: string;
  deadlineDate: string;
  programDetails: string;
  applicationFormLink: string;
}

export default function ApplyIncubatorForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
    watch
  } = useForm<FormData>();

  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);

  const onSubmit = async (data: FormData) => {
    try {
      await addDoc(collection(db, "incubator_requests"), {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        sectors: data.sectors.map(sector => sector.value),
        programName: data.programName || null,
        deadlineDate: data.deadlineDate,
        programDetails: data.programDetails,
        applicationFormLink: data.applicationFormLink,
        status: "pending",
        createdAt: new Date(),
      });

      toast({
        title: "Application submitted!",
        description: "Admin will review your request shortly.",
      });

      reset();
      setTimeout(() => navigate("/"), 3000);
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border-2 border-violet space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-violet mb-2">
          Apply as Incubator
        </h2>
        <p className="text-violet">Join our network of innovation partners</p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Incubator's / Accelerator's Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", { 
            required: "Incubator name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters long"
            },
            maxLength: {
              value: 100,
              message: "Name cannot exceed 100 characters"
            }
          })}
          type="text"
          placeholder="e.g. IIT Mandi Catalyst"
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
            errors.name ? 'border-red-500 bg-red-50' : 'border-violet focus:border-pink hover:border-pink focus:ring-0'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span>⚠</span> {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address"
            }
          })}
          type="email"
          placeholder="e.g. incubator@example.com"
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
            errors.email ? 'border-red-500 bg-red-50' : 'border-violet focus:border-pink hover:border-pink focus:ring-0'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span>⚠</span> {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          {...register("phoneNumber", { 
            required: "Phone number is required",
            pattern: {
              value: /^[\+]?[1-9][\d]{0,15}$/,
              message: "Please enter a valid phone number"
            },
            minLength: {
              value: 10,
              message: "Phone number must be at least 10 digits"
            }
          })}
          type="tel"
          placeholder="e.g. +91 9876543210"
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
            errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-violet focus:border-pink hover:border-pink focus:ring-0'
          }`}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span>⚠</span> {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Select Sectors */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Select Sectors <span className="text-red-500">*</span>
        </label>
        <Controller
          name="sectors"
          control={control}
          rules={{ 
            required: "Please select at least one sector",
            validate: value => value && value.length > 0 || "Please select at least one sector"
          }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={[
                { label: "Technology", value: "technology" },
                { label: "Healthcare", value: "healthcare" },
                { label: "Fintech", value: "fintech" },
                { label: "E-commerce", value: "ecommerce" },
                { label: "Education", value: "education" },
                { label: "Agriculture", value: "agriculture" },
                { label: "Clean Energy", value: "clean-energy" },
                { label: "Manufacturing", value: "manufacturing" },
                { label: "Food & Beverage", value: "food-beverage" },
                { label: "Transportation", value: "transportation" },
                { label: "Other", value: "other" }
              ]}
              placeholder="Select sectors you focus on"
              className={`react-select-container ${errors.sectors ? 'border-red-500' : ''}`}
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '48px',
                  borderWidth: '2px',
                  borderColor: errors.sectors ? '#ef4444' : state.isFocused ? 'hsl(270, 50%, 60%)' : 'hsl(340, 70%, 70%)',
                  borderRadius: '12px',
                  boxShadow: state.isFocused ? '0 0 0 2px rgba(124, 58, 237, 0.4)' : 'none',
                  backgroundColor: 'white',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: 'hsl(60, 30%, 95%)',
                  borderRadius: '8px',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'hsl(270, 50%, 60%)',
                  fontWeight: 600,
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'hsl(270, 50%, 60%)',
                  ':hover': {
                    backgroundColor: 'hsl(340, 70%, 90%)',
                    color: 'hsl(270, 50%, 40%)'
                  }
                })
              }}
            />
          )}
        />
        {errors.sectors && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span>⚠</span> {errors.sectors.message}
          </p>
        )}
      </div>

      
      {/* Name of Program (Optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Name of Program <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          {...register("programName", {
            maxLength: {
              value: 100,
              message: "Program name cannot exceed 100 characters"
            }
          })}
          type="text"
          placeholder="e.g. Startup Accelerator Program 2024"
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
            errors.programName ? 'border-red-500 bg-red-50' : 'border-violet focus:border-pink hover:border-pink focus:ring-0'
          }`}
        />
        {errors.programName && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span>⚠</span> {errors.programName.message}
          </p>
        )}
      </div>

      {/* Deadline Date */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Application Deadline <span className="text-red-500">*</span>
        </label>
        <input
          {...register("deadlineDate", { 
            required: "Deadline date is required",
            validate: {
              futureDate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today || "Deadline must be today or in the future";
              }
            }
          })}
          type="date"
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
            errors.deadlineDate ? 'border-red-500 bg-red-50' : 'border-violet focus:border-pink hover:border-pink focus:ring-0'
          }`}
        />
        {errors.deadlineDate && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span>⚠</span> {errors.deadlineDate.message}
          </p>
        )}
      </div>

      {/* Program Details */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Program Details <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("programDetails", { 
            required: "Program details are required",
            minLength: {
              value: 50,
              message: "Please provide at least 50 characters describing your program"
            },
            maxLength: {
              value: 1000,
              message: "Program details cannot exceed 1000 characters"
            }
          })}
          placeholder="Describe your incubation/acceleration program, duration, benefits, selection criteria, etc."
          rows={5}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-vertical bg-white ${
            errors.programDetails ? 'border-red-500 bg-red-50' : 'border-violet focus:border-pink hover:border-pink focus:ring-0'
          }`}
        />
        <div className="flex justify-between items-center">
          <div>
            {errors.programDetails && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>⚠</span> {errors.programDetails.message}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {watch("programDetails")?.length || 0}/1000 characters
          </p>
        </div>
      </div>

      {/* Application Form Link */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Application Form Link <span className="text-red-500">*</span>
        </label>
        <input
          {...register("applicationFormLink", { 
            required: "Application form link is required",
            pattern: {
              value: /^https?:\/\/.+\..+/,
              message: "Please enter a valid URL starting with http:// or https://"
            }
          })}
          type="url"
          placeholder="https://example.com/application-form"
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
            errors.applicationFormLink ? 'border-red-500 bg-red-50' : 'border-violet focus:border-pink hover:border-pink focus:ring-0'
          }`}
        />
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>🔗</span> Link to your application form or website
        </p>
        {errors.applicationFormLink && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span>⚠</span> {errors.applicationFormLink.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </form>
  );
}