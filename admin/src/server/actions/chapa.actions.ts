"use server";

import axios from "axios";
import {
  InitializeOptions,
  InitializeResponse,
  VerifyResponse,
  GetBanksResponse,
} from "@/types/chapa";

const CHAPA_API_URL = process.env.CAHAPA_API_URL;

// Initializes a payment transaction by making a request to the Chapa API.
// This function accepts an `InitializeOptions` object, which contains essential
// payment information like the amount, currency, and customer details.
// It sends an HTTP POST request to the Chapa payment initialization endpoint,
// passing the required headers, including the secret API key and content type.
// If successful, the function returns the payment initialization response,
export async function initializePayment(
  initializeOptions: InitializeOptions
): Promise<InitializeResponse> {
  try {
    const response = await axios.post(
      `${CHAPA_API_URL}/transaction/initialize`,
      initializeOptions,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Send response back to client
  } catch (error: any) {
    throw new Error(`Payment Faild Please try again`);
  }
}

// Verifies a payment by checking its status using the provided `tx_ref` (transaction reference).
// This function sends an HTTP GET request to Chapa's verification endpoint,
// appending the `tx_ref` in the URL to retrieve the transaction status.
// It uses the Chapa API key in the request header for authentication.
// If the verification is successful, the payment details are returned,
// otherwise, an error message is thrown.
export async function verifyPayment(tx_ref: string): Promise<VerifyResponse> {
  try {
    const response = await axios.get(
      `${CHAPA_API_URL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Send response back to client
  } catch (error: any) {
    throw new Error(`Payment initialization failed: ${error.message}`);
  }
}

// Retrieves a list of supported banks using the Chapa API.
// This function sends an HTTP GET request to the Chapa banks endpoint,
// using the API key for authorization in the request headers.
// It returns a list of banks available for processing payments.
// If the request fails, it throws an error with a descriptive message.
export async function getBanks(): Promise<GetBanksResponse> {
  try {
    const response = await axios.get(`https://api.chapa.co/v1/banks`, {
      headers: {
        Authorization: `Bearer ${'CHASECK_TEST-s3aSBrDwAZRhoB1NvwaWhdYUjqvRTZNt'}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; // Send response back to client
  } catch (error: any) {
    throw new Error(`Payment initialization failed: ${error.message}`);
  }
}
