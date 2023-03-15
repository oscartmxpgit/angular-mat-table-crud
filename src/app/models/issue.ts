export class Issue {
  loteId: number;
  cajaId: string;
  id: number;
  descripcion: string;
  pesoUnitario: number;
  cantidad: number;
  categoria: string;
  created_at: string;
  updated_at: string;
  destinatario1?: string;
  destinatario2?: string;
  destinatario3?: string;
  observaciones?: string;
}

export class Caja {
  loteId: number;
  cajaId: string;
  peso: number;
  observaciones: string;
}
