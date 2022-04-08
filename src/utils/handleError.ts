import { HttpException, HttpStatus } from '@nestjs/common';

export const handleError = (
  message: string,
  status: HttpStatus,
): HttpException => {
  console.log('error', message);

  throw new HttpException({ statusCode: status, message: [message] }, status);
};
