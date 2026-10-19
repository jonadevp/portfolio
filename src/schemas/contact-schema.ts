// src/schemas/contact.ts
import { z } from 'astro/zod';

const TYPO_DOMAINS = ['gmial.com', 'gmai.com', 'yahooo.com', 'hotmial.com'];

const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
];

const LINK_REGEX = /(https?:\/\/|www\.)/i;
const NAME_ALLOWED_REGEX = /^[\p{L}\p{M}'’ .-]+$/u;
const NAME_HAS_LETTER_REGEX = /\p{L}/u;
const NAME_DOMAIN_LIKE_REGEX = /\p{L}\.\p{L}/u;

const getDomain = (email: string): string => email.split('@')[1] ?? '';

const isDomainIn = (domain: string, list: string[]): boolean =>
  list.some((d) => domain === d || domain.endsWith(`.${d}`));

export const emailSchema = z
  .string({ error: 'El email es requerido' })
  .trim()
  .toLowerCase()
  .min(1, 'El email es requerido')
  .max(255, 'El email es demasiado largo')
  .pipe(z.email('El formato del email no es válido'))
  .refine((email) => !TYPO_DOMAINS.includes(getDomain(email)), {
    message: 'Verifica que el dominio del email esté bien escrito',
  })
  .refine((email) => !isDomainIn(getDomain(email), DISPOSABLE_DOMAINS), {
    message: 'Por favor, usa un email permanente',
  });

  export const fullNameSchema = z
  .string({ error: 'El nombre completo es requerido' })
  .trim()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(60, 'El nombre es demasiado largo')
  .refine((name) => NAME_ALLOWED_REGEX.test(name), {
    message:
      'El nombre solo puede tener letras, espacios, guiones, puntos y apóstrofes',
  })
  .refine((name) => NAME_HAS_LETTER_REGEX.test(name), {
    message: 'El nombre debe incluir letras',
  })
  .refine((name) => !NAME_DOMAIN_LIKE_REGEX.test(name), {
    message: 'El nombre no puede parecer una dirección web',
  });

export const messageSchema = z
  .string({ error: 'El mensaje es requerido' })
  .trim()
  .min(1, 'El mensaje es requerido')
  .max(300, 'El mensaje es demasiado largo')
  .refine((message) => !LINK_REGEX.test(message), {
    message: 'No se permiten enlaces en el mensaje',
  });