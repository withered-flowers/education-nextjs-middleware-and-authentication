import { createUser, getUsers } from "@/db/models/user";
import { NextResponse } from "next/server";
import { z } from "zod";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

const userInputSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  super_admin: z.boolean().optional(),
  original_name: z.string().optional(),
});

// GET /api/users
export const GET = async () => {
  const users = await getUsers();

  return Response.json(
    {
      statusCode: 200,
      message: "Pong from GET /api/users !",
      data: users,
    },
    {
      status: 200,
    },
  );
};

// POST /api/users
export const POST = async (request: Request) => {
  try {
    const data = await request.json();

    const parsedData = userInputSchema.safeParse(data);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const user = await createUser(parsedData.data);

    return NextResponse.json<MyResponse<unknown>>(
      {
        statusCode: 201,
        message: "Pong from POST /api/users !",
        data: user,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err);

      const errPath = err.issues[0].path[0];
      const errMessage = err.issues[0].message;

      return NextResponse.json<MyResponse<never>>(
        {
          statusCode: 400,
          error: `${errPath} - ${errMessage}`,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json<MyResponse<never>>(
      {
        statusCode: 500,
        message: "Internal Server Error !",
      },
      {
        status: 500,
      },
    );
  }
};
