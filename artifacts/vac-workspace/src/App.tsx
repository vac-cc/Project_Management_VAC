import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Workspace from "@/pages/Workspace";
import { OperationsStateProvider } from "@/state/OperationsState";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Workspace} />
      <Route path="/projects" component={Workspace} />
      <Route path="/clients" component={Workspace} />
      <Route path="/finance" component={Workspace} />
      <Route path="/vault" component={Workspace} />
      <Route path="/team" component={Workspace} />
      <Route path="/settings" component={Workspace} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OperationsStateProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </OperationsStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
