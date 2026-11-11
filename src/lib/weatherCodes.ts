import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Sun,
} from 'lucide-react';

export function getWeatherIcon(code: number | null): LucideIcon | null {
  switch (code) {
    case 0:
    case 1:
      return Sun;
    case 2:
      return CloudSun;
    case 3:
      return Cloud;
    case 45:
    case 48:
      return CloudFog;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return CloudRain;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return CloudSnow;
    case 95:
    case 96:
    case 99:
      return CloudLightning;
    default:
      return null;
  }
}
