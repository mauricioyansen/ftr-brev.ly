import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Trash } from "phosphor-react";
import { toast } from "sonner";
import { Link as RouterLink } from "react-router-dom";

interface LinkListItemProps {
  link: {
    id: string;
    code: string;
    originalUrl: string;
    accessCount: number;
  };
  onDelete: () => void;
}

export function LinkListItem({ link, onDelete }: LinkListItemProps) {
  const shortLink = `${import.meta.env.VITE_FRONTEND_URL}/${link.code}`;

  async function handleCopyLink(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    try {
      await navigator.clipboard.writeText(shortLink);
      toast.success("Link copiado para a área de transferência!");
    } catch (err) {
      toast.error("Falha ao copiar o link.");
    }
  }

  return (
    <RouterLink
      to={`/${link.code}`}
      className="block"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-[50%]">
          <p className="font-bold text-lg truncate">
            {shortLink.replace(/^https?:\/\//, "")}
          </p>
          <p className="text-sm text-gray-400 truncate">{link.originalUrl}</p>
        </div>

        <div className="text-sm text-gray-400">{link.accessCount} acessos</div>

        <div className="flex items-center gap-1">
          {" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCopyLink}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-200 border-2 border-transparent hover:border-blue-dark"
                >
                  {" "}
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copiar link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    onDelete();
                  }}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-danger bg-gray-200 hover:bg-gray-200 mr-3"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deletar link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </RouterLink>
  );
}
