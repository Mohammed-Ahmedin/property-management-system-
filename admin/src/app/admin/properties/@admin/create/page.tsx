import React from "react";
import { CreatePropertyForm } from "../../@owner/create/create-property-form";

const Page = () => {
  return (
    <div className="px-4">
      <header className="font-semibold py-6">Add Property</header>
      <CreatePropertyForm />
    </div>
  );
};

export default Page;
