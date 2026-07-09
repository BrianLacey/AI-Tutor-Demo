"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { signUp, signIn } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const LoginPage = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: BaseSyntheticEvent) => {
    const { name, value } = e.target;
    setLogin((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSignIn = () => {
    signIn(login);
  };
  const handleSignUp = () => {
    signUp(login);
  };

  return (
    <div className="bg-slate-600 min-h-screen">
      <FieldSet className="w-96 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            name="email"
            type="email"
            placeholder="example@email.com"
            value={login.email}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            name="password"
            type="password"
            value={login.password}
            onChange={handleChange}
            required
          />
        </Field>
        <Field orientation="horizontal">
          <Button type="button" onClick={handleSignIn}>
            Sign In
          </Button>
          <Button type="button" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Field>
      </FieldSet>
    </div>
  );
};

export default LoginPage;
