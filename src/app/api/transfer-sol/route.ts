import {type NextRequest, NextResponse } from "next/server";
import {DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT} from "./const"
import {ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse, ActionError} from "@solana/actions"
import {clusterApiUrl, Connection, SystemProgram, Transaction, PublicKey} from "@solana/web3.js"

export async function GET(req: NextRequest) {
    
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body)
    return NextResponse.json({body})
}