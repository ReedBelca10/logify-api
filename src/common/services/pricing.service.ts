import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  private readonly tarifBase = {
    DOC: 500,
    SMALL: 800,
    MEDIUM: 1200,
    LARGE: 1800,
    XL: 2500,
  };

  private readonly prixParKm = {
    '0-5': 200,
    '6-15': 150,
    '15+': 120,
  };

  calculerDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100;
  }

  calculerTarif(categorieColis: string, distanceKm: number): number {
    const tarifDeBase = this.tarifBase[categorieColis] || 0;
    let prixParKmLigne = 0;

    if (distanceKm <= 5) {
      prixParKmLigne = this.prixParKm['0-5'];
    } else if (distanceKm <= 15) {
      prixParKmLigne = this.prixParKm['6-15'];
    } else {
      prixParKmLigne = this.prixParKm['15+'];
    }

    const tarifDistribution = Math.round(distanceKm * prixParKmLigne);
    return tarifDeBase + tarifDistribution;
  }
}
