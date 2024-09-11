import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";
import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
  ActionError,
  createActionHeaders,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

const headers = createActionHeaders()

export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url);
    const { toPubKey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/action/transfer-sol?to=${toPubKey.toBase58()}`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: "Transfer SOL",
      icon: "https://miro.medium.com/v2/resize:fit:1358/1*cHaGBi18oWjdKPnrf7pcEg.jpeg",
      description: "Transfer Solana Token",
      label: "Transfer",
      links: {
        actions: [
          {
            label: "Send 1 SOL",
            href: `${baseHref}&amount=${"1"}`,
          },
          {
            label: "Send 5 SOL",
            href: `${baseHref}&amount=${"5"}`,
          },
          {
            label: "Send SOL",
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: "Enter amount of SOL to send",
                required: true,
              },
            ],
          },
        ],
      },
    };
    return NextResponse.json(payload, {
      headers
    })
  } catch (error) {
    console.log(error);
    let actionError: ActionError = {message: "An unknow error occured"}
    if (typeof error === "string") actionError.message = error;
    return NextResponse.json(actionError, {
      status: 400,
      headers,
    })
  }
}

//This will ensure CORS works fine.
export async function OPTIONS() {
  return NextResponse.json(null, {headers})
}

export async function POST(req: NextRequest) {
  
}

function validatedQueryParams(requestUrl: URL) {
  let toPubKey: PublicKey = DEFAULT_SOL_ADDRESS;
  let amount: number = DEFAULT_SOL_AMOUNT;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubKey = new PublicKey(requestUrl.searchParams.get("to") as string);
    }
  } catch (error) {
    throw "Invalid input query: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount") as string);
    }

    if (amount <= 0) {
      throw "amount too small";
    }
  } catch (error) {
    throw "Invalid input query: amount";
  }

  return {
    amount,
    toPubKey,
  };
}

