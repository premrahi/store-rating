import { useState } from "react";
import { createUser } from "../store/userSlice";
import { useAppDispatch } from "../store/hooks";
import UserForm from "../components/UserForm";
import PageHeader from "../components/PageHeader";
import type { UserFormData } from "../types";

export default function AddUser() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useAppDispatch();
  const handleCreate = async (
    form: UserFormData | Omit<UserFormData, "role">,
  ) => {
    setError("");
    setSuccess("");
    try {
      await dispatch(createUser(form)).unwrap();
      setSuccess("User created successfully.");
      return true;
    } catch (err) {
      setError(String(err));
      return false;
    }
  };
  return (
    <div className="page-shell max-w-2xl">
      <PageHeader
        eyebrow="Administration"
        title="Add user"
        description="Create a new account and assign the appropriate platform role."
      />
      <UserForm
        showRole
        onSubmit={handleCreate}
        submitLabel="Create user"
        error={error}
        success={success}
      />
    </div>
  );
}
