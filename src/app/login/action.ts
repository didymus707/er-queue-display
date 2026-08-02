"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import z from "zod";

export type State = {
  message?: string | null;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function login(prevState: State, formData: FormData) {
  const supabase = await createClient();

  const validatedFields = FormSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { message: error.message };
  }

  const { data: role } = await supabase.rpc("get_my_role");

  if (role === "receptionist") redirect("/receptionist");
  if (role === "doctor") redirect("/doctor");

  redirect("/");
}
