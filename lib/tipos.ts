export type StatusImobiliaria = 'pendente' | 'aprovada' | 'rejeitada'
export type StatusCAD = 'ativo' | 'cancelado'
export type StatusDoc = 'pendente' | 'enviado' | 'aprovado' | 'rejeitado'

export interface Empreendimento {
  id: string
  nome: string
  prefixo: string
  cidade?: string
  created_at: string
}

export interface Imobiliaria {
  id: string
  empreendimento_id: string
  razao_social: string
  cnpj?: string
  creci?: string
  responsavel?: string
  email?: string
  telefone?: string
  status: StatusImobiliaria
  created_at: string
}

export interface Corretor {
  id: string
  imobiliaria_id: string
  nome: string
  creci?: string
  email: string
  status: string
  created_at: string
}

export interface CAD {
  id: string
  empreendimento_id: string
  corretor_id?: string
  codigo: string
  numero_seq: number
  nome1?: string
  cpf1?: string
  rg1?: string
  nasc1?: string
  sexo1?: string
  prof1?: string
  end1?: string
  bairro1?: string
  cidade1?: string
  cep1?: string
  tel1?: string
  email1?: string
  ecivil1?: string
  regime1?: string
  nome2?: string
  cpf2?: string
  rg2?: string
  nasc2?: string
  sexo2?: string
  prof2?: string
  tel2?: string
  email2?: string
  ecivil2?: string
  regime2?: string
  quadra?: string
  lote?: string
  imobiliaria?: string
  corretor_nome?: string
  data_cad?: string
  hora_cad?: string
  imagem_url?: string
  drive_pasta_id?: string
  drive_pasta_nome?: string
  status: StatusCAD
  created_at: string
}

export interface Documento {
  id: string
  cad_id: string
  tipo: string
  nome_arquivo?: string
  drive_file_id?: string
  status: StatusDoc
  created_at: string
}

export const DOCS_OBRIGATORIOS = [
  { tipo: 'rg_cnh', label: 'RG ou CNH', descricao: 'Frente e verso' },
  { tipo: 'cpf', label: 'CPF', descricao: 'Cópia legível' },
  { tipo: 'comprovante_residencia', label: 'Comprovante de residência', descricao: 'Últimos 90 dias' },
  { tipo: 'comprovante_renda', label: 'Comprovante de renda', descricao: 'Holerite ou IR' },
  { tipo: 'estado_civil', label: 'Certidão de estado civil', descricao: 'Casamento, nascimento ou divórcio' },
]
