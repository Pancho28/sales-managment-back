import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from "moment-timezone";

@Injectable()
export class TimmingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimmingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    // Ejecuta el controlador y mide el tiempo cuando la respuesta es enviada (tap)
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        const date = new Date(moment().format())
        this.logger.log(`[${method}] ${url} - Response time: ${responseTime}ms at ${date}`);
      }),
    );
  }
}