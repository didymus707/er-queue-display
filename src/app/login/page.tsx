"use client";

import { login, State } from "./action";
import { useActionState } from "react";

export default function Login() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState<State, FormData>(
    login,
    initialState,
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">
            City General Hospital
          </p>
          <h1 className="text-2xl font-light tracking-tight text-neutral-900">
            Staff sign in
          </h1>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-neutral-600 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="name@hospital.com"
              className="w-full bg-white border border-neutral-200 rounded-md px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition"
            />
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email?.map((error) => (
                <p className="mt-2 text-xs text-red-600" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-neutral-600 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-white border border-neutral-200 rounded-md px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition"
            />
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state.errors?.password?.map((error) => (
                <p className="mt-2 text-xs text-red-600" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>

          <button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-md py-3 text-sm font-medium tracking-wide transition">
            Sign in
          </button>

          {state?.message && (
            <p className="text-red-600 text-xs text-center">{state.message}</p>
          )}
        </form>

        <p className="mt-4 text-center text-xs text-neutral-400 tracking-wide">
          Authorized staff only
        </p>
      </div>
    </div>
  );
}
