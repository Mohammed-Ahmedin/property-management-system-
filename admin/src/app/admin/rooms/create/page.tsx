import React from "react";
import { CreateRoomForm } from "./create-room-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Link href={"/admin/rooms"}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Button>
        </Link>
      </div>

      <CreateRoomForm />
    </div>
  );
};

export default Page;
