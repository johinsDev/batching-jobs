import { and, asc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  NewServerTasks,
  ServerTasks,
  serverTasks,
  ServerTasksState,
} from "@/lib/db/schema"

export async function createServerTasks(
  data: Array<Omit<NewServerTasks, "id">>
) {
  const res = await db.insert(serverTasks).values(data).returning({
    id: serverTasks.id,
    serverId: serverTasks.serverId,
  })

  return res
}

export function allowedServerTasksStateTransitions(
  from: ServerTasksState
): ServerTasksState[] {
  switch (from) {
    case "completed":
      return []
    case "failed":
      return []
    case "pending":
      return ["inprogress", "failed"]
    case "inprogress":
      return ["completed", "failed"]
    default:
      return []
  }
}

export function isValidServerTaskStateTransition(
  from: ServerTasksState,
  to: ServerTasksState
) {
  return allowedServerTasksStateTransitions(from).includes(to)
}

export async function getInProgressServerTask(serverId: string) {
  return db.query.serverTasks.findFirst({
    where: and(
      eq(serverTasks.serverId, serverId),
      eq(serverTasks.state, "inprogress")
    ),
    orderBy: [asc(serverTasks.order)],
  })
}

export async function transitionServerTaskToState(
  task: ServerTasks,
  state: ServerTasksState
) {
  if (!allowedServerTasksStateTransitions(task.state).includes(state)) {
    throw new Error(`Invalid state transition to ${state}`)
  }

  return db
    .update(serverTasks)
    .set({
      state,
    })
    .where(eq(serverTasks.id, task.id))
    .returning({
      id: serverTasks.id,
      serverId: serverTasks.serverId,
    })
}

export async function transitionInProgressServerTask(
  serverId: string,
  state: ServerTasksState = "failed"
) {
  const task = await getInProgressServerTask(serverId)

  if (task) {
    console.log("Transitioning task to failed", { task })

    await transitionServerTaskToState(task, state)
  } else {
    console.error("No in progress task found", { serverId })
  }
}

// get the next task to run
export async function getNextServerTask(serverId: string) {
  return db.query.serverTasks.findFirst({
    where: and(
      eq(serverTasks.serverId, serverId),
      eq(serverTasks.state, "pending")
    ),
    orderBy: [asc(serverTasks.order)],
  })
}

export async function transitionNextServerTask(serverId: string) {
  const task = await getNextServerTask(serverId)

  if (task) {
    console.log("Transitioning task to inprogress", { task })

    await transitionServerTaskToState(task, "inprogress")
  } else {
    console.error("No pending task found", { serverId })
  }
}

export async function removeServerTasks(serverId: string) {
  return db.delete(serverTasks).where(eq(serverTasks.serverId, serverId))
}
