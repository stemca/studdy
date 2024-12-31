import { hash, verify } from "@node-rs/argon2";

export const hashPassword = async (plaintext: string): Promise<string> => {
	return await hash(plaintext, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
};

export const verifyPassword = async (
	hash: string,
	password: string,
): Promise<boolean> => {
	return await verify(hash, password);
};
