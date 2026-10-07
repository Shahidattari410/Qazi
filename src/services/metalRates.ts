import { MetalRateData, MetalType, MetalUnit } from '../types';

export const DEFAULT_RATES: MetalRateData = {
  gold24KPerTola: 283500, // PKR per tola market standard
  gold22KPerTola: 259875,
  gold21KPerTola: 248060,
  gold18KPerTola: 212625,
  silverPurePerTola: 3350, // PKR per tola
  silverMarketPerTola: 3220,
  source: 'پاکستان صرافہ مارکیٹ (تخمینہ)',
  isLive: false,
  lastUpdated: new Date().toISOString(),
  currency: 'PKR',
};

// 1 Tola = 12 Masha
// 1 Masha = 8 Ratti (hence 1 Tola = 96 Ratti)
// 1 Tola = 11.6638 Grams
export const TOLA_TO_MASHA = 12;
export const MASHA_TO_RATTI = 8;
export const TOLA_TO_RATTI = 96;
export const TOLA_TO_GRAMS = 11.6638;

/**
 * Calculates total tola equivalent from Tola, Masha, Ratti and Grams
 */
export function calculateTotalTola(
  tola: number = 0,
  masha: number = 0,
  ratti: number = 0,
  grams: number = 0
): number {
  const fromTola = Number(tola) || 0;
  const fromMasha = (Number(masha) || 0) / TOLA_TO_MASHA;
  const fromRatti = (Number(ratti) || 0) / TOLA_TO_RATTI;
  const fromGrams = (Number(grams) || 0) / TOLA_TO_GRAMS;

  return Number((fromTola + fromMasha + fromRatti + fromGrams).toFixed(4));
}

/**
 * Gets the rate per tola for a given metal type
 */
export function getRatePerTola(metalType: MetalType, rates: MetalRateData): number {
  switch (metalType) {
    case '24K سونا':
      return rates.gold24KPerTola;
    case '22K سونا':
      return rates.gold22KPerTola;
    case '21K سونا':
      return rates.gold21KPerTola;
    case '18K سونا':
      return rates.gold18KPerTola;
    case 'خالص چاندی':
      return rates.silverPurePerTola;
    case 'مارکیٹ چاندی':
      return rates.silverMarketPerTola;
    default:
      return rates.silverPurePerTola;
  }
}

/**
 * Calculates the market value in PKR for given metal weight
 */
export function calculateMetalHaqMehrValue(
  metalType: MetalType,
  totalTola: number,
  rates: MetalRateData,
  manualRate?: number
): { rateUsed: number; totalValue: number } {
  const rateUsed = manualRate && manualRate > 0 ? manualRate : getRatePerTola(metalType, rates);
  const totalValue = Math.round(rateUsed * totalTola);
  return { rateUsed, totalValue };
}

/**
 * Attempt to fetch real live rates; fallback to default if offline / blocked
 */
export async function fetchLiveMetalRates(): Promise<{ rates: MetalRateData; error?: string }> {
  try {
    // Attempt free open API for gold/silver in USD or PKR
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=pkr', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data['tether-gold'] && data['tether-gold'].pkr) {
        // 1 troy ounce = 31.1035 grams. 1 Tola = 11.664 grams. (1 tola = 0.375 troy oz)
        const goldOuncePkr = data['tether-gold'].pkr;
        const goldTola24K = Math.round(goldOuncePkr * (11.6638 / 31.1035));
        const silverTola = Math.round(goldTola24K * 0.0118); // Approximate gold-to-silver ratio

        return {
          rates: {
            gold24KPerTola: goldTola24K,
            gold22KPerTola: Math.round(goldTola24K * (22 / 24)),
            gold21KPerTola: Math.round(goldTola24K * (21 / 24)),
            gold18KPerTola: Math.round(goldTola24K * (18 / 24)),
            silverPurePerTola: silverTola,
            silverMarketPerTola: Math.round(silverTola * 0.95),
            source: 'CoinGecko Live API (PKR Converted)',
            isLive: true,
            lastUpdated: new Date().toISOString(),
            currency: 'PKR',
          },
        };
      }
    }
  } catch (err) {
    // Network error or timeout - fallback to manual / cached
  }

  // Fallback to market rates with honest indicator
  return {
    rates: {
      ...DEFAULT_RATES,
      isLive: false,
      lastUpdated: new Date().toISOString(),
    },
    error: 'Live rate unavailable — Enter Manual Rate',
  };
}
