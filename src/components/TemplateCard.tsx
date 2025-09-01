import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { IpcClient } from "@/ipc/ipc_client";
import { useSettings } from "@/hooks/useSettings";
import { CommunityCodeConsentDialog } from "./CommunityCodeConsentDialog";
import type { Template } from "@/shared/templates";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { showWarning } from "@/lib/toast";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
  onCreateApp: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onCreateApp,
}) => {
  const { settings, updateSettings } = useSettings();
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  const handleCardClick = () => {
    // If it's a community template and user hasn't accepted community code yet, show dialog
    if (!template.isOfficial && !settings?.acceptedCommunityCode) {
      setShowConsentDialog(true);
      return;
    }

    if (template.requiresNeon && !settings?.neon?.accessToken) {
      showWarning("Please connect your Neon account to use this template.");
      return;
    }

    // Otherwise, proceed with selection
    onSelect(template.id);
  };

  const handleConsentAccept = () => {
    // Update settings to accept community code
    updateSettings({ acceptedCommunityCode: true });

    // Select the template
    onSelect(template.id);

    // Close dialog
    setShowConsentDialog(false);
  };

  const handleConsentCancel = () => {
    // Just close dialog, don't update settings or select template
    setShowConsentDialog(false);
  };

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (template.githubUrl) {
      IpcClient.getInstance().openExternalUrl(template.githubUrl);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`
          glass-panel rounded-xl overflow-hidden
          transform transition-all duration-300 ease-in-out
          cursor-pointer group relative
          ${
            isSelected
              ? "outline outline-2 outline-white/20 shadow-xl"
              : "hover:shadow-lg hover:-translate-y-1"
          }
        `}
      >
        <div className="relative">
          <img
            src={template.imageUrl}
            alt={template.title}
            className={`w-full h-52 object-cover transition-opacity duration-300 group-hover:opacity-80 ${
              isSelected ? "opacity-75" : ""
            }`}
          />
          {isSelected && (
            <span className="absolute top-3 right-3 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg">
              Selected
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-1.5">
            <h2
              className={`text-lg font-semibold ${
                isSelected
                  ? "text-zinc-100"
                  : "text-zinc-100"
              }`}
            >
              {template.title}
            </h2>
            {template.isOfficial && !template.isExperimental && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-black/60 text-zinc-200`}
              >
                Official
              </span>
            )}
            {template.isExperimental && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/60 text-zinc-200">
                Experimental
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 h-10 overflow-y-auto">
            {template.description}
          </p>
          {template.githubUrl && (
            <a
              className={`inline-flex items-center text-sm font-medium transition-colors duration-200 text-zinc-200 hover:text-white`}
              onClick={handleGithubClick}
            >
              View on GitHub{" "}
              <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
            </a>
          )}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCreateApp();
            }}
            size="sm"
            className={cn(
              "w-full bg-black hover:bg-zinc-900 text-white font-semibold mt-2",
              settings?.selectedTemplateId !== template.id && "invisible",
            )}
          >
            Create App
          </Button>
        </div>
      </div>

      <CommunityCodeConsentDialog
        isOpen={showConsentDialog}
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </>
  );
};
