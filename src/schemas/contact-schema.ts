import { z } from "astro/zod";
import { resolveMx } from 'node:dns/promises';

const TYPO_DOMAINS = ["gmial.com", "gmai.com", "yahooo.com", "hotmial.com"];

const TYPO_TLDS = ["coim", "con", "cmo", "comm", "ocm", "vom", "xom", "cpm"];

const FAKE_LOCAL_PARTS = [
  "example",
  "ejemplo",
  "test",
  "prueba",
  "correo",
  "email",
  "usuario",
  "nombre",
  "asdf",
  "qwerty",
];

const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "throwaway.email",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
];

const LINK_REGEX = /(https?:\/\/|www\.)/i;
const NAME_ALLOWED_REGEX = /^[\p{L}\p{M} ]+$/u;

const getLocal = (email: string): string => email.split("@")[0] ?? "";
const getDomain = (email: string): string => email.split("@")[1] ?? "";
const getTld = (domain: string): string => domain.split(".").pop() ?? "";

const isDomainIn = (domain: string, list: string[]): boolean =>
  list.some((d) => domain === d || domain.endsWith(`.${d}`));

const hasMailServer = async (domain: string): Promise<boolean> => {
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return !(code === 'ENOTFOUND' || code === 'ENODATA');
  }
};

export const emailSchema = z
  .string({ error: "El email es requerido" })
  .trim()
  .toLowerCase()
  .min(1, "El email es requerido")
  .max(255, "El email es demasiado largo")
  .pipe(z.email("El formato del email no es válido"))
  .refine((email) => !TYPO_DOMAINS.includes(getDomain(email)), {
    message: "Verifica que el dominio del email esté bien escrito",
  })
  .refine((email) => !TYPO_TLDS.includes(getTld(getDomain(email))), {
    message: "Verifica la terminación del correo (.com, .mx, .org…)",
  })
  .refine((email) => !isDomainIn(getDomain(email), DISPOSABLE_DOMAINS), {
    message: "Por favor, usa un email permanente",
  })
  .refine(
    (email) =>
      !FAKE_LOCAL_PARTS.includes(getLocal(email).replace(/[._-]/g, "")),
    { message: "Correos temporales no permitidos" },
  )
  .refine((email) => !/^\d+$/.test(getLocal(email)), {
    message: "El correo no puede ser solo números",
  })
  .refine(async (email) => hasMailServer(getDomain(email)), {
    message: 'Correo inválido. Revisa que el correo esté bien escrito',
  });

export const fullNameSchema = z
  .string({ error: "El nombre completo es requerido" })
  .trim()
  .min(7, "El nombre debe tener al menos 7 caracteres")
  .max(60, "El nombre es demasiado largo")
  .refine((name) => NAME_ALLOWED_REGEX.test(name), {
    message: "El nombre solo puede tener letras y espacios",
  });

export const messageSchema = z
  .string({ error: "El mensaje es requerido" })
  .trim()
  .min(10, "El mensaje debe tener al menos 10 caracteres")
  .max(300, "El mensaje es demasiado largo")
  .refine((message) => !LINK_REGEX.test(message), {
    message: "No se permiten enlaces en el mensaje",
  });