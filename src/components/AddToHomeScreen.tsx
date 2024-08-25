import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const AddToHomeScreenPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const lastPrompt = localStorage.getItem("a2hs-last-prompt");
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const now = Date.now();

    // Check if the prompt should be shown again
    if (!lastPrompt || now - parseInt(lastPrompt) > oneDay) {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener("beforeinstallprompt", handler);

      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
        localStorage.setItem("a2hs-last-prompt", Date.now().toString());
      });
    }
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
    localStorage.setItem("a2hs-last-prompt", Date.now().toString());
  };

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Zlaark to Home Screen</DialogTitle>
          <DialogDescription>
            Get quick access to Zlaark by adding it to your home screen.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={handleRemindLater}>
            Remind me later
          </Button>
          <Button onClick={handleInstall}>Add to Home Screen</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToHomeScreenPrompt;
