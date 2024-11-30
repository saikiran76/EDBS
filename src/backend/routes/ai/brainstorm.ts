import { Router } from "express";
import type { Request, Response } from "express";
import { rateLimit } from "../../middleware/rateLimit";
import { generateBrainstormQuestions } from "../../services/ai/brainstorm";
import type { BrainstormRequest } from "../../types/ai";

console.log('Initializing brainstorm router...');

const router = Router();

router.post(
  "/generate",
  rateLimit,
  async (req: Request<never, never, BrainstormRequest>, res: Response): Promise<void> => {
    console.log('Received POST request to /generate');
    try {
      const { texts, image, theme } = req.body;
      console.log('Request body:', { texts, image: image ? '[Image data]' : 'No image', theme });

      if (!texts && !image) {
        console.log('Validation failed: No texts or image provided');
        res.status(400).json({
          message: "Either text or image content is required",
        });
        return;
      }

      const questions = await generateBrainstormQuestions({
        texts,
        image,
        theme,
      });
      console.log('Generated questions:', questions);

      res.json({
        questions,
        rateLimit: res.get("X-Ratelimit-Limit"),
        rateLimitRemaining: res.get("X-Ratelimit-Remaining"),
      });
    } catch (error: any) {
      console.error("Brainstorm generation error:", error);
      res.status(500).json({
        message: error.message || "Failed to generate brainstorming questions",
      });
    }
  }
);

console.log('Brainstorm router initialized');

export default router;
