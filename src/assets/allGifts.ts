import { e, s, i } from "@/log";
import type { Gift } from "@/types";

const allGifts: Gift[] = [
  {
    id: 0,
    name: "ギフト1",
    description: "満腹度を10回復する",
    requireContribution: 10,
    skill: () => console.log(i, "ギフト1"),
  },
  {
    id: 1,
    name: "ギフト2",
    description: "満腹度を20回復する",
    requireContribution: 20,
    skill: () => console.log(i, "ギフト2"),
  },
  {
    id: 2,
    name: "ギフト3",
    description: "満腹度を30回復する",
    requireContribution: 30,
    skill: () => console.log(i, "ギフト3"),
  },
  {
    id: 3,
    name: "ギフト4",
    description: "満腹度を40回復する",
    requireContribution: 40,
    skill: () => console.log(i, "ギフト4"),
  },
  {
    id: 4,
    name: "ギフト5",
    description: "満腹度を50回復する",
    requireContribution: 50,
    skill: () => console.log(i, "ギフト5"),
  },
];
export default allGifts;
