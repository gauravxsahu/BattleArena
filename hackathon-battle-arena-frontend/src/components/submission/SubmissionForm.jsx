import { useForm } from "react-hook-form";
import { Github, Link as LinkIcon } from "lucide-react";
import Input from "../ui/Input.jsx";
import Textarea from "../ui/Textarea.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import { submissionValidationRules } from "../../utils/validators";

export default function SubmissionForm({ onSubmit, isSubmitting, submitError, disabled }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <ErrorMessage message={submitError} />

      <Input
        label="GitHub Repository URL"
        icon={Github}
        placeholder="https://github.com/your-team/project"
        disabled={disabled}
        error={errors.githubUrl?.message}
        {...register("githubUrl", submissionValidationRules.githubUrl)}
      />

      <Input
        label="Demo URL (optional)"
        icon={LinkIcon}
        placeholder="https://your-demo.vercel.app"
        disabled={disabled}
        error={errors.demoUrl?.message}
        {...register("demoUrl", submissionValidationRules.demoUrl)}
      />

      <Textarea
        label="Description"
        placeholder="What did your team build? What should judges know?"
        disabled={disabled}
        error={errors.description?.message}
        {...register("description", submissionValidationRules.description)}
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={disabled}>
        Submit Final Solution
      </Button>
    </form>
  );
}
