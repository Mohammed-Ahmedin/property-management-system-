import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { emailOTPClient } from "better-auth/client/plugins";

// const SERVER_BASE_URL = "https://solomongetnet.pro.et";
export const SERVER_BASE_URL = "https://03105309961186fbccef4ea0c645d009.serveo.netk"
export const authClient = createAuthClient({
  baseURL: SERVER_BASE_URL, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "myapp",
      storagePrefix: "myapp",
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
  fetchOptions: { credentials: "include" },
});
