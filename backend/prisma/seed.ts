// import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/prisma/client";

// const connectionString = `${process.env.DATABASE_URL}`;

// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   const tasks = await prisma.task.createMany({
//     data: [
//       {
//         tag: "Work",
//         title: "Start Project",
//         status: "Pending",
//         priority: "High",
//         dueDate: new Date("2026-04-16T23:59:00"),
//         description: "Set up a project using HTML, CSS, and JavaScript.",
//         completed: false,
//       },
//       {
//         tag: "Urgent",
//         title: "Submit assignment",
//         status: "Done",
//         priority: "Medium",
//         dueDate: new Date("2026-04-13T23:59:00"),
//         description: "Finish and submit Task card assignment.",
//         completed: true,
//       },
//       {
//         tag: "Moderate",
//         title: "Exercise",
//         status: "Pending",
//         priority: "Low",
//         dueDate: new Date("2026-04-14T18:00:00"),
//         description: "Arm workout for 40 minutes.",
//         completed: false,
//       },
//       {
//         tag: "High",
//         title: "Complete HNG Stage-1a task",
//         status: "Pending",
//         priority: "High",
//         dueDate: new Date("2026-04-16T23:59:00"),
//         description:
//           "Add additional functionalities to Task Manager completed in Stage-0, features include an additional edit button, 'show more' button for descriptions that are too long, an enhancement to the priority tag, and an additional feature to the time functionality",
//         completed: false,
//       },
//     ],
//   });

//   console.log(`Seeded ${tasks.count} tasks`);
// }

// main()
//   .catch((e) => {
//     console.error("Error", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
