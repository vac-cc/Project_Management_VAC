import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Workspace from "@/pages/Workspace";
import { OperationsStateProvider } from "@/state/OperationsState";
import OnboardingDashboard from "@/pages/onboarding/Dashboard";
import OnboardingNewSession from "@/pages/onboarding/NewSession";
import OnboardingFlow from "@/pages/onboarding/OnboardingFlow";
import OnboardingSessionsList from "@/pages/onboarding/SessionsList";
import OnboardingSessionDetail from "@/pages/onboarding/SessionDetail";
import OnboardingBriefView from "@/pages/onboarding/BriefView";

const queryClient = new QueryClient();

// The live questionnaire is full screen (client facing), outside the
// Workspace shell, but keeps the Onboarding design scope.
function OnboardingFlowPage() {
  return (
    <div className="vac-onboarding">
      <OnboardingFlow />
    </div>
  );
}

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

      {/* Client Onboarding console (merged from the Onboarding app) */}
      <Route path="/onboarding" component={OnboardingDashboard} />
      <Route path="/onboarding/new" component={OnboardingNewSession} />
      <Route path="/onboarding/flow/:id" component={OnboardingFlowPage} />
      <Route path="/onboarding/sessions" component={OnboardingSessionsList} />
      <Route path="/onboarding/sessions/:id/brief" component={OnboardingBriefView} />
      <Route path="/onboarding/sessions/:id" component={OnboardingSessionDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OperationsStateProvider>
          {/* The claude.ai beta is a single page, so it routes on the URL hash */}
          <WouterRouter
            {...(import.meta.env.VITE_PREVIEW
              ? { hook: useHashLocation }
              : { base: import.meta.env.BASE_URL.replace(/\/$/, "") })}
          >
            <Router />
          </WouterRouter>
          <Toaster />
        </OperationsStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
