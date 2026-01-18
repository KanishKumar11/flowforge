"use client"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"

export default function SubscriptionPage() {
  const trpc = useTRPC()
  const testAi = useMutation({
    mutationFn: async () => {
      return await trpc.testAi.mutationOptions({
        onSuccess: () => {
          console.log("AI test successful")
        },
        onError: () => {
          console.log("AI test failed")
        }
      })
    }
  })
  return (
    <div>
      <button onClick={() => testAi.mutate()}>Create Checkout Session</button>
    </div>
  )
}