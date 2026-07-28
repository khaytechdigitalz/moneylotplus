// app/validators/user.ts
import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),

    password: vine
      .string()
      .minLength(12)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/),

    confirmPassword: vine.string().sameAs('password'), // This handles the check automatically!
   
    accountType: vine.enum(['individual', 'business'] as const),

    // --- Individual Fields (Required ONLY when accountType is 'individual') ---
    firstName: vine
      .string()
      .trim()
      .optional()
      .requiredWhen('accountType', '=', 'individual'),

    lastName: vine
      .string()
      .trim()
      .optional()
      .requiredWhen('accountType', '=', 'individual'),

    countryOfResidence: vine
      .string()
      .trim()
      .optional()
      .requiredWhen('accountType', '=', 'individual'),

    // --- Business Fields (Required ONLY when accountType is 'business') ---
    representativeFullName: vine
      .string()
      .trim()
      .optional()
      .requiredWhen('accountType', '=', 'business'),

    businessName: vine
      .string()
      .trim()
      .optional()
      .requiredWhen('accountType', '=', 'business'),

    countryOfOperations: vine
      .string()
      .trim()
      .optional()
      .requiredWhen('accountType', '=', 'business'),

    fcaNumber: vine.string().trim().optional(),
    companyNumber: vine.string().trim().optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)