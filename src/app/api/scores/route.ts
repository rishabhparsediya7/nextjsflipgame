import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();

  const client = await clientPromise;
  const db = client.db("test");

  const response = await db.collection("flipgame").insertOne({
    name: reqBody.name,
    scores: reqBody.scores,
  });
  if (response.acknowledged) return NextResponse.json({ success: true });
  return NextResponse.json({ success: false });
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const response = await db
      .collection("flipgame")
      .find()
      .sort({ scores: 1 })
      .limit(5)
      .toArray();
    return NextResponse.json({ data: response });
  } catch (error) {}
}
