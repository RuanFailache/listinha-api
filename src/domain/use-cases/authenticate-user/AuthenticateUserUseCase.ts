import { autoInjectable, singleton } from "tsyringe";

import { IPostUserSignIn } from "../../../application/dtos/IPostUserSignIn";
import { HashAdapter } from "../../../core/adapters/hash/HashAdapter";
import { ConflictError } from "../../../core/errors/http/ConflictError";
import { UnauthorizedError } from "../../../core/errors/http/UnauthorizedError";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { CreateSessionUseCase } from "../create-session/CreateSessionUseCase";

@singleton()
@autoInjectable()
export class AuthenticateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly createSessionUseCase: CreateSessionUseCase,
    ) {}

    async execute({ email, password }: IPostUserSignIn) {
        const foundUser = await this.userRepository.findByEmail(email);

        if (!foundUser) {
            throw new ConflictError({
                message: "User credentials are invalid!",
            });
        }

        const isCorrectPassword = HashAdapter.compare(password, foundUser.password);

        if (!isCorrectPassword) {
            throw new UnauthorizedError({
                message: "User credentials are invalid!",
            });
        }

        return {
            userId: foundUser.id,
            token: await this.createSessionUseCase.execute(foundUser.id, {
                email,
                password,
            }),
        };
    }
}