"use client";

import { PropertyRegistrationForm } from "@/components/shared/registration/PropertyRegistrationForm";


const ContactPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16 transition-colors duration-300">
      <PropertyRegistrationForm />
    </div>
  );
};

export default ContactPage;
