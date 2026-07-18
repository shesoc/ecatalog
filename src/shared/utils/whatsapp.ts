/**
 * Genera un link de WhatsApp para contacto general con la empresa.
 * Abre el chat con un saludo base pre-armado.
 * @param number - Numero en formato internacional sin '+' (ej: 5491112345678)
 * @param companyName - Nombre de la empresa para personalizar el saludo
 */
export function buildWhatsAppLink(number: string, companyName?: string): string {
  const greeting = companyName
    ? `Hola ${companyName}! Me gustaría obtener más información sobre sus productos y servicios.`
    : 'Hola! Me gustaría obtener más información sobre sus productos y servicios.';
  return `https://wa.me/${number}?text=${encodeURIComponent(greeting)}`;
}

/**
 * Genera un link de WhatsApp con mensaje de pedido pre-armado.
 * Usa la plantilla configurada por la empresa, reemplazando `{product}`
 * con el nombre del producto seleccionado en el carrito.
 * @param number - Numero en formato internacional sin '+' (ej: 5491112345678)
 * @param productName - Nombre del producto de interes
 * @param template - Plantilla del mensaje con marcador `{product}` para inyeccion dinamica
 */
export function buildWhatsAppProductLink(number: string, productName: string, template?: string): string {
  const defaultTemplate = 'Hola! Me interesa el producto: {product}';
  const resolvedMessage = (template ?? defaultTemplate).replace(/\{product\}/gi, productName);
  const message = encodeURIComponent(resolvedMessage);
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Formatea un precio con separador de miles y simbolo de moneda.
 */
export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
