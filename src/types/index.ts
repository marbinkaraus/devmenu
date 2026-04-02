export type DevMenuCommand = {
  label: string;
  /** Optional help text shown in command details. */
  description?: string;
  /** Shell command (run with shell: true) */
  command: string;
  /** Working directory relative to project root, or absolute */
  cwd?: string;
  /** Optional tags; included in command search (not shown in the list UI). */
  tags?: string[];
  /** Ask for confirmation before running. */
  confirm?: boolean;
  /** Optional custom confirmation message. */
  confirmText?: string;
  /** Reusable inputs collected before command execution. */
  inputs?: DevMenuInputSpec[];
};

export type DevMenuInputSpec = {
  /** Placeholder name for templating: {{name}} */
  name: string;
  /** Prompt shown while collecting this input. */
  label?: string;
  /** Optional hint text while empty. */
  placeholder?: string;
  /** Optional prefilled value. */
  default?: string;
  /** Whether this field must be non-empty. */
  required?: boolean;
  /** Render as multiline input when true. */
  multiline?: boolean;
};

export type DevMenuCategory = {
  name: string;
  commands: DevMenuCommand[];
};

export type DevMenuConfig = {
  categories: DevMenuCategory[];
};
