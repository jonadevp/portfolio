import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import {
  emailSchema,
  fullNameSchema,
  messageSchema,
} from '@schemas/contact-schema';
import { contactRatelimit } from "@services/rate-limit";
const resend = new Resend(RESEND_API_KEY);

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type SiteverifyResponse = {
  success: boolean;
  'error-codes'?: string[];
};

const verifyTurnstile = async (token: string): Promise<boolean> => {
  try {
    const body = new FormData();
    body.append('secret', TURNSTILE_SECRET_KEY);
    body.append('response', token);

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });

    const result = (await res.json()) as SiteverifyResponse;
    if (!result.success) {
      console.error('Turnstile rechazó el token:', result['error-codes']);
    }
    return result.success === true;
  } catch (error) {
    console.error('No se pudo contactar a Turnstile:', error);
    return false;
  }
};

export const server = {
  sendEmail: defineAction({
    accept: 'form',
    input: z.object({
      fullname: fullNameSchema,
      email: emailSchema,
      message: messageSchema,
      'cf-turnstile-response': z
        .string({ error: 'Completa la verificación' })
        .min(1, 'Completa la verificación'),
    }),
    handler: async (input, context) => {
      const { success } = await contactRatelimit.limit(context.clientAddress);
      if (!success) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
          message: "Demasiados intentos. Inténtalo de nuevo en unos minutos.",
        });
      }

      const { fullname, email, message } = input;

      const human = await verifyTurnstile(input['cf-turnstile-response']);
      if (!human) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'No se pudo verificar que eres una persona.',
        });
      }

      if (import.meta.env.DEV) {
        console.log('[DEV] Correo no enviado:', { fullname, email, message });
        return { ok: true };
      }

      const { error } = await resend.emails.send({
        from: 'jonadevp.com <contacto@jonadevp.com>',
        to: ['jonadevp@gmail.com'],
        replyTo: email,
        subject: `Nuevo mensaje de ${fullname}`,
        text: `Nombre: ${fullname}\nCorreo: ${email}\n\n${message}`,
      });

      if (error) {
        console.error('Error de Resend:', error);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo enviar el mensaje. Inténtalo más tarde.',
        });
      }

      return { ok: true };
    },
  }),
};