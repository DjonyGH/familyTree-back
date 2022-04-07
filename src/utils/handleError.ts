import { HttpException, HttpStatus } from '@nestjs/common';

export const handleError = (message: string, status: HttpStatus): boolean => {
  throw new HttpException({ statusCode: status, message: [message] }, status);
};
