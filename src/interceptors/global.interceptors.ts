import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
@Injectable()
export class GlobalInterceptors implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        return {
          statusCode,
          success: statusCode < 400,
          message: this.getStatusMessage(statusCode),
          data: data || null,
        };
      }),
    );
  }

  private getStatusMessage(statusCode: number): string {
    const statusMessages = {
      200: 'OK',
      201: 'Created',
    };
    return statusMessages[statusCode] || 'Unknown Status';
  }
}
