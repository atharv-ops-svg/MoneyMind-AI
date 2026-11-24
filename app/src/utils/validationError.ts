
import type {
  ValidationResult,
} from './financeValidation'

export function assertValid(
  validation: ValidationResult,
): void {
  if (!validation.valid) {
    throw new Error(validation.errors.join('\n'))
  }
}
