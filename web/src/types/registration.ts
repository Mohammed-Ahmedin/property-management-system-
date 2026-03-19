import * as yup from "yup"

export const registrationSchema = yup
  .object({
    // Step 1: Account Type
    registrationType: yup
      .string()
      .oneOf(["OWNER", "BROKER"], "Please select a registration type")
      .required("Registration type is required"),

    // Step 2: Property/Company Info
    propertyType: yup
      .string()
      .oneOf(["HOTEL", "GUEST_HOUSE", "RESORT"], "Please select a property type")
      .required("Property type is required"),
    companyName: yup.string().when("registrationType", {
      is: "OWNER",
      then: (schema) => schema.required("Company name is required").min(2),
      otherwise: (schema) => schema.notRequired(),
    }),
    companyDescription: yup.string().when("registrationType", {
      is: "OWNER",
      then: (schema) => schema.required("Description is required").min(20),
      otherwise: (schema) => schema.notRequired(),
    }),

    // Step 3: Personal Info
    fullName: yup.string().required("Full name is required").min(2),
    email: yup.string().required("Email is required").email("Invalid email"),
    phone: yup.string().required("Phone is required"),
    password: yup.string().required("Password is required").min(8),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm password"),
  })
  .required()

export type RegistrationFormData = yup.InferType<typeof registrationSchema>
