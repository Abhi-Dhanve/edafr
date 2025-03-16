const envKeys = [
    "CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
] as const;

type ENV = Record<typeof envKeys[number], string>;

let env: ENV = {} as any;

export function ensureEnv() {
    for (const key of envKeys) {
        if (!Bun.env[key]) {
            throw new Error(`Environment variable ${key} is not set`);
        }
    }

    env = Object.fromEntries(
        envKeys.map((key) => [key, Bun.env[key]]),
    ) as ENV;
}
ensureEnv();

export default env;
