import jwt from "jsonwebtoken";
import { autoInjectable, singleton } from "tsyringe";

import { Env } from "../../../core/constants/env";
import { SessionRepository } from "../../../infrastructure/database/repositories/SessionRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";

@singleton()
@autoInjectable()
export class CreateSessionUseCase {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(userId: string, payload: Record<string, string>) {
        const createdSession = await this.sessionRepository.create(
            jwt.sign(payload, Env.JwtSecretKey, {
                expiresIn: "2h",
            }),
        );

        await this.userRepository.updateSession(userId, createdSession);

        return createdSession.token;
    }
}
