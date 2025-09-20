"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputWithPrefix } from "./input-with-prefix";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";


const createLinkSchema = z.object({
  url: z.url({ message: "Por favor, insira uma URL válida." }),
  code: z
    .string()
    .min(3, { message: "O código precisa ter no mínimo 3 caracteres." })
    .max(50, { message: "O código não pode ter mais de 50 caracteres." })
    .optional()
    .or(z.literal("")),
});

type CreateLinkData = z.infer<typeof createLinkSchema>;

export function CreateLinkForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      url: "",
      code: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: createLinkFn, isPending } = useMutation({
    mutationFn: async ({ url, code }: CreateLinkData) => {
      const payload = { url, code: code || undefined };
      await api.post("/links", payload);
    },
    onSuccess: () => {
      toast.success("Link criado com sucesso!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error("Este link encurtado já existe.");
      } else {
        toast.error("Ocorreu um erro ao criar o link. Tente novamente.");
      }
    },
  });

  async function onSubmit(values: CreateLinkData) {
    await createLinkFn(values);
  }

  const { isValid } = form.formState;
  const isButtonDisabled = !isValid || isPending;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Novo link</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-xs font-normal text-gray-500 group-focus-within:text-blue-dark group-focus-within:font-bold">
                  LINK ORIGINAL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://exemplo.com"
                    {...field}
                    className="bg-gray-100 h-12 border-2 border-gray-300 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-dark"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-xs font-normal text-gray-500 group-focus-within:text-blue-dark group-focus-within:font-bold">
                  LINK ENCURTADO (Opcional)
                </FormLabel>
                <FormControl>
                  <InputWithPrefix
                    prefix="brev.ly/"
                    placeholder="my-custom-link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-base h-12 hover:bg-blue-dark disabled:opacity-50"
            disabled={isButtonDisabled}
          >
            {isPending ? "Salvando..." : "Salvar Link"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
