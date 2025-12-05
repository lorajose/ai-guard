import { NextRequest, NextResponse } from "next/server";

type UrlResult = {
  url: string;
  malicious_count: number;
  total_scans: number;
  is_safe: boolean;
};

type CacheEntry = {
  expiresAt: number;
  data: UrlResult;
};

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
const cache = new Map<string, CacheEntry>();

const RATE_LIMIT_MAX = 4;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
let rateLimitState = { count: 0, resetAt: 0 };

class VirusTotalRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VirusTotalRateLimitError";
  }
}

const URL_REGEX =
  /(https?:\/\/[^\s/$.?#].[^\s"]*)/gi; /* naive extractor for suspicious text */

export async function POST(req: NextRequest) {
  if (!process.env.VIRUSTOTAL_API_KEY) {
    return NextResponse.json(
      { error: "VIRUSTOTAL_API_KEY no configurada." },
      { status: 500 }
    );
  }

  try {
    const payload = await req.json();
    if (!payload || !Array.isArray(payload.urls)) {
      return NextResponse.json(
        { error: "Debes enviar { urls: string[] }." },
        { status: 400 }
      );
    }

    const extracted = new Set<string>();
    payload.urls.forEach((entry: string) => {
      if (typeof entry !== "string") return;
      const matches = entry.match(URL_REGEX);
      if (!matches) return;
      matches.forEach((url) => extracted.add(url));
    });

    if (extracted.size === 0) {
      return NextResponse.json(
        { error: "No se detectaron URLs válidas en la petición." },
        { status: 400 }
      );
    }

    const results: UrlResult[] = [];
    for (const url of extracted) {
      const result = await scanUrl(url);
      results.push(result);
    }

    return NextResponse.json({ results, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("Error en /api/check-url:", error);
    if (error instanceof VirusTotalRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json(
      { error: "Error procesando la verificación de URLs." },
      { status: 500 }
    );
  }
}

async function scanUrl(url: string): Promise<UrlResult> {
  const cached = cache.get(url);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const apiKey = process.env.VIRUSTOTAL_API_KEY!;
  const headers = {
    "x-apikey": apiKey,
    "content-type": "application/x-www-form-urlencoded",
  };

  await ensureVirusTotalQuota();
  const payload = new URLSearchParams({ url: encodeURI(url) });
  const response = await fetch("https://www.virustotal.com/api/v3/urls", {
    method: "POST",
    headers,
    body: payload.toString(),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new VirusTotalRateLimitError(
        "Límite de VirusTotal alcanzado. Intenta más tarde."
      );
    }
    throw new Error(`VirusTotal POST error: ${response.statusText}`);
  }

  await response.json();

  await ensureVirusTotalQuota();
  const vtUrlId = encodeUrlForVirusTotal(url);
  const statsRes = await fetch(
    `https://www.virustotal.com/api/v3/urls/${vtUrlId}`,
    {
      headers: {
        "x-apikey": apiKey,
      },
    }
  );

  if (!statsRes.ok) {
    if (statsRes.status === 429) {
      throw new VirusTotalRateLimitError(
        "Límite de VirusTotal alcanzado. Intenta más tarde."
      );
    }
    throw new Error(`VirusTotal GET error: ${statsRes.statusText}`);
  }

  const statsJson = await statsRes.json();
  const analysisStats =
    statsJson?.data?.attributes?.last_analysis_stats ?? undefined;

  const malicious = Number(analysisStats?.malicious ?? 0);
  const suspicious = Number(analysisStats?.suspicious ?? 0);
  const harmless = Number(analysisStats?.harmless ?? 0);
  const undetected = Number(analysisStats?.undetected ?? 0);
  const total = malicious + suspicious + harmless + undetected;

  const result: UrlResult = {
    url,
    malicious_count: malicious + suspicious,
    total_scans: total,
    is_safe: malicious + suspicious === 0,
  };

  cache.set(url, { data: result, expiresAt: now + CACHE_TTL });
  return result;
}

function encodeUrlForVirusTotal(url: string) {
  return Buffer.from(url)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function ensureVirusTotalQuota() {
  const now = Date.now();
  if (now > rateLimitState.resetAt) {
    rateLimitState = { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  }

  if (rateLimitState.count >= RATE_LIMIT_MAX) {
    const waitFor = Math.max(rateLimitState.resetAt - now, 0);
    throw new VirusTotalRateLimitError(
      `Se alcanzó el límite de VirusTotal. Espera ${Math.ceil(
        waitFor / 1000
      )}s e inténtalo de nuevo.`
    );
  }

  rateLimitState.count += 1;
}
