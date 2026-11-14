import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Loader2,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmationDialogVariant =
  | "destructive"
  | "warning"
  | "success"
  | "info";

export interface ConfirmationDialogProps {
  /** Controls dialog visibility */
  open: boolean;
  /** Callback when dialog visibility changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Main description text */
  description?: string;
  /** User or item name for emphasis */
  itemName?: string;
  /** Additional warning/important content */
  warningContent?: React.ReactNode;
  /** Text for cancel button */
  cancelText?: string;
  /** Text for confirm/action button */
  confirmText?: string;
  /** Variant determines colors and icon */
  variant?: ConfirmationDialogVariant;
  /** Loading state for action */
  isLoading?: boolean;
  /** Disabled state for action button */
  isDisabled?: boolean;
  /** Callback when confirm action is clicked */
  onConfirm?: () => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Custom class names */
  className?: string;
}

const variantConfig: Record<
  ConfirmationDialogVariant,
  {
    icon: React.ReactNode;
    iconColor: string;
    buttonColor: string;
    buttonHover: string;
    bgColor: string;
    textColor: string;
  }
> = {
  destructive: {
    icon: <ShieldAlert className="h-5 w-5" />,
    iconColor: "text-red-600",
    buttonColor: "bg-red-600",
    buttonHover: "hover:bg-red-700",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconColor: "text-amber-600",
    buttonColor: "bg-amber-600",
    buttonHover: "hover:bg-amber-700",
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
  },
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    iconColor: "text-green-600",
    buttonColor: "bg-green-600",
    buttonHover: "hover:bg-green-700",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    iconColor: "text-blue-600",
    buttonColor: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
  },
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  warningContent,
  cancelText = "Cancel",
  confirmText = "Confirm",
  variant = "destructive",
  isLoading = false,
  isDisabled = false,
  onConfirm,
  onCancel,
  className,
}) => {
  const config = variantConfig[variant];

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-[5px]" />
      <AlertDialogOverlay className="fixed inset-0 bg-black/50" />
      <AlertDialogContent
        className={cn(
          "max-w-[400px] w-full mx-4 p-8 rounded-2xl shadow-xl",
          className
        )}>
        <AlertDialogHeader className="space-y-6 flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              variant === "destructive" && "bg-red-100",
              variant === "warning" && "bg-amber-100",
              variant === "success" && "bg-green-100",
              variant === "info" && "bg-blue-100"
            )}>
            <div className={config.iconColor}>{config.icon}</div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <AlertDialogTitle className="text-xl font-medium text-gray-900 leading-tight">
              {title}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-base text-gray-600">
              {itemName && description ? (
                <>
                  {description?.replace("{itemName}", "")}
                  <strong className="font-semibold text-gray-900 ml-1.5">
                    {itemName}
                  </strong>
                  ?
                </>
              ) : (
                description
              )}
            </AlertDialogDescription>
          </div>

          {warningContent && (
            <div className={cn("p-4 rounded-lg w-full", config.bgColor)}>
              <div className="space-y-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium flex items-center justify-center gap-2",
                    config.textColor
                  )}>
                  <span>⚠️</span>
                  Important:
                </p>
                <div className={cn("text-sm space-y-1", config.textColor)}>
                  {warningContent}
                </div>
              </div>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row items-center justify-center gap-3 mt-6">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 h-11 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg">
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || isDisabled}
            className={cn(
              "flex-1 h-11 font-medium rounded-lg text-white",
              variant === "destructive" && "bg-red-600 hover:bg-red-700",
              variant === "warning" && "bg-amber-600 hover:bg-amber-700",
              variant === "success" && "bg-green-600 hover:bg-green-700",
              variant === "info" && "bg-blue-600 hover:bg-blue-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Pre-built variants for convenience
export const DestructiveDialog: React.FC<
  Omit<ConfirmationDialogProps, "variant">
> = (props) => <ConfirmationDialog variant="destructive" {...props} />;

export const WarningDialog: React.FC<
  Omit<ConfirmationDialogProps, "variant">
> = (props) => <ConfirmationDialog variant="warning" {...props} />;

export const SuccessDialog: React.FC<
  Omit<ConfirmationDialogProps, "variant">
> = (props) => <ConfirmationDialog variant="success" {...props} />;

export const InfoDialog: React.FC<Omit<ConfirmationDialogProps, "variant">> = (
  props
) => <ConfirmationDialog variant="info" {...props} />;

export default ConfirmationDialog;
