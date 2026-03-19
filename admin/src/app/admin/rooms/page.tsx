"use client";
import RoomsContainer from "./rooms-container";
import RoomsStats from "./rooms-stats";

export default function RoomsPage() {

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <RoomsStats />

        {/* Rooms Grid */}
        <RoomsContainer />
      </main>
    </div>
  );
}