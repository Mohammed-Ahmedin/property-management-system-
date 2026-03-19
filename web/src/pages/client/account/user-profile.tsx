import { Avatar } from "@/components/shared/avatar";
import { Card } from "@/components/ui/card";

interface UserProfileProps {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    
  };
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="bg-card p-4 mb-6"> 
      <div className="flex items-center gap-6">
        <Avatar
          className="h-20 w-20"
          src={user.image || ""}
          fallback={user.name}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground">
            {user.name}
          </h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </Card>
  );
}
