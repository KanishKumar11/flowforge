"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useVanillaClient } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface JoinPageProps {
  params: Promise<{ token: string }>;
}

export default function JoinTeamPage({ params }: JoinPageProps) {
  const { token } = use(params);
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const client = useVanillaClient();

  // We should ideally fetch invitation details here to show "Join Team X"
  // But for now, we'll try to accept it. 
  // If user is not logged in, TRPC will throw UNAUTHORIZED. 
  // We can catch that and redirect to login.

  const acceptMutation = useMutation({
    mutationFn: (data: { token: string }) => client.teams.acceptInvitation.mutate(data),
    onSuccess: (data: any) => {
      toast.success("Joined team successfully!");
      router.push(`/teams/${data.teamId}`);
    },
    onError: (error: any) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Please login to join the team");
        // Redirect to login with callback
        router.push(`/login?callbackUrl=/join/${token}`);
      } else {
        toast.error(error.message);
      }
      setIsAccepting(false);
    },
  });

  const handleAccept = () => {
    setIsAccepting(true);
    acceptMutation.mutate({ token });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Team</CardTitle>
          <CardDescription>
            You have been invited to join a workspace on FlowForge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click below to accept the invitation and access the workspace.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAccept} disabled={isAccepting} className="w-full">
            {isAccepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAccepting ? "Joining..." : "Accept Invitation"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
