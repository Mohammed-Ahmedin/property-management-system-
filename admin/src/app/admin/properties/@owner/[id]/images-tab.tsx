import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Bed, Edit, Image, Square, Trash, Trash2 } from "lucide-react";
import { useRoomsForList } from "@/hooks/api/use-rooms"; // your hook
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/shared/empty-state";

const ImagesTab = (props: { images: { url: string; name: string }[] }) => {
  const images = props.images;

  return (
    <TabsContent value="images">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                A list of property images is here
              </CardDescription>
            </div>
            <Button size="sm">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
        </CardHeader>

        {images.length === 0 ? (
          <div className="w-full flex justify-center items-center">
            <div className="text-center py-12 ">
              <Square className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                No images available
              </h3>
              <p className="text-muted-foreground mb-4">
                there is no any added image yet
              </p>
              <Button>Add Images</Button>
            </div>
          </div>
        ) : (
          <CardContent className="grid grid-cols-2 md:grid-cols-3">
            {images?.map((image) => {
              return (
                <div className="flex flex-col gap-2 relative">
                  <div className=" absolute top-2 right-2 z-20">
                    <Button className="" size={"icon"} variant={"destructive"}>
                      <Trash />
                    </Button>
                  </div>
                  <img
                    src={image.url}
                    className="w-full aspect-video rounded-2xl"
                  />
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>
    </TabsContent>
  );
};

export default ImagesTab;
