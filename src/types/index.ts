export type DevMenuCommand = {
  label: string;
  /** Shell command (run with shell: true) */
  command: string;
  /** Working directory relative to project root, or absolute */
  cwd?: string;
};

export type DevMenuCategory = {
  name: string;
  commands: DevMenuCommand[];
};

export type DevMenuConfig = {
  categories: DevMenuCategory[];
};
