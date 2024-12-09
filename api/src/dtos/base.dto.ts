import { plainToInstance, instanceToPlain } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export abstract class BaseDto {
  static toInstance<T extends BaseDto>(this: new () => T, plain: object): T {
    return plainToInstance(this, plain);
  }

  getValues(): object {
    return instanceToPlain(this);
  }

  async validate(): Promise<{ failed: boolean; errors: { [key: string]: string } }> {
    const errors: ValidationError[] = await validate(this);
    const errorMessages: { [key: string]: string } = {};
    errors.forEach((error) => {
      if (error.constraints) {
        Object.entries(error.constraints).forEach(([, message]) => {
          errorMessages[error.property] = message;
        });
      }
    });

    const failed = Object.keys(errorMessages).length > 0;

    return {
      failed,
      errors: errorMessages,
    };
  }
}
