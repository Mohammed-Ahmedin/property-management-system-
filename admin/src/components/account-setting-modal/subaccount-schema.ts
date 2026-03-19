import * as yup from "yup"
import { SubAccountType } from "@/types/subaccount"

export const subAccountSchema = yup.object().shape({
  businessName: yup.string().optional(),
  accountName: yup
    .string()
    .required("Account name is required")
    .min(2, "Account name must be at least 2 characters")
    .max(100, "Account name must not exceed 100 characters"),
  bankCode: yup
    .string()
    .required("Bank code is required")
    .matches(/^[0-9]+$/, "Bank code must contain only numbers")
    .min(3, "Bank code must be at least 3 digits")
    .max(10, "Bank code must not exceed 10 digits"),
  accountNumber: yup
    .string()
    .required("Account number is required")
    .matches(/^[0-9]+$/, "Account number must contain only numbers")
    .min(10, "Account number must be at least 10 digits")
    .max(20, "Account number must not exceed 20 digits"),
  type: yup.mixed<SubAccountType>().oneOf(Object.values(SubAccountType), "Invalid account type").optional(),
})

export type SubAccountFormData = yup.InferType<typeof subAccountSchema>
