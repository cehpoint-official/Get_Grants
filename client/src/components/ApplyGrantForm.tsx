import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { submitApplication } from "@/services/applications";
import { useAuth } from "@/hooks/use-auth";
import { InsertApplication } from "@shared/schema";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; 

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
    .max(7, "You can select a maximum of 7 areas"),
});

type FormValues = z.infer<typeof formSchema>;

const supportAreasList = [
  "Grants and incubation support",
  "Pitch deck",
  "Financial and valuation report",
  "Startup india registration",
  "Developing MVP",
  "Marketing",
  "Other areas"
];

export const GrantApplicationForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast(); 

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      helpDescription: "",
      supportAreas: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your application.",
        variant: "destructive",
      });
      return;
    }

    try {
      const submissionData: InsertApplication = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        helpDescription: data.helpDescription,
        supportAreas: data.supportAreas,
        userId: user.uid,
        status: "Pending",
        startupName: "",
        founderName: "",
        stage: "",
        sector: "",
        dpiit: "",
      };

      await submitApplication(submissionData);
      setSubmitted(true);
      form.reset();
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Submission failed", err);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-[#F8F5FA] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#30343B]">Grants Support Form</h2>
          <p className="text-[#565F6C] mt-2 max-w-xl mx-auto">
            We help Indian founders identify relevant grants, validate readiness, and submit applications.
            Fill in the details — our team will get in touch if you're a fit.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-green-700">Application Submitted!</h3>
            <p className="text-gray-600 mt-2">Thank you for reaching out. We will get back to you shortly.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#30343B] font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="phone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#30343B] font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="helpDescription" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">What do you need help with?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      maxLength={500}
                      placeholder="Please describe in detail what kind of support your startup is looking for..."
                      className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg resize-none"
                    />
                  </FormControl>
                   <div className="text-right text-xs text-gray-500 mt-1">
                      {field.value?.length || 0}/500
                    </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField
                control={form.control}
                name="supportAreas"
                render={() => (
                  <FormItem className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-4">
                      <FormLabel className="text-base font-semibold text-[#30343B]">
                        Select areas where you need support
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {supportAreasList.map((area) => (
                        <FormField
                          key={area}
                          control={form.control}
                          name="supportAreas"
                          render={({ field }) => {
                            return (
                              <FormItem key={area} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, area])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== area
                                            )
                                          );
                                    }}
                                    className="data-[state=checked]:bg-[#8541EF] data-[state=checked]:text-white data-[state=checked]:border-[#8541EF] focus-visible:ring-[#8541EF]"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm text-gray-700">
                                  {area}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-right mt-2 text-xs text-[#8541EF]">
                        {form.watch("supportAreas").length}/7 selected
                    </div>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-center pt-4 border-t border-gray-200">
                  <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#8541EF] hover:bg-[#7a38d9] text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 min-w-[150px] text-base"
                  >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};