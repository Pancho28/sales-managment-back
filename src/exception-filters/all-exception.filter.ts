import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const status = exception.getStatus();
  
      // Log the error details for debugging
      this.logger.error(`Http status: ${status || HttpStatus.INTERNAL_SERVER_ERROR} Error: ${exception.message} Method: ${request.method} Path: ${request.url}`);
      // Handle HTTP exceptions (maintain original behavior)
      if (exception instanceof HttpException) {
        response.status(status).json({
          statusCode: status,
          path: request.url,
          message: exception.message,
        });
        return;
      } else {
        // Handle non-HTTP exceptions or uncaught errors (return 500)
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path: request.url,
          message: 'Internal Server Error', // Generic message for non-HTTP exceptions
        });
      }
    }
}