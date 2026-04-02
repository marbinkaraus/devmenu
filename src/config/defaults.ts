import type { DevMenuCategory } from "../types";

/**
 * Shipped with devmenu; merged with project `devmenu.{yaml,json}` when present.
 * Same category name in a project file **appends** to these commands.
 */
export function getBuiltInCategories(): DevMenuCategory[] {
  return [
    {
      name: "Git",
      commands: [
        {
          label: "status",
          description: "Short branch status and working tree.",
          command: "git status -sb",
          tags: ["git", "status"],
        },
        {
          label: "diff",
          description: "Unstaged changes.",
          command: "git diff",
          tags: ["git", "diff"],
        },
        {
          label: "diff (staged)",
          description: "Staged changes only.",
          command: "git diff --staged",
          tags: ["git", "diff", "staged"],
        },
        {
          label: "pull",
          description: "Fetch and merge the current branch.",
          command: "git pull",
          tags: ["git", "pull", "sync"],
        },
        {
          label: "push",
          description: "Push the current branch to its remote.",
          command: "git push",
          tags: ["git", "push", "sync"],
        },
        {
          label: "fetch",
          description: "Download objects from remote without merging.",
          command: "git fetch",
          tags: ["git", "fetch"],
        },
        {
          label: "recent commits",
          description: "Last 15 commits, one line each.",
          command: "git log --oneline -15",
          tags: ["git", "log", "history"],
        },
        {
          label: "branches",
          description: "Local branches and upstreams.",
          command: "git branch -vv",
          tags: ["git", "branch"],
        },
        {
          label: "remotes",
          description: "Configured remotes and URLs.",
          command: "git remote -v",
          tags: ["git", "remote"],
        },
        {
          label: "stash list",
          description: "Saved stashes.",
          command: "git stash list",
          tags: ["git", "stash"],
        },
      ],
    },
    {
      name: "General",
      commands: [
        {
          label: "pwd",
          description: "Print working directory.",
          command: "pwd",
          tags: ["shell", "path"],
        },
        {
          label: "list (short)",
          description: "List files in this directory.",
          command: "ls",
          tags: ["shell", "files"],
        },
        {
          label: "list (long)",
          description: "Detailed listing with hidden files.",
          command: "ls -la",
          tags: ["shell", "files"],
        },
        {
          label: "date",
          description: "Current date and time.",
          command: "date",
          tags: ["shell", "time"],
        },
      ],
    },
  ];
}
