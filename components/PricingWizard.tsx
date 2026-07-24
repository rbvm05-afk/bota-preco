"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculatePrice } from "@/lib/calculator";
import { saveCalculation } from "@/lib/storage";
import type { MaterialItem, PricingInput } from "@/types/pricing";
import { AppShell } from "./AppShell";
import { Field } from "./Field";
import { MaterialEditor } from "./MaterialEditor";
import { PrimaryButton } from "./PrimaryButton";
import { Progress } from "./Progress";
import { Tip } from "./Tip";

const newMaterial = (): MaterialItem => ({
  id: crypto.randomUUID(),
  name: "",
  paid: 0,
  packageAmount: 0,
  usedAmount: 0,
});

export function PricingWizard({ mode }: { mode: "rapidin" | "completin" }) {
  const router = useRouter();
  const isComplete = mode === "completin";

  const steps = useMemo(
    () =>
      isComplete
        ? ["Produto", "Ingredientes", "Rendimento", "Tempo", "Embalagem", "Outros gastos", "Margem"]
        : ["Produto", "Ingredientes", "Rendimento", "Tempo", "Embalagem", "Resultado"],
    [isComplete]
  );

  const [step, setStep] = useState(1);
  const [input, setInput] = useState<PricingInput>({
    productName: "",
    yieldAmount: 1,
    materials: [newMaterial()],
    workHours: 1,
    hourlyRate: 15,
    packagingPerUnit: 0,
    extraCosts: 0,
    desiredMargin: isComplete ? 35 : 30,
  });

  const totalSteps = steps.length;

  const update = <K extends keyof PricingInput>(field: K, value: PricingInput[K]) => {
    setInput((current) => ({ ...current, [field]: value }));
  };

  const next = () => {
    if (step < totalSteps) setStep((current) => current + 1);
  };

  const back = () => {
    if (step > 1) setStep((current) => current - 1);
    else router.push("/");
  };

  const finish = () => {
    const result = calculatePrice(input);
    const id = crypto.randomUUID();

    saveCalculation({
      id,
      createdAt: new Date().toISOString(),
      mode,
      input,
      result,
    });

    sessionStorage.setItem("bota-preco-current", JSON.stringify({ id, mode, input, result }));
    router.push("/resultado");
  };

  const heading = input.productName || "seu produto";

  return (
    <AppShell compact>
      <Progress current={step} total={totalSteps} labels={steps} />

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--cream)] p-5 shadow-sm sm:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Vamos começar.</p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                O que você vai fazer?
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Depois disso, a conversa fica com a cara do seu produto.
              </p>
            </div>
            <Field
              autoFocus
              label="Nome do produto"
              placeholder="Ex.: vela aromática"
              value={input.productName}
              onChange={(event) => update("productName", event.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Boa! Agora os materiais.</p>
              <h1 className="text-3xl font-black tracking-tight">
                O que entrou na conta da sua {heading}?
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Para cada item, diga quanto pagou, quanto veio e quanto usou.
              </p>
            </div>
            <MaterialEditor
              items={input.materials}
              onChange={(materials) => update("materials", materials)}
            />
            <Tip>
              Não precisa saber tudo de cabeça. Uma estimativa honesta já ajuda mais do que deixar o item de fora.
            </Tip>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Perfeito.</p>
              <h1 className="text-3xl font-black tracking-tight">
                Essa receita faz quantas unidades?
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Vamos dividir o gasto total entre todas as unidades prontas.
              </p>
            </div>
            <Field
              label="Quantidade pronta"
              type="number"
              min="1"
              step="1"
              value={input.yieldAmount}
              onChange={(event) => update("yieldAmount", Number(event.target.value))}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Sua hora também entra.</p>
              <h1 className="text-3xl font-black tracking-tight">
                Quanto tempo levou para fazer tudo?
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Inclua o tempo em que você realmente trabalhou na sua {heading}.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Horas de trabalho"
                type="number"
                min="0"
                step="0.25"
                value={input.workHours}
                onChange={(event) => update("workHours", Number(event.target.value))}
              />
              <Field
                label="Quanto vale sua hora?"
                type="number"
                min="0"
                step="0.01"
                value={input.hourlyRate}
                onChange={(event) => update("hourlyRate", Number(event.target.value))}
                hint="Colocamos R$ 15 só como referência. Você decide."
              />
            </div>
            <Tip>
              Tempo não é um detalhe. Quando ele fica fora da conta, você pode vender bastante e ainda sentir que não sobrou nada.
            </Tip>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Quase lá.</p>
              <h1 className="text-3xl font-black tracking-tight">
                Quanto custa a embalagem de cada unidade?
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Pote, caixa, etiqueta, fita, sacola... coloque tudo junto.
              </p>
            </div>
            <Field
              label="Embalagem por unidade"
              type="number"
              min="0"
              step="0.01"
              value={input.packagingPerUnit}
              onChange={(event) => update("packagingPerUnit", Number(event.target.value))}
            />
          </div>
        )}

        {isComplete && step === 6 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Agora os gastos que costumam sumir.</p>
              <h1 className="text-3xl font-black tracking-tight">
                Teve algum outro gasto para fazer esse lote?
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Energia, gás, entrega, ajuda de outra pessoa ou qualquer valor ligado a esse lote.
              </p>
            </div>
            <Field
              label="Outros gastos do lote"
              type="number"
              min="0"
              step="0.01"
              value={input.extraCosts}
              onChange={(event) => update("extraCosts", Number(event.target.value))}
            />
          </div>
        )}

        {isComplete && step === 7 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Última escolha.</p>
              <h1 className="text-3xl font-black tracking-tight">
                Qual margem você quer usar como referência?
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Essa porcentagem ajuda a formar uma reserva para crescer, errar e continuar.
              </p>
            </div>
            <Field
              label="Margem desejada (%)"
              type="number"
              min="0"
              max="89"
              step="1"
              value={input.desiredMargin}
              onChange={(event) => update("desiredMargin", Number(event.target.value))}
            />
            <Tip>
              Margem não é a mesma coisa que simplesmente somar uma porcentagem ao custo. O Bota Preço faz essa conta do jeito correto.
            </Tip>
          </div>
        )}

        {!isComplete && step === 6 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold text-[var(--green)]">Pronto!</p>
              <h1 className="text-3xl font-black tracking-tight">
                Já temos o necessário para montar uma boa referência.
              </h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                No Rapidin, usamos uma margem de 30% e deixamos gastos menores dentro da estimativa.
              </p>
            </div>
            <Tip>
              Depois você pode fazer o Completin para revisar mais detalhes e comparar os dois resultados.
            </Tip>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={back}
            className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 font-black hover:bg-[#f4f1eb]"
          >
            Voltar
          </button>

          {step === totalSteps ? (
            <PrimaryButton onClick={finish}>Ver quanto faz sentido cobrar</PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={next}
              disabled={step === 1 && !input.productName.trim()}
            >
              Continuar
            </PrimaryButton>
          )}
        </div>
      </section>
    </AppShell>
  );
}
