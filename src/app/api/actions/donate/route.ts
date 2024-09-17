import { NextResponse } from "next/server";
import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { url } from "inspector";

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    icon: "https://pbs.twimg.com/profile_images/1131624264405327873/1YpVVtxD_400x400.jpg",
    title: "Buy me coffee",
    description: "Buy me a coffee",
    label: "Sponsor",
    links: {
      actions: [
        {
          href: "api/actions/donate?amount=0.1",
          label: "0.1 SOL",
        },
        {
          href: "api/actions/donate?amount=0.5",
          label: "0.5 SOL",
        },
        {
          href: "api/actions/donate?amount={amount}",
          label: "Send SOL",
          parameters: [
            {
              name: "amount",
              label: "Enter amount of SOL",
            },
          ],
        },
      ],
    },
  };

  return NextResponse.json(payload, { headers: ACTIONS_CORS_HEADERS });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    console.log(requestUrl);
    const body: ActionPostRequest = await req.json();

    let accountKey: PublicKey;

    try {
      accountKey = new PublicKey(body.account);
    } catch (error) {
      throw "invalid account";
    }

    let amount: number = 0.1;

    if (requestUrl.searchParams.has("amount")) {
      try {
        amount =
          parseFloat(requestUrl.searchParams.get("amount") || "0.1") || amount;
      } catch (error) {
        throw "Invalid amount";
      }
    }

    const connection = new Connection(clusterApiUrl("devnet"));

    const PUBKEY = new PublicKey(
      "7B4fEzU4zbU8skvWRH9BFCJ5V4stn9Cw9sTp17T9xEAD"
    );

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: accountKey,
        toPubkey: PUBKEY,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    transaction.feePayer = accountKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Thanks for the coffee :)",
      },
    });

    return NextResponse.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    let message = "An unknow error occurred";
    if (typeof error == "string") message = error;

    return NextResponse.json(
      {
        message,
      },
      {
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};
