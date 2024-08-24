declare module "haveibeenpwned" {
  export function pwnedPassword(password: string): Promise<number>;
}
