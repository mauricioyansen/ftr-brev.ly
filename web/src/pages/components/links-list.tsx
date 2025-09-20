import { Button } from "@/components/ui/button";
import { DownloadSimple, Link, Spinner } from "phosphor-react";
import { LinkListItem } from "./link-list-item";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface LinkData {
  id: string;
  code: string;
  originalUrl: string;
  accessCount: number;
  createdAt: string;
}

export function LinksList() {
  const queryClient = useQueryClient();

  const { data: links, isLoading } = useQuery<LinkData[]>({
    queryKey: ["links"],
    queryFn: async () => {
      const response = await api.get("/links");
      return response.data;
    },
  });

  const { mutateAsync: deleteLinkFn } = useMutation({
    mutationFn: async (linkId: string) => {
      await api.delete(`/links/${linkId}`);
    },
    onMutate: async (linkId: string) => {
      await queryClient.cancelQueries({ queryKey: ["links"] });

      const previousLinks = queryClient.getQueryData<LinkData[]>(["links"]);

      queryClient.setQueryData<LinkData[]>(["links"], (old) =>
        old ? old.filter((link) => link.id !== linkId) : []
      );

      return { previousLinks };
    },
    onError: (error, _variables, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(["links"], context.previousLinks);
      }
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error("Link não encontrado.");
      } else {
        toast.error("Ocorreu um erro ao deletar o link.");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onSuccess: () => {
      toast.success("Link deletado!");
    },
  });

  const { mutateAsync: exportCsvFn, isPending: isExporting } = useMutation({
    mutationFn: async () => {
      const response = await api.post<{ url: string | null }>("/links/export");
      return response.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        const link = document.createElement("a");
        link.href = data.url;
        const date = new Date().toISOString().split("T")[0];
        link.setAttribute("download", `links-export-${date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("A exportação foi concluída!");
      } else {
        toast.info("Não há links para exportar.");
      }
    },
    onError: () => {
      toast.error("Ocorreu um erro ao exportar o CSV.");
    },
  });

  async function handleExportCsv() {
    await exportCsvFn();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Meus links</h2>
        <Button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="bg-gray-200 text-gray-500 border-2 border-transparent hover:border-blue-dark hover:bg-gray-200"
        >
          {isExporting ? (
            <Spinner className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <DownloadSimple className="w-4 h-4 mr-2" />
          )}
          {isExporting ? "Exportando..." : "Baixar CSV"}
        </Button>
      </div>

      <div className="mt-5 border-t border-gray-300 max-h-[270px] overflow-y-auto divide-y divide-gray-300">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="w-8 h-8 animate-spin text-gray-400 mt-6" />
          </div>
        ) : links && links.length > 0 ? (
          links.map((link) => (
            <div className="py-4" key={link.id}>
              <LinkListItem
                link={link}
                onDelete={() => deleteLinkFn(link.id)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Link className="w-10 h-10" />
            <p className="mt-2 text-preset-xs">
              AINDA NÃO EXISTEM LINKS CADASTRADOS
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
