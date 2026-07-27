export type ProductSuggestion = {
  id: string;
  name: string;
  group: string;
  aliases: string[];
  kind?: "base" | "format" | "flavor";
};

export const productCatalog: ProductSuggestion[] = [
  { id: "PROD001", name: "Brigadeiro", group: "Doces", aliases: ["brigadeiro tradicional", "docinho"], kind: "base" },
  { id: "PROD016", name: "Brigadeiro gourmet", group: "Doces", aliases: ["brigadeiro premium"], kind: "format" },
  { id: "PROD017", name: "Brigadeiro de colher", group: "Doces", aliases: ["brigadeiro na colher"], kind: "format" },
  { id: "PROD018", name: "Brigadeiro de pote", group: "Doces", aliases: ["brigadeiro no pote"], kind: "format" },
  { id: "PROD019", name: "Brigadeiro de pistache", group: "Doces", aliases: ["brigadeiro pistache"], kind: "flavor" },
  { id: "PROD020", name: "Brigadeiro de paçoca", group: "Doces", aliases: ["brigadeiro pacoca"], kind: "flavor" },
  { id: "PROD021", name: "Brigadeiro de leite Ninho", group: "Doces", aliases: ["brigadeiro ninho"], kind: "flavor" },
  { id: "PROD002", name: "Bolo de pote", group: "Doces", aliases: ["bolo no pote"], kind: "base" },
  { id: "PROD022", name: "Bolo caseiro", group: "Doces", aliases: ["bolo simples"], kind: "base" },
  { id: "PROD023", name: "Bolo de chocolate", group: "Doces", aliases: [], kind: "flavor" },
  { id: "PROD003", name: "Brownie", group: "Doces", aliases: ["brownies"], kind: "base" },
  { id: "PROD004", name: "Trufa", group: "Doces", aliases: ["trufa de chocolate"], kind: "base" },
  { id: "PROD005", name: "Marmita", group: "Comida", aliases: ["marmitex", "quentinha"], kind: "base" },
  { id: "PROD006", name: "Marmita fit", group: "Comida", aliases: ["marmita saudável", "marmita fitness"], kind: "format" },
  { id: "PROD024", name: "Marmita congelada", group: "Comida", aliases: [], kind: "format" },
  { id: "PROD025", name: "Marmita low carb", group: "Comida", aliases: [], kind: "format" },
  { id: "PROD007", name: "Salgado", group: "Comida", aliases: ["salgadinho", "salgados"], kind: "base" },
  { id: "PROD008", name: "Coxinha", group: "Comida", aliases: ["coxinhas"], kind: "base" },
  { id: "PROD009", name: "Vela", group: "Artesanato", aliases: ["velas"], kind: "base" },
  { id: "PROD010", name: "Vela aromática", group: "Artesanato", aliases: ["vela perfumada", "vela cheirosa"], kind: "format" },
  { id: "PROD011", name: "Vela de pote", group: "Artesanato", aliases: ["vela no pote"], kind: "format" },
  { id: "PROD026", name: "Vela de citronela", group: "Artesanato", aliases: [], kind: "flavor" },
  { id: "PROD012", name: "Sabonete artesanal", group: "Artesanato", aliases: ["sabonete caseiro"], kind: "base" },
  { id: "PROD013", name: "Peça de crochê", group: "Artesanato", aliases: ["croche", "crochê"], kind: "base" },
  { id: "PROD014", name: "Amigurumi", group: "Artesanato", aliases: ["boneco de crochê", "boneco de croche"], kind: "base" },
  { id: "PROD015", name: "Sabão artesanal", group: "Artesanato", aliases: ["sabão caseiro", "sabao artesanal"], kind: "base" },
];
