"use client";
import React from "react";
import {
  AlertCircle,
  RefreshCw,
  XCircle,
  ServerCrash,
  Shield,
  Search,
  WifiOff,
} from "lucide-react";

// Support for RTK Query error types
interface FetchBaseQueryError {
  status: number | string;
  data?: unknown;
  error?: string;
}

interface SerializedError {
  name?: string;
  message?: string;
  code?: string;
  stack?: string;
}

interface CustomError {
  status?: number;
  message?: string;
  details?: string;
}

type ErrorType =
  | CustomError
  | FetchBaseQueryError
  | SerializedError
  | null
  | undefined;

interface ErrorComponentProps {
  error?: ErrorType;
  onRetry?: () => void;
  title?: string;
  fullScreen?: boolean;
  className?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  error,
  onRetry,
  title,
  fullScreen = false,
  className = "",
}) => {
  if (!error) return null;

  // Type guard functions
  const isFetchBaseQueryError = (
    err: ErrorType
  ): err is FetchBaseQueryError => {
    return err !== null && err !== undefined && "status" in err;
  };

  const isSerializedError = (err: ErrorType): err is SerializedError => {
    return err !== null && err !== undefined && "message" in err;
  };

  // Normalize error to extract status, message, and details
  const normalizeError = (err: ErrorType): CustomError => {
    if (!err) return { status: 500 };

    // Handle RTK Query FetchBaseQueryError
    if (isFetchBaseQueryError(err)) {
      const status =
        typeof err.status === "string"
          ? err.status === "FETCH_ERROR"
            ? 503
            : err.status === "PARSING_ERROR"
            ? 500
            : err.status === "TIMEOUT_ERROR"
            ? 504
            : 500
          : err.status;

      return {
        status,
        message:
          "error" in err && typeof err.error === "string"
            ? err.error
            : undefined,
        details:
          "data" in err && err.data ? JSON.stringify(err.data) : undefined,
      };
    }

    // Handle SerializedError
    if (isSerializedError(err)) {
      return {
        status: 500,
        message: err.message,
        details: err.code || err.name,
      };
    }

    // Handle custom error
    return err as CustomError;
  };

  const normalizedError = normalizeError(error);

  const getErrorDetails = () => {
    const status = normalizedError.status || 500;

    const errorMap: Record<
      number,
      {
        title: string;
        message: string;
        icon: typeof AlertCircle;
        color: string;
      }
    > = {
      400: {
        title: "Bad Request",
        message:
          "The request could not be understood by the server. Please check your input and try again.",
        icon: AlertCircle,
        color: "orange",
      },
      401: {
        title: "Unauthorized",
        message:
          "You need to be authenticated to access this resource. Please log in and try again.",
        icon: Shield,
        color: "yellow",
      },
      403: {
        title: "Access Denied",
        message:
          "You don't have permission to access this resource. Contact your administrator if you believe this is an error.",
        icon: Shield,
        color: "red",
      },
      404: {
        title: "Not Found",
        message:
          "The resource you're looking for could not be found. It may have been moved or deleted.",
        icon: Search,
        color: "blue",
      },
      500: {
        title: "Internal Server Error",
        message:
          "Something went wrong on our end. Our team has been notified and is working to fix the issue.",
        icon: ServerCrash,
        color: "red",
      },
      502: {
        title: "Bad Gateway",
        message:
          "The server received an invalid response. This is usually temporary, please try again in a moment.",
        icon: WifiOff,
        color: "red",
      },
      503: {
        title: "Service Unavailable",
        message:
          "The service is temporarily unavailable. We're working to restore it as quickly as possible.",
        icon: ServerCrash,
        color: "orange",
      },
      504: {
        title: "Gateway Timeout",
        message:
          "The server took too long to respond. Please try again in a moment.",
        icon: WifiOff,
        color: "orange",
      },
    };

    return (
      errorMap[status] || {
        title: "Unexpected Error",
        message:
          "An unexpected error occurred. Please try again or contact support if the problem persists.",
        icon: XCircle,
        color: "red",
      }
    );
  };

  const errorDetails = getErrorDetails();
  const Icon = errorDetails.icon;
  const displayTitle = title || errorDetails.title;
  const displayMessage = normalizedError.message || errorDetails.message;

  const colorClasses = {
    red: "bg-red-50 border-red-200 text-red-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
  } as const;

  const iconColorClass =
    colorClasses[errorDetails.color as keyof typeof colorClasses] ||
    colorClasses.red;

  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    : "w-full p-4";

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header Section */}
          <div
            className={`${iconColorClass.split(" ")[0]} border-b ${
              iconColorClass.split(" ")[1]
            } px-6 py-4`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-white shadow-sm`}>
                <Icon className={`h-6 w-6 ${iconColorClass.split(" ")[2]}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {displayTitle}
                </h3>
                {normalizedError.status && (
                  <p className="text-sm text-gray-600 font-medium mt-0.5">
                    Error Code: {normalizedError.status}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {displayMessage}
            </p>

            {normalizedError.details && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Technical Details
                </p>
                <p className="text-sm text-gray-800 font-mono wrap-break-word">
                  {normalizedError.details}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center space-x-2 bg-linear
                  -to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              )}

              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-all duration-200">
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact our{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 font-medium underline">
            support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorComponent;
