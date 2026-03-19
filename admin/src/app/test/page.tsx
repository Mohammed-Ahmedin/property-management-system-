"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getBanks } from "@/server/actions/chapa.actions";
import axios from "axios";
import React from "react";

const Page = () => {
  const makeRequest = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer CHASECK_TEST-s3aSBrDwAZRhoB1NvwaWhdYUjqvRTZNt"
    );
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      business_name: "Abebe Souq",
      account_name: "Abebe Bikila ",
      bank_code: 128,
      account_number: "0123456789",
      split_value: 0.2,
      split_type: "percentage",
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("https://api.chapa.co/v1/subaccount", requestOptions as any)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };
  const { data } = authClient.useSession();
  return (
    <div>
      Name or email: {data?.user.email}
      <Button
        onClick={() => {
          makeRequest();
        }}
      >
        Create subaccount
      </Button>
    </div>
  );
};

export default Page;
