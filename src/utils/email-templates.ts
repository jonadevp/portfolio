export const AUTO_REPLY_SUBJECT = 'Recibí tu mensaje';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);

// Recorta ANTES de escapar, para no cortar una entidad a la mitad.
const shortName = (name: string): string => name.trim().slice(0, 60);

export const notificationSubject = (name: string): string =>
  `Nuevo mensaje de ${shortName(name)} desde jonadevp.com`;

type NotificationData = { fullname: string; email: string; message: string };

export const notificationHtml = ({
  fullname,
  email,
  message,
}: NotificationData): string => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Nuevo mensaje desde tu portafolio</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Plus Jakarta Sans', Arial, Helvetica, sans-serif; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; width:100%; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">

          <!-- Banda superior -->
          <tr>
            <td style="background-color: #6366f1; height: 8px;"></td>
          </tr>

          <!-- Encabezado -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background-color: #ffffff;">
              <div style="display:inline-block; padding: 8px 12px; background-color: #e0e7ff; border-radius: 12px; margin-bottom: 12px; font-size: 22px; line-height: 1;">
                ✉️
              </div>
              <h2 style="margin:0; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">
                Nuevo mensaje desde tu portafolio
              </h2>
              <p style="margin: 6px 0 0 0; font-size: 14px; color: #64748b;">
                Has recibido un nuevo mensaje a través de tu formulario de contacto.
              </p>
            </td>
          </tr>

          <!-- Datos -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;">
                <tr>
                  <td style="padding: 20px;">

                    <!-- Nombre -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                      <tr>
                        <td width="32" valign="top" style="font-size: 18px; line-height: 1.3;">👤</td>
                        <td style="font-size: 14px; color: #334155;">
                          <strong style="color: #0f172a; font-weight: 600;">Nombre:</strong> ${escapeHtml(shortName(fullname))}
                        </td>
                      </tr>
                    </table>

                    <!-- Email -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                      <tr>
                        <td width="32" valign="top" style="font-size: 18px; line-height: 1.3;">✉️</td>
                        <td style="font-size: 14px; color: #334155;">
                          <strong style="color: #0f172a; font-weight: 600;">Email:</strong>
                          <a href="mailto:${escapeHtml(email)}" style="color: #6366f1; text-decoration: none; font-weight: 500;">${escapeHtml(email)}</a>
                        </td>
                      </tr>
                    </table>

                    <!-- Mensaje -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="32" valign="top" style="font-size: 18px; line-height: 1.3;">💬</td>
                        <td style="font-size: 14px; color: #334155;">
                          <strong style="color: #0f172a; font-weight: 600; display: block; margin-bottom: 8px;">Mensaje:</strong>
                          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                Este correo fue generado automáticamente desde el formulario de contacto de tu portafolio.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;