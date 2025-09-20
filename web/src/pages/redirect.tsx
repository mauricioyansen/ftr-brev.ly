import logoSrc from "@/assets/favicon.svg";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Spinner } from "phosphor-react";
import { NotFoundPage } from "./not-found";

interface LinkResponse {
  originalUrl: string;
}

export function RedirectPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const { data, isError } = useQuery<LinkResponse>({
    queryKey: ["redirect", code],
    queryFn: async () => {
      const response = await api.get(`/links/code/${code}`);
      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (data) {
      const url = data.originalUrl;
      setRedirectUrl(url);
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.location.replace(url);
      } else {
        console.error(`Protocolo inválido para redirecionamento: ${url}`);
        navigate("/not-found", { replace: true });
      }

      // const timer = setTimeout(() => {
      //   window.location.replace(data.originalUrl);
      // }, 10000);
      // return () => clearTimeout(timer);
    }
  }, [data]);

  if (isError) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-gray-200 text-gray-600 flex items-center justify-center p-3">
      <div className="w-full max-w-[580px] min-h-[296px] bg-gray-100 rounded-lg p-4 md:p-8 flex flex-col items-center justify-center text-center">
        <img src={logoSrc} alt="Logo" className="w-12 h-12" />

        <h2 className="mt-6 text-2xl font-bold">Redirecionando...</h2>
        <Spinner className="w-6 h-6 animate-spin text-blue-base my-4" />

        <p className="mt-2 text-sm text-gray-500 font-semibold">
          O link será aberto automaticamente em alguns instantes.
          <br />
          Não foi redirecionado?{" "}
          <a href={redirectUrl ?? "#"} className="text-blue-base underline">
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  );
}
