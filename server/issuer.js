const fetch = require("node-fetch");
const msal = require("@azure/msal-node");
const config = require("./config.json");
const express = require("express");
const router = express.Router();

router.get("/issuance-request", async (req, res) => {
  try {
    const msalConfig = {
      auth: {
        clientId: config.azClientId,
        authority: `https://login.microsoftonline.com/${config.azTenantId}`,
        clientSecret: config.azClientSecret,
      },
    };

    const cca = new msal.ConfidentialClientApplication(msalConfig);
    const msalClientCredentialRequest = {
      scopes: ["bbb94529-53a3-4be5-a069-7eaf2712b826/.default"],
      skipCache: false,
    };
    const result = await cca.acquireTokenByClientCredential(
      msalClientCredentialRequest
    );

    const issuanceConfig = {
      includeQRCode: true,
      callback: {
        url: "http://localhost:8080/api/issuer/issuance-request-callback",
        state: "de19cb6b-36c1-45fe-9409-909a51292a9c",
      },
      authority:
        "did:ion:EiDwg4mauftr71Lapj9iSVwycMSPP7jf_jjJXSGwgq6X6Q:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfYzQzNDc2YTQiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiVmt2elpVWlZ6WmpMLWVEWTlVRmZzUWNRWkVxWFZ6cktNaWZsSlE5cloxQSIsInkiOiJRdjJ4U3IyT1paaVh4bVRobW04WUd4OXZ5Q1ZlV3lTNU9LM1BscEFvTnQwIn0sInB1cnBvc2VzIjpbImF1dGhlbnRpY2F0aW9uIiwiYXNzZXJ0aW9uTWV0aG9kIl0sInR5cGUiOiJFY2RzYVNlY3AyNTZrMVZlcmlmaWNhdGlvbktleTIwMTkifV0sInNlcnZpY2VzIjpbeyJpZCI6ImxpbmtlZGRvbWFpbnMiLCJzZXJ2aWNlRW5kcG9pbnQiOnsib3JpZ2lucyI6WyJodHRwczovL2FkaXR5YXBpbXBhbGthci5naXRodWIuY29tLyJdfSwidHlwZSI6IkxpbmtlZERvbWFpbnMifSx7ImlkIjoiaHViIiwic2VydmljZUVuZHBvaW50Ijp7Imluc3RhbmNlcyI6WyJodHRwczovL2JldGEuaHViLm1zaWRlbnRpdHkuY29tL3YxLjAvN2VkZDM1ZDYtNmEyYy00YzMwLThkOGYtMzFiMDQ4MWViYThkIl19LCJ0eXBlIjoiSWRlbnRpdHlIdWIifV19fV0sInVwZGF0ZUNvbW1pdG1lbnQiOiJFaUJPWk9VcTUtZUxfMGpaQnpVQWVhUnFKOWlwYW1RTVhOUF9TWm1kRjF5TEFBIn0sInN1ZmZpeERhdGEiOnsiZGVsdGFIYXNoIjoiRWlDVUgtRlQ0czI5aFdjeHhzMmEyT0dRT05Db3htZ1c3QW5lUmZsVFpvZmFtZyIsInJlY292ZXJ5Q29tbWl0bWVudCI6IkVpQ2ozZDRRN3NiNzNJNGRsVXNnTTl0ekVYV085N25majZiQU8tcUY5MEFfQ3cifX0",
      registration: {
        clientName: "Verifiable Credential Expert Sample",
      },
      issuance: {
        type: "VerifiedCredentialExpert",
        manifest: `https://beta.did.msidentity.com/v1.0/${config.azTenantId}/verifiableCredential/contracts/VerifiedCredentialExpert`,
        pin: {
          value: "3539",
          length: 4,
        },
        claims: {
          given_name: "Aditya",
          family_name: "Pimpalkar",
        },
      },
    };

    const accessToken = result.accessToken;

    let payload = JSON.stringify(issuanceConfig);
    const fetchOptions = {
      method: "POST",
      body: payload,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": payload.length.toString(),
        Authorization: `Bearer ${accessToken}`,
      },
    };

    var client_api_request_endpoint = `https://beta.did.msidentity.com/v1.0/${config.azTenantId}/verifiablecredentials/request`;
    const response = await fetch(client_api_request_endpoint, fetchOptions);
    var resp = await response.json();

    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/issuance-request-callback", async (req, res) => {
  console.log(req, res);
});

module.exports = router;
