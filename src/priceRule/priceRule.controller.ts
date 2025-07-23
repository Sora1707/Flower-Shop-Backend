import { Request, Response, NextFunction } from "express";
import priceRuleService from "./priceRule.service";
import { PriceRuleType } from "./priceRule.interface";
// import { Request } from "@/types/request";
import ResponseHandler from "@/utils/ResponseHandler";

class PriceRuleController {
    // [GET] /price-rule/all
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const rules = await priceRuleService.findAll();
            ResponseHandler.success(res, rules, "Fetched all price rules");
        } catch (error) {
            next(error);
        }
    }

    // [GET] /price-rule/:id
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const rule = await priceRuleService.findById(id);

            if (!rule) {
                return ResponseHandler.error(res, "Price rule not found.", 404);
            }

            ResponseHandler.success(res, rule, "Fetched price rule");
        } catch (error) {
            next(error);
        }
    }

    // [POST] /price-rule
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, discountAmount } = req.body;

            if (discountAmount == null || discountAmount <= 0) {
                return ResponseHandler.error(res, "Promotion rule must include a valid discountAmount.", 400);
            }

            const rule = await priceRuleService.create(req.body);
            ResponseHandler.success(res, rule, "Price rule created successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /price-rule/:id
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const rule = await priceRuleService.updateById(id, req.body);

            if (!rule) {
                return ResponseHandler.error(res, "Price rule not found.", 404);
            }

            ResponseHandler.success(res, rule, "Price rule updated");
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /price-rule/:id
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await priceRuleService.deleteById(id);

            if (!deleted) {
                return ResponseHandler.error(res, "Price rule not found.", 404);
            }

            ResponseHandler.success(res, null, "Price rule deleted");
        } catch (error) {
            next(error);
        }
    }
}

const priceRuleController = new PriceRuleController();
export default priceRuleController;
