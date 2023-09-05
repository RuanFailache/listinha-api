import { singleton } from "tsyringe";
import { z } from "zod";

import { Validator } from "../../core/protocols/Validator";

@singleton()
export class PostUserSignUpValidator extends Validator {
    schema(): z.ZodType {
        return z.object({
            email: z.string().email().trim().toLowerCase(),
            name: z.string().trim(),
            password: z.string(),
        });
    }
}
