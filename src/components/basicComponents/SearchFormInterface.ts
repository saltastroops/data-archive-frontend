export interface IValue {
  value: string | undefined;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
export interface IName {
  name: string;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

export interface ICode {
  code: string | undefined;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

export interface ITitle {
  title: string | undefined;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
