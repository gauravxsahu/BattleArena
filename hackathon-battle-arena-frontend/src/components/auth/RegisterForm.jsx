import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { registerValidationRules } from "../../utils/validators";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (values) => {
    setSubmitError(null);
    try {
      await registerUser(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <ErrorMessage message={submitError} />

      <Input
        label="Name"
        icon={User}
        placeholder="Ada Lovelace"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name", registerValidationRules.name)}
      />

      <Input
        label="Email"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", registerValidationRules.email)}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password", registerValidationRules.password)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-3 top-[38px] text-arena-muted hover:text-arena-text"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <Input
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        icon={Lock}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create Account
      </Button>

      <p className="text-center text-sm text-arena-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-arena-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
