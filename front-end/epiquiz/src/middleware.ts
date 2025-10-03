// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;

  // Pas de token → on redirige vers /login
    if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

  // (Optionnel) tu pourrais aussi vérifier la validité du JWT ici
    return NextResponse.next();
}

// Protège uniquement /quiz/*
export const config = {
    matcher: ["/quiz/:id"],
};
