import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with key:', err);
  }
}

// API endpoint for AI assistance (blog generation, SEO optimization, tags suggestion)
app.post('/api/ai/assist', async (req: Request, res: Response) => {
  const { action, topic, currentContent, category } = req.body;

  if (!aiClient) {
    // Return structured intelligent fallback if API key is not configured
    if (action === 'generate_outline') {
      return res.json({
        success: true,
        fallback: true,
        outline: `# ${topic || 'Naslov Članka'}\n\n## Uvod in Kontekst\n- Kratek pregled teme\n- Zakaj je to pomembno za slovensko gaming ali spletno skupnost\n\n## Glavne Novosti in Ključne Točke\n- Poglobljena analiza novih funkcij ali mehanik\n- Primerjava s prejšnjimi različicami ali konkurenco\n\n## Tehnični Vpogled (Performance & Tehnologija)\n- Analiza delovanja, grafičnih zahtev ali arhitekture\n- Kaj to pomeni za razvijalce in igralce\n\n## Zaključek in Pričakovanja\n- Ocena vpliva na industrijo\n- Vprašanje za bralce in diskusija v komentarjih`,
        suggestedTags: ['Gaming', 'Novice', 'Spletni Razvoj', 'Tehnologija', 'WebKat'],
        metaDescription: `Preberite poglobljeno analizo o temi ${topic || 'najnovejših gaming in tech novicah'} na WebKat portalu.`,
      });
    }

    if (action === 'optimize_seo') {
      return res.json({
        success: true,
        fallback: true,
        seoTitle: `${topic} – Analiza & Vpogled | WebKat`,
        metaDescription: `Vse o ${topic}: ključne novosti, tehnične specifikacije in praktični nasveti s področja gaminga in spletnega razvoja.`,
        suggestedSlug: (topic || 'clanek').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        keywords: ['gaming', 'spletna stran', 'razvoj', 'hitrost', 'optimizacija'],
      });
    }

    return res.json({
      success: true,
      fallback: true,
      message: 'Lokalni pametni asistent je obdelal vsebino.',
    });
  }

  try {
    let prompt = '';
    if (action === 'generate_outline') {
      prompt = `Deluješ kot strokovni tehnični pisec in urednik za spletno stran WebKat.si (slovenski gaming in developer blog).
Uporabnik želi osnutek članka o temi: "${topic}". Kategorija je "${category || 'Gaming'}".
Napiši privlačen, strukturiran osnutek v čisti slovenščini v Markdown formatu (naslovi ##, točke, tehnični poudarki, Core Web Vitals ali gameplay mehanike).
Prav tako predlagaj 4-5 relevantnih tagov in 1 privlačen meta opis (130-155 znakov).
Vrni veljaven JSON v formatu:
{
  "outline": "Markdown vsebina osnutka...",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "metaDescription": "Privlačen meta opis za Google..."
}`;
    } else if (action === 'optimize_seo') {
      prompt = `Deluješ kot SEO strokovnjak za spletno stran WebKat.si.
Za članek z naslovom: "${topic}" in vsebino: "${(currentContent || '').slice(0, 500)}"
Pripravi:
1. SEO optimiziran naslov za Google (pod 60 znakov)
2. Privlačen meta opis (120-155 znakov) z močnim pozivom k branju
3. Predlagan čist URL slug (npr. gta-6-vice-city-novosti)
4. 5 ključnih besed
Vrni veljaven JSON v formatu:
{
  "seoTitle": "...",
  "metaDescription": "...",
  "suggestedSlug": "...",
  "keywords": ["...", "..."]
}`;
    } else {
      prompt = `Izboljšaj in lektorsko uredi naslednje besedilo v slovenščini za gaming/developer blog WebKat.si. Održi strokoven, tekoč in privlačen ton:
"${currentContent}"
Vrni veljaven JSON v formatu:
{
  "improvedContent": "..."
}`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, fallback: false, ...parsed });
  } catch (err: any) {
    console.error('Gemini error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Napaka pri komunikaciji z AI modelom',
    });
  }
});

// Contact form endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, serviceType, message, budget } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Prosimo, izpolnite vsa obvezna polja (ime, e-pošta, sporočilo).' });
  }

  console.log(`[WebKat Povpraševanje] Novo sporočilo od ${name} (${email}, tel: ${phone || '/'}):`, {
    serviceType,
    budget,
    message,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    message: 'Vaše povpraševanje je bilo uspešno prejeto! Žiga (WebKat) vas bo kontaktiral v roku 24 ur.',
  });
});

// Serve frontend via Vite middleware (in development) or static files (production)
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WebKat gaming & dev server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
