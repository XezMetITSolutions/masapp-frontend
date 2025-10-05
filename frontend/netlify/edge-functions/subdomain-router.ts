import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  // Geçici olarak edge function'u devre dışı bırakıyoruz
  // Debug için tüm istekleri normal işleme bırak
  console.log('Edge function called for:', request.url);
  return context.next();
};

export const config = {
  path: "/*"
};