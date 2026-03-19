export interface ChapaSubAccount {
  businessName?: string
  accountName: string
  bankCode: string
  accountNumber: string
  subAccountType: SubAccountType
}

export enum SubAccountType {
  BROKER = "BROKER",
  OWNER = "OWNER",
  PLATFORM = "PLATFORM",
}
