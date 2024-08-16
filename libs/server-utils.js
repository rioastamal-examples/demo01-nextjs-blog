import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { getCurrentUser } from 'aws-amplify/auth/server';
import { cookies } from "next/headers";
import outputs from "../amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs
});

// Replacement for generateClientData()
export const cookiesClient = generateServerClientUsingCookies({
  config: outputs,
  cookies,
});

// Replacement for getCurrentUser()
export async function AuthGetCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    return currentUser;
  } catch (error) {
    console.error(error);
  }
}