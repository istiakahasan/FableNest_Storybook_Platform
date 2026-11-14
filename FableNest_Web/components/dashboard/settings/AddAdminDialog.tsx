import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddAdminMutation } from "@/store/api/dashboardApi";
import { toast } from "sonner";

// Define Zod schema for admin validation
const adminSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email is too long"),
});

type AdminFormData = z.infer<typeof adminSchema>;

// Initial form data
const initialFormData: AdminFormData = {
  firstName: "",
  lastName: "",
  email: "",
};

const AddAdminDialog = () => {
  const [open, setOpen] = useState(false);

  // Use the actual mutation
  const [addAdmin, { isLoading }] = useAddAdminMutation();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = async (formData: AdminFormData) => {
    try {
      // Call the actual mutation
      await addAdmin({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
      }).unwrap();

      reset();
      setOpen(false);
      toast.success("Admin added successfully!");
    } catch (error: any) {
      console.error("Error adding admin:", error);

      // Handle different error formats
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Failed to add admin. Please try again.";

      toast.error(errorMessage);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset(initialFormData);

    setOpen(false);
  };

  // Handle dialog open/close
  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset(initialFormData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full sm:w-auto bg-[#00244A] hover:bg-[#00244A]/90 transition ">
          <Plus className="h-4 w-4" />
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Admin</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter the details for the new admin user.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {/* First Name Field */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="firstName"
                className="text-lg font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                {...register("firstName")}
                className={`w-full border rounded-lg h-14 px-4 text-lg placeholder:text-gray-400 transition-colors ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="lastName"
                className="text-lg font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                {...register("lastName")}
                className={`w-full border rounded-lg h-14 px-4 text-lg placeholder:text-gray-400 transition-colors ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-lg font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register("email")}
                className={`w-full border rounded-lg h-14 px-4 text-lg placeholder:text-gray-400 transition-colors ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 bg-[#00244A] text-white font-medium rounded-lg hover:bg-[#00244A]/90 transition-colors">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Admin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;
