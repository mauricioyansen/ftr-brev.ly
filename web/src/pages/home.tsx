import { CreateLinkForm } from "./components/create-link-form";
import logoSrc from "@/assets/logo.svg";
import { LinksList } from "./components/links-list";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 flex items-center justify-center p-3">
      <div className="flex flex-col items-center md:items-start w-full max-w-[980px]">
        <div className="w-24 h-6 mb-8 mt-5 md:mt-0">
          <img src={logoSrc} alt="Logo" />
        </div>
        <main className="flex flex-col md:flex-row items-start gap-3 md:gap-5 w-full">
          <div className="w-full md:w-[380px] flex-shrink-0 h-auto min-h-[340px] rounded-lg bg-gray-100 p-8">
            <CreateLinkForm />
          </div>
          <div className="w-full md:flex-1 md:max-w-[580px] h-auto md:min-w-0 rounded-lg bg-gray-100 p-8">
            <LinksList />
          </div>
        </main>
      </div>
    </div>
  );
}
