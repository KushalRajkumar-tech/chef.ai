import { scanPantryWithAI } from '../services/geminiService.js';
import { MOCK_PANTRY_ITEMS } from '../services/mockDataService.js';

/**
 * Handle pantry visual scanning & inventory retrieval
 * POST /api/pantry/scan
 */
export async function scanPantry(req, res, next) {
  try {
    const { imageBase64, mimeType } = req.body || {};

    // If no image is provided, return standard detected inventory
    if (!imageBase64) {
      return res.status(200).json({
        success: true,
        message: 'Retrieved standard pantry inventory',
        data: {
          source: 'pantry_inventory',
          items: MOCK_PANTRY_ITEMS,
          totalCount: MOCK_PANTRY_ITEMS.length,
          expiringSoonCount: MOCK_PANTRY_ITEMS.filter(i => i.freshness === 'expiring_soon' || i.freshness === 'expired').length
        }
      });
    }

    const result = await scanPantryWithAI(imageBase64, mimeType);
    return res.status(200).json({
      success: true,
      message: 'Pantry scan completed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
}
