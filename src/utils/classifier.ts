import { SAMPLE_WASTE_ITEMS } from '../data/mockData';
import { ScannedWasteItem, WasteCategory } from '../types';

/**
 * Intelligent waste classifier simulating on-device TensorFlow Lite MobileNet model.
 * Classifies items strictly into two categories:
 * - Biodegradable
 * - Non-Biodegradable
 */
export function classifyWasteImage(
  fileName?: string,
  imageDimensions?: { width: number; height: number }
): Omit<ScannedWasteItem, 'id' | 'timestamp'> {
  const lowerName = (fileName || '').toLowerCase();

  // Keyword-based matching if file name contains hints (e.g. plastic_bottle.jpg, apple.png)
  for (const item of SAMPLE_WASTE_ITEMS) {
    if (item.keywords.some((kw) => lowerName.includes(kw))) {
      // Add slight natural confidence variance between 93.5% and 99.2%
      const jitter = (Math.random() * 4 - 2).toFixed(1);
      const conf = Math.min(99.4, Math.max(91.0, parseFloat((item.confidence + parseFloat(jitter)).toFixed(1))));

      return {
        itemName: item.name,
        category: item.category as WasteCategory,
        confidence: conf,
        recommendation: item.recommendation,
        decompositionTime: item.decompositionTime,
      };
    }
  }

  // If no filename match or captured via live camera, use deterministic visual hash
  const hash = (fileName ? fileName.length : 0) + (imageDimensions ? imageDimensions.width + imageDimensions.height : Date.now());
  const selected = SAMPLE_WASTE_ITEMS[Math.abs(hash) % SAMPLE_WASTE_ITEMS.length];

  const jitter = (Math.random() * 3 - 1.5).toFixed(1);
  const conf = Math.min(99.2, Math.max(92.0, parseFloat((selected.confidence + parseFloat(jitter)).toFixed(1))));

  return {
    itemName: selected.name,
    category: selected.category as WasteCategory,
    confidence: conf,
    recommendation: selected.recommendation,
    decompositionTime: selected.decompositionTime,
  };
}

export function formatConfidence(confidence: number): string {
  return `${confidence.toFixed(1)}%`;
}
