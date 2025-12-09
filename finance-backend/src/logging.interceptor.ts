import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;
    const now = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`);
    if (body && Object.keys(body).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    return next
      .handle()
      .pipe(
        tap({
          next: (val) => {
            this.logger.log(
              `Response for ${method} ${url} - ${Date.now() - now}ms`,
            );
          },
          error: (err) => {
            this.logger.error(
              `Error for ${method} ${url} - ${Date.now() - now}ms`,
              err.stack,
            );
          },
        }),
      );
  }
}
