import notFound from "@/assets/404.svg";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 flex items-center justify-center p-3">
      <div className="w-full max-w-[580px] min-h-[296px] bg-gray-100 rounded-lg p-3 md:py-16 md:px-12 flex flex-col items-center justify-center text-center">
        <img src={notFound} alt="Logo" className="w-48" />

        <h2 className="mt-6 text-2xl font-bold">Link não encontrado</h2>

        <p className="mt-6 text-sm text-gray-500 font-semibold">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{" "}
          <a href="/" className="text-blue-base font-semibold underline">
            brev.ly.
          </a>
        </p>
      </div>
    </div>
  );
}
