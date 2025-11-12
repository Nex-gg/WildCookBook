export interface GeoLocation {
  country: string;
  countryCode: string;
  ip: string;
  isSriLanka: boolean;
  pricing: {
    amount: number;
    currency: string;
    displayPrice: string;
  };
}

export async function detectUserLocation(): Promise<GeoLocation> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    const isSriLanka = data.country_code === 'LK';

    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'US',
      ip: data.ip || '',
      isSriLanka,
      pricing: isSriLanka
        ? {
            amount: 0.50,
            currency: 'LKR',
            displayPrice: 'LKR 165.00/month ($0.50 USD)',
          }
        : {
            amount: 14.47,
            currency: 'USD',
            displayPrice: '$14.47/month',
          },
    };
  } catch (error) {
    console.error('Geolocation detection failed:', error);
    return {
      country: 'Unknown',
      countryCode: 'US',
      ip: '',
      isSriLanka: false,
      pricing: {
        amount: 14.47,
        currency: 'USD',
        displayPrice: '$14.47/month',
      },
    };
  }
}
