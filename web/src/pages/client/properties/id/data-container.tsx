import FormatedAmount from "@/components/shared/formatted-amount";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GuestDetailHouseResponse } from "@/hooks/api/types/property.types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyDetails from "./location";
import { EmptyState } from "@/components/shared/empty-state";
import ReviewDialog from "./review-dialog";
import { ImageSlider } from "./images-slider";
import { ArrowLeft, Bath, BedDouble, CookingPot } from "lucide-react";
import ReviewsContainer from "./reviews-container";

interface Props {
  data: GuestDetailHouseResponse;
}

const DataContainer = ({ data }: Props) => {
  const property = data.data;
  const navigate = useNavigate();

  return (
    <div className="">
      <header className="py-4">
        <Button
          className=""
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft />
          Back
        </Button>
      </header>
      <ImageSlider images={property.images} />

      <div className="flex flex-col mt-6">
        <h2 className="font-bold text-xl md:text-2xl">{property.name}</h2>
        <p className="text-sm ">{property.about.description}</p>
        <p className="text-sm text-muted-foreground">{property.address}</p>
      </div>

      {/* <Tabs defaultValue="rooms" className="w-full mt-8">
        <TabsList className="">
          <TabsTrigger value="rooms" className="px-10">
            Rooms
          </TabsTrigger>
          <TabsTrigger value="overview" className="px-10">
            Overview
          </TabsTrigger>

          <TabsTrigger value="reviews" className="px-10">
            Reviews
          </TabsTrigger>
        </TabsList> */}

      {/* main contents */}
      <div className="pt-8 flex flex-col gap-4">
        <header>
          <h2 className="text-xl font-semibold">Available rooms</h2>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 ">
          {property?.rooms.length > 0 &&
            property?.rooms.map((r) => {
              // Group features by category (bedroom, bathroom, kitchen)
              const bedrooms = r.features
                ?.filter((f) => f.category?.toLowerCase() === "bedroom")
                .map((f) => `${f.name} (${f.value})`);
              const bathrooms = r.features
                ?.filter((f) => f.category?.toLowerCase() === "bathroom")
                .map((f) => `${f.name} (${f.value})`);
              const kitchens = r.features
                ?.filter((f) => f.category?.toLowerCase() === "kitchen")
                .map((f) => `${f.name} (${f.value})`);

              const bedroomCount = bedrooms?.length || 0;
              const bathroomCount = bathrooms?.length || 0;
              const kitchenCount = kitchens?.length || 0;

              return (
                <div
                  className="w-full border overflow-hidden rounded-lg relative bg-card shadow-sm hover:shadow-md transition-all"
                  key={r.id}
                >
                  {/* Type badge */}
                  <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {r.type}
                  </div>

                  {/* Room image */}
                  <img
                    src={r.images[0]?.url || "/placeholder.jpg"}
                    alt={r.name}
                    className="w-full h-[150px] md:h-[200px] object-cover"
                  />

                  <div
                    className="flex-1 px-3 py-3"
                    onClick={() => navigate(`/rooms/${r.id}`)}
                  >
                    <h2 className="font-semibold text-lg line-clamp-1">
                      {r.name}
                    </h2>
                    <FormatedAmount
                      amount={r.price}
                      suffix="/night"
                      className="mt-1"
                    />

                    {/* Feature icons */}
                    <div className="gap-4 mt-3 text-muted-foreground text-sm grid grid-cols-3">
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" />
                        <span>{bedroomCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{bathroomCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CookingPot className="w-4 h-4" />
                        <span>{kitchenCount}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-5">See details</Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* location and others */}
      <div className="pt-8 flex flex-col gap-4">
        <header>
          <h2 className="text-xl font-semibold">Overview</h2>
        </header>
        <PropertyDetails
          contact={property.contact}
          facilities={property.facilities as any}
          location={property.location}
        />{" "}
      </div>

      <ReviewsContainer propertyId={property.id} />
    </div>
  );
};

export default DataContainer;
