import { z } from 'zod';

// Add your validators here
export const exampleValidator = z.object({
  name: z.string(),
  age: z.number().min(0),
}); 