import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/shared/components/ui/sonner";
import { AuthProvider } from "@/core/auth/AuthProvider";
import { ErrorBoundary } from "@/core/error/ErrorBoundary";
import { queryClient } from "@/core/query/query-client";
import { ThemeProvider } from "@/shared/hooks/use-theme";
import { router } from "@/router";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
