import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod'

const nameSchema = z.object({
  name: z.string().min(3, 'Minimum number of characters is 3').max(20, 'Maximum number of characters is 20').trim(),
})

export const FormSchema = toTypedSchema(nameSchema)
export type NameFormValues = z.infer<typeof nameSchema>

