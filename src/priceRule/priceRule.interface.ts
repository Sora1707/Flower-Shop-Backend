import { Document } from "mongoose";

export enum PriceRuleType {
    DailyDecrease = "daily_decrease",
    Promotion = "promotion",
}

export interface IPriceRule {
    name: string;
    type: PriceRuleType;
    active: boolean;
    startDate?: Date;
    endDate?: Date;
    discountAmount: number;
    occasion?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPriceRuleDocument extends IPriceRule, Document {}
