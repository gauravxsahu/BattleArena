import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Github, Linkedin, Image } from "lucide-react";
import Input from "../ui/Input.jsx";
import Textarea from "../ui/Textarea.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import { EXPERIENCE_LEVELS, EXPERIENCE_LABELS } from "../../utils/constants";
import { isValidUrl } from "../../utils/validators";

export default function ProfileForm({ profile, onSave, isSaving, saveError, saveSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: "",
      avatar: "",
      experienceLevel: "BEGINNER",
      githubUrl: "",
      linkedinUrl: "",
      preferredTechnologies: "",
      interests: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      bio: profile.bio || "",
      avatar: profile.avatar || "",
      experienceLevel: profile.experienceLevel || "BEGINNER",
      githubUrl: profile.githubUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      preferredTechnologies: (profile.preferredTechnologies || []).join(", "),
      interests: (profile.interests || []).join(", "),
    });
  }, [profile, reset]);

  const submit = (values) => {
    onSave({
      bio: values.bio || undefined,
      avatar: values.avatar || undefined,
      experienceLevel: values.experienceLevel,
      githubUrl: values.githubUrl || undefined,
      linkedinUrl: values.linkedinUrl || undefined,
      preferredTechnologies: values.preferredTechnologies
        ? values.preferredTechnologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      interests: values.interests ? values.interests.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <ErrorMessage message={saveError} />
      {saveSuccess && (
        <div className="rounded-xl border border-arena-accent/30 bg-arena-accent/10 px-4 py-3 text-sm text-arena-accent">
          Profile updated successfully.
        </div>
      )}

      <Textarea label="Bio" placeholder="Tell teammates about yourself..." maxLength={1000} error={errors.bio?.message} {...register("bio")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Avatar URL" icon={Image} placeholder="https://..." error={errors.avatar?.message} {...register("avatar", { validate: (v) => !v || isValidUrl(v) || "Must be a valid URL" })} />
        <Select
          label="Experience Level"
          options={EXPERIENCE_LEVELS.map((level) => ({ value: level, label: EXPERIENCE_LABELS[level] }))}
          {...register("experienceLevel")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="GitHub URL" icon={Github} placeholder="https://github.com/you" error={errors.githubUrl?.message} {...register("githubUrl", { validate: (v) => !v || isValidUrl(v) || "Must be a valid URL" })} />
        <Input label="LinkedIn URL" icon={Linkedin} placeholder="https://linkedin.com/in/you" error={errors.linkedinUrl?.message} {...register("linkedinUrl", { validate: (v) => !v || isValidUrl(v) || "Must be a valid URL" })} />
      </div>

      <Input label="Preferred Technologies" placeholder="React, Node.js, PostgreSQL (comma-separated)" {...register("preferredTechnologies")} />
      <Input label="Interests" placeholder="AI, Open Source, Game Dev (comma-separated)" {...register("interests")} />

      <Button type="submit" isLoading={isSaving}>
        Save Changes
      </Button>
    </form>
  );
}
