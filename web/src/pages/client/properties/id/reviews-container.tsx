import React, { useState } from "react";
import ReviewDialog from "./review-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useGetReviewsQuery } from "@/hooks/api/use-reviews";
import { Spinner } from "@/components/ui/spinner";
import ReviewCard from "./review-card";

const ReviewsContainer = ({ propertyId }: { propertyId: string }) => {
  const [reviewDialog, setReviewDialog] = useState(false);
  const dataQuery = useGetReviewsQuery({ propertyId });

  const renderData = () => {
    if (dataQuery.isLoading) {
      return (
        <div className="py-20 flex justify-center items-center">
          <Spinner />
        </div>
      );
    }

    if (dataQuery.error || !dataQuery.data?.success) {
      return (
        <div className="py-20 flex justify-center items-center">
          <h2>Something went wrong please try again</h2>
        </div>
      );
    }

    if (dataQuery.data?.data.length === 0) {
      return (
        <EmptyState
          title="No Reviews Yet"
          description="This property hasn’t received any reviews yet. Be the first to share your experience!"
          primaryActions={
            <Button
              onClick={() => {
                setReviewDialog(true);
              }}
            >
              Write review
            </Button>
          }
        />
      );
    }

    if (dataQuery.data?.data) {
      return (
        <div className="w-full grid grid-cols-1 gap-3">
          {dataQuery.data.data.map((review) => {
            return <ReviewCard key={review.id} review={review} />;
          })}
        </div>
      );
    }
  };
  return (
    <>
      <div className="pt-8 flex flex-col gap-4 pb-24">
        <header className="flex justify-between items-center gap-4">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              setReviewDialog(true);
            }}
          >
            Write review
          </Button>
        </header>
        <div className="">{renderData()}</div>{" "}
      </div>

      <ReviewDialog
        reviewDialog={reviewDialog}
        setReviewDialog={setReviewDialog}
        propertyId={propertyId}
      />
    </>
  );
};

export default ReviewsContainer;
