// client/src/components/Testimonials.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Testimonial as TestimonialType } from '@shared/schema';

type TestimonialCardProps = {
  name: string;
  title: string;
  quote: string;
  amountSecured: string;
  
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, title, quote, amountSecured }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          
        </div>
      </div>
      <blockquote className="text-gray-600 mb-4">
        <p>"{quote}"</p>
      </blockquote>
      <a href="#" className="text-purple-600 font-bold "><span className='font-bold'>Secured ₹ {amountSecured} Lakhs </span> 
       
      </a>
    </div>
  );
};

export default function Testimonials() {
  const [, navigate] = useLocation();
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedTestimonials = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
          } as TestimonialType;
        });
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error("Error fetching testimonials: ", error);
       
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 self-start text-center lg:text-left">
            <span className="inline-block text-sm font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Case Studies
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Explore their journey to raising capital
            </h2>
            <p className="text-lg text-gray-600">
              Meet the entrepreneurs who raised capital on our platform
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button
                onClick={() => navigate('/grants')}
                className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-8 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity"
              >
                Find Grants
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {loading ? (
              <p>Loading testimonials...</p>
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.author}
                  title={testimonial.title}
                  quote={testimonial.quote}
                  amountSecured={testimonial.amountSecured}
                 
                />
              ))
            ) : (
                <p>No testimonials available yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}