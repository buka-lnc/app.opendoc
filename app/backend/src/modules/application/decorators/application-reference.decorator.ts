import { applyDecorators } from '@nestjs/common'
import { ApiProperty, refs } from '@nestjs/swagger'
import { ApplicationIdReferenceDTO } from '../dto/application-id-reference.dto'
import { ApplicationCodeReferenceDTO } from '../dto/application-code-reference.dto'

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, isNumberString, matches, Validate } from 'class-validator'

@ValidatorConstraint({ name: 'customText', async: false })
export class IsApplicationReference implements ValidatorConstraintInterface {
  validate(value: any): boolean | Promise<boolean> {
    if (typeof value !== 'object') {
      return false
    }

    if (value.id && isNumberString(value.id)) {
      return true
    }

    if (value.code && matches(value.code, /^[a-z0-9-]+$/)) {
      return true
    }

    return false
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is invalid application reference!`
  }
}

export function ApplicationReference(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      oneOf: refs(ApplicationIdReferenceDTO, ApplicationCodeReferenceDTO),
    }),
    Validate(IsApplicationReference),
  )
}
