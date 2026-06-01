export type StudentStatus =
  | "Graduated"
  | "Defense Completed"
  | "Seminar Completed"
  | "Thesis In Progress";

export interface MilestoneInput {
  proposal: boolean;
  seminar: boolean;
  defense: boolean;
  graduation: boolean;
}

export interface ComputedStudentStyle {
  status: StudentStatus;
  title: string;
  glowClass: string;
  badgeClass: string;
  theme: string;
}

export function computeStudentStatus(milestones: MilestoneInput): ComputedStudentStyle {
  if (milestones.proposal && milestones.seminar && milestones.defense && milestones.graduation) {
    return {
      status: "Graduated",
      title: "S.Kom.",
      glowClass: "glow-hover-gold",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      theme: "from-purple-500 via-pink-500 to-indigo-600",
    };
  }
  if (milestones.proposal && milestones.seminar && milestones.defense) {
    return {
      status: "Defense Completed",
      title: "S.Kom. (Cand.)",
      glowClass: "glow-hover-blue",
      badgeClass: "bg-neon-blue/10 text-neon-blue border-neon-blue/20",
      theme: "from-cyan-500 via-blue-500 to-indigo-600",
    };
  }
  if (milestones.proposal && milestones.seminar) {
    return {
      status: "Seminar Completed",
      title: "",
      glowClass: "glow-hover-purple",
      badgeClass: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
      theme: "from-fuchsia-500 to-pink-600",
    };
  }
  return {
    status: "Thesis In Progress",
    title: "",
    glowClass: "glow-hover-cyan",
    badgeClass: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
    theme: "from-emerald-500 via-teal-500 to-cyan-500",
  };
}
