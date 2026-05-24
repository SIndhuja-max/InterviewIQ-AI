import { NextResponse } from "next/server";

const pdf = require("pdf-parse/lib/pdf-parse");

export async function POST(req) {

  try {

    const formData =
      await req.formData();

    const file =
      formData.get("resume");

    if (!file) {

      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded",
        },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const data =
      await pdf(buffer);

    console.log(
      "EXTRACTED PDF TEXT:",
      data.text
    );

    return NextResponse.json({
      success: true,
      text: data.text,
    });

  } catch (error) {

    console.log(
      "PDF ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}