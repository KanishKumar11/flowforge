import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
export const appRouter = createTRPCRouter({
  getWorkflows:protectedProcedure.query(({ctx}) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow:protectedProcedure.mutation(async({ctx}) => {
    await inngest.send({
      name:"test/hello.world",
      data:{
        email:"test@gmail.com"
      }
    })
    return {success:true,message:"Job Queued"}
  })
});
export type AppRouter = typeof appRouter;
