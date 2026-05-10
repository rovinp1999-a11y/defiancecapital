import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="min-h-[80vh] grid place-items-center container-page py-20">
      <div className="text-center max-w-lg">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Error 404
        </p>
        <h1 className="display-1 text-[clamp(56px,12vw,160px)] mt-4">
          Lost in
          <br />
          <span className="font-serif italic font-normal text-muted-foreground">
            the chain.
          </span>
        </h1>
        <p className="mt-6 text-muted-foreground">
          We couldn&apos;t find what you were looking for.
        </p>
        <div className="mt-9 flex gap-3 justify-center">
          <Button asChild variant="primary" size="lg">
            <Link to="/">
              <Home className="h-4 w-4" />
              Take me home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
