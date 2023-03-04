export class Issue {
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
