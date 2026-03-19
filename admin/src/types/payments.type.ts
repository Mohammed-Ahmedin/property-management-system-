export interface Payment {
  id: string;
  status: string;
  bookingId: string;
  createdAt: Date;
  updatedAt: Date;
  amount: number | null;
  transactionRef: string | null;
  transactionId: string | null;
  phoneNumber: string | null;
  method: string;
  chapaSubAccountId: string | null;
  metadata: string;
}