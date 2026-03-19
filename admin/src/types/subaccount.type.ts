export interface SubAccount {
  type: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  businessName: string | null;
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  chapaSubId: string;
  splitType: string;
  splitValue: number;
  balance: number;
  ownerId: string;
}