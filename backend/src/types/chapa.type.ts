enum SplitType {
  PERCENTAGE = "percentage",
  FLAT = "flat",
}

export interface Subaccount {
  id: string;
  split_type?: SplitType;
  split_value?: number;
}

export interface InitializeOptions {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  currency: string;
  amount: string;
  tx_ref: string;
  callback_url?: string;
  return_url?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  subaccounts?: Subaccount[];
}

export interface InitializeResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}

export interface VerifyOptions {
  tx_ref: string;
}

export interface VerifyResponse {
  message: string;
  status: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    currency: string;
    amount: string;
    charge: string;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: {
      title: string;
      description: string;
      logo: string;
    };
    meta: any;
    created_at: Date;
    updated_at: Date;
  };
}

declare type Currency = "ETB" | "USD";

interface BanksData {
  id: number;
  swift: string;
  name: string;
  acct_length: number;
  country_id: number;
  created_at: Date;
  updated_at: Date;
  is_rtgs: boolean | null;
  is_mobilemoney: boolean | null;
  currency: Currency;
}
export interface GetBanksResponse {
  message: string;
  data: BanksData[];
}

export interface ITransactionWebhookResponse {
  event: string;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  mobile: string;
  currency: "ETB";
  amount: string;
  charge: string;
  status: "pending" | "success" | "failed" | "refunded" | "canceled";
  mode: "live" | "demo";
  reference: string;
  created_at: Date;
  updated_at: Date;
  type: "API";
  tx_ref: string;
  payment_method: string;
  customization: {
    title: string | null;
    description: string | null;
    logo: string | null;
  };
  meta: any;
}