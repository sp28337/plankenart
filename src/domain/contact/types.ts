export type FormType = 'test' | 'calc';

export interface ContactFormData {
  name: string;
  phone: string;
  consent: boolean;
  formType: FormType;
  articles?: string;
  wood_sort?: string;
  area?: string;
  article?: string;
}

export type ValidationErrors = Partial<Record<keyof ContactFormData, string>>;
