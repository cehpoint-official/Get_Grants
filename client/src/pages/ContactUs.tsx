import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // ERROR FIXED
import { db } from "@/lib/firebase"; // ERROR FIXED
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { Facebook, Instagram, Linkedin, LoaderCircle, MessageSquare, Twitter } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import assistanceIcon from "@/assets/logos/assistance.png";
import locationIcon from "@/assets/logos/location.png";
import mailIcon from "@/assets/logos/mail.png";
import phoneIcon from "@/assets/logos/phone.png";
import supportIcon from "@/assets/logos/support.png";

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

type FormData = z.infer<typeof contactSchema>;

const InfoCard = ({ icon, title, line1, line2 }: { icon: React.ReactNode; title: string; line1: string; line2: string; }) => (
  <div className="bg-white p-6 rounded-[15px] shadow-[0px_4px_38.1px_0px_#00000012] text-center flex flex-col items-center justify-start h-[256px] w-full max-w-[261px] font-inter relative overflow-hidden pt-8">
    <div className="bg-[#FAF5FF] rounded-full h-[54px] w-[54px] flex items-center justify-center mb-4">
      {icon}
    </div>
    <div className="flex flex-col items-center w-full">
      <h3 className="font-semibold text-base leading-none text-[#3E4043] mb-3">{title}</h3>
      <div className="w-[250px] h-[1px] bg-gray-200 mx-auto mb-4"></div>
    </div>
    <div className="px-1 mt-2">
      <p className="text-sm font-normal text-[#4B4B4B] leading-[124%] mb-2">{line1}</p>
      <p className="text-sm font-normal text-[#828487] leading-[124%]">{line2}</p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#8541EF] rounded-b-[15px]"></div>
  </div>
);

const SupportCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => (
  <div className="border border-[#DCDCDC] rounded-[14px] p-6 text-center h-full flex flex-col justify-start items-center relative overflow-visible pt-12 bg-white">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-[#DCDCDC] shadow-sm">
      <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full">
        {icon}
      </div>
    </div>
    <h4 className="font-inter font-medium text-[16px] text-gray-800 mb-3 leading-none min-h-[40px] flex items-center">{title}</h4>
    <p className="font-inter text-xs text-[#565F6C] leading-[18px] max-w-[260px]">{description}</p>
  </div>
);

const ContactUs = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addDoc(collection(db, "contact-messages"), {
        ...data,
        createdAt: new Date(),
      });
      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
      });
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-[#FAF5FF] pt-20 pb-40 relative z-0">
        <div className="max-w-[417px] mx-auto px-4 text-center flex flex-col items-center space-y-3">
          <h2
            className="font-semibold text-[#191919] text-[34px] leading-none"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Connect With Us
          </h2>
          <p
            className="font-medium text-[#565F6C] text-base leading-none"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Our experts are here to answer your queries and provide assistance.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
          <InfoCard
            icon={<img src={mailIcon} alt="Email Icon" className="h-[22px] w-[22px]" />}
            title="Email Us"
            line1="info@startupgrants.in"
            line2="Reach us anytime for quick assistance."
          />
          <InfoCard
            icon={<img src={phoneIcon} alt="Phone Icon" className="h-[22px] w-[22px]" />}
            title="Call Us"
            line1="+91 7028377734"
            line2="Speak directly with our support team."
          />
          <InfoCard
            icon={<img src={locationIcon} alt="Location Icon" className="h-[22px] w-[22px]" />}
            title="Visit Us"
            line1="Salt Lake, Kolkata—700091, India."
            line2="Meet us in person to discuss your needs."
          />
        </div>
      </div>

      <section className="py-20 border-b border-[#E7E7E9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-[17px] shadow-[0px_4px_23.1px_0px_#8541EF26] grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col">
              <div>
                <h3 className="text-[32px] font-semibold bg-gradient-to-r from-[#8541EF] to-[#EB5E77] bg-clip-text text-transparent mb-4 leading-[44px]">
                  We’d Love to Hear <br /> From You
                </h3>
                <div className="flex items-center space-x-3 py-5 mb-10">
                  <a href="#" className="w-6 h-6 rounded-full flex items-center justify-center text-[#8541EF] bg-[#F5ECFF] hover:opacity-80">
                    <Facebook size={13} />
                  </a>
                  <a href="#" className="w-6 h-6 rounded-full flex items-center justify-center text-[#8541EF] bg-[#F5ECFF] hover:opacity-80">
                    <Linkedin size={13} />
                  </a>
                  <a href="#" className="w-6 h-6 rounded-full flex items-center justify-center text-[#8541EF] bg-[#F5ECFF] hover:opacity-80">
                    <Twitter size={13} />
                  </a>
                  <a href="#" className="w-6 h-6 rounded-full flex items-center justify-center text-[#8541EF] bg-[#F5ECFF] hover:opacity-80">
                    <Instagram size={13} />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 mt-6 gap-4">
                <SupportCard
                  icon={<img src={supportIcon} alt="Support Icon" className="h-8 w-8" />}
                  title="Fast & Reliable Support"
                  description="Get responses within 24 hours on business days, plus access to our team of grant experts whenever you need guidance."
                />
                <SupportCard
                  icon={<img src={assistanceIcon} alt="Assistance Icon" className="h-8 w-8" />}
                  title="24/7 Assistance"
                  description="Reach us anytime via email for quick help with your queries and expert solutions."
                />
              </div>
            </div>

            <div className="relative bg-white p-8 rounded-[16px] border border-[#E7E7E9] shadow-[0px_4px_23.1px_0px_#8541EF26] pb-24 mt-2">
              <h4 className="text-2xl font-semibold text-gray-800 mb-6">
                Keep in touch
              </h4>
              <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                  <Input type="text" id="name" {...register("name")} className="w-full h-10 px-4 border border-gray-300 rounded-md focus:ring-[#8541EF] focus:border-[#8541EF]"/>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                  <Input type="email" id="email" {...register("email")} className="w-full h-10 px-4 border border-gray-300 rounded-md focus:ring-[#8541EF] focus:border-[#8541EF]"/>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
                  <Input type="text" id="subject" {...register("subject")} className="w-full h-10 px-4 border border-gray-300 rounded-md focus:ring-[#8541EF] focus:border-[#8541EF]"/>
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 block mb-1">Message</label>
                  <Textarea id="message" {...register("message")} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#8541EF] focus:border-[#8541EF]"/>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <div className="absolute right-6 bottom-6">
                  <Button
                    type="submit"
                    form="contact-form" 
                    disabled={isSubmitting}
                    className="h-10 px-3 text-base font-semibold text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center"
                    style={{ background: "linear-gradient(90.24deg, #8541EF 0.21%, #EB5E77 165.86%)" }}
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="animate-spin mr-2" size={18} />
                    ) : (
                      <MessageSquare size={18} className="mr-2" />
                    )}
                    {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;