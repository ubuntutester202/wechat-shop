import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppLoggerService } from '../logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, user } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const userId = user?.id || 'anonymous';
        this.logger.logApiRequest(method, url, userId, duration);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const userId = user?.id || 'anonymous';
        this.logger.logApiRequest(method, url, userId, duration);
        this.logger.error(`API Error: ${method} ${url}`, error.stack);
        return throwError(() => error);
      }),
    );
  }
}