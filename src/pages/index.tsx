import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty(" O Nome é obrigatório")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),

  email: z
    .string()
    .nonempty("O E-mail é obrigatório")
    .email("Formato de E-mail inválido")
    .toLowerCase()
    .refine((email) => {
      return email.endsWith("@clickip.com.br");
    }, "o e-mail precisa ser da Click IP"),
  password: z.string().min(6, "A senha precisa ter no múnimo 6 caracteres"),

  techs: z
    .array(
      z.object({
        title: z.string().nonempty("O título é obrigatório"),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, "Insira pelo menos duas tecnologias"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function Home() {
  const [output, setOutput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append } = useFieldArray({
    control,
    name: "techs",
  });
  function addNewTech() {
    append({
      title: "",
      knowledge: 0,
    });
  }
  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
        action=""
      >
        <div className="flex flex-col gap-1 font-semibold">
          <label htmlFor="name">Nome</label>
          <input
            className="border border-zinc-600 bg-zinc-900  shadow-sm rounded h-10 px-3"
            type="text"
            {...register("name")}
          />
          {errors.name && <span> {errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1 font-semibold">
          <label htmlFor="email">E-mail</label>
          <input
            className="border border-zinc-600 bg-zinc-900  shadow-sm rounded h-10 px-3"
            type="email"
            {...register("email")}
          />
          {errors.email && <span> {errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1 font-semibold">
          <label htmlFor="password">Senha</label>
          <input
            className="border border-zinc-600 bg-zinc-900  shadow-sm rounded h-10 px-3"
            type="password"
            {...register("password")}
          />
          {errors.password && <span> {errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1 font-semibold">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              className="text-emerald-500 text-sm"
              onClick={addNewTech}
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    className="flex-1 border border-zinc-600 bg-zinc-900  shadow-sm rounded h-10 px-3"
                    type="text"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span>{errors.techs?.[index]?.title?.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    className=" w-16 border border-zinc-600 bg-zinc-900  shadow-sm rounded h-10 px-3"
                    type="number"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span> {errors.techs?.[index]?.knowledge?.message}</span>
                  )}
                </div>
              </div>
            );
          })}

          {errors.techs && <span> {errors.techs.message}</span>}
        </div>

        <button
          className="bg-emerald-500 rounded font-semibold p-2 text-white"
          type="submit"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  );
}
