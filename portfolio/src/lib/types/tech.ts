import type { TechType } from "./tech_type"

export type Tech = {
    id: number,
    technology: string,
    tech_type: TechType| TechType[]
}