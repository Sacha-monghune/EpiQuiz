"use client";

import { useState } from "react";
import LoginPage from "./login/login";

export default function MainPage() {
  const [login, setLogin] = useState("");
  return (
    <div>
      <LoginPage />
    </div>
  );
}
