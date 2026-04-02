import type { DevMenuCategory } from "../types";

/** Shipped with devmenu; merged with project devmenu.{yaml,json} when present. */
export function getBuiltInCategories(): DevMenuCategory[] {
  return [
    {
      name: "Git",
      commands: [
        { label: "status", command: "git status -sb" },
        { label: "diff", command: "git diff" },
        { label: "pull", command: "git pull" },
        { label: "push", command: "git push" },
        { label: "recent commits", command: "git log --oneline -15" },
        { label: "branches", command: "git branch -vv" },
      ],
    },
    {
      name: "General",
      commands: [
        { label: "pwd", command: "pwd" },
        { label: "list (short)", command: "ls" },
        { label: "list (long)", command: "ls -la" },
      ],
    },
  ];
}
