"use client";

import { useState, useContext, type BaseSyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { GlobalContext } from "../contexts";
import CustomAlert from "../CustomComponents/customAlert";

const LoginPage = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // @ts-ignore
  const { setCurrentUser, pageLoading, setPageLoading, setAlertProps } =
    useContext(GlobalContext);

  const handleChange = (e: BaseSyntheticEvent) => {
    const { name, value } = e.target;
    setLogin((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn(login);
      if (result.ok) {
        const { user } = result;
        setPageLoading(true);
        setCurrentUser(user);
        router.push("/");
        setLoading(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      setAlertProps({
        type: "error",
        title: "Error",
        description: (error as Error).message,
        isOpen: true,
      });
      setLoading(false);
    }
  };
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signUp(login);
      if (result.ok) {
        const { user } = result;
        setPageLoading(true);
        setCurrentUser(user);
        router.push("/");
        setLoading(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      setAlertProps({
        type: "error",
        title: "Error",
        description: (error as Error).message,
        isOpen: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <CustomAlert />
      <div className="relative flex-1 h-full">
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
            <Button type="button" onClick={handleSignIn} disabled={loading}>
              Sign In
            </Button>
            <Button type="button" onClick={handleSignUp} disabled={loading}>
              Sign Up
            </Button>
          </Field>
        </FieldSet>
      </div>
    </>
  );
};

export default LoginPage;
