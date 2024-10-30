import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly defaultMessages = {
        [HttpStatus.BAD_REQUEST]: 'There was an error with your request',
        [HttpStatus.NOT_FOUND]: 'Resource not found',
        [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
        [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
        [HttpStatus.CONFLICT]: 'User already registered',
    };

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = this.getStatus(exception);
        const message = this.getMessage(exception, status);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }

    private getStatus(exception: any): number {
        if (exception.name === 'UnauthorizedException') return HttpStatus.UNAUTHORIZED;
        if (exception instanceof HttpException) return exception.getStatus();
        if (exception.name === 'EntityNotFoundError') return HttpStatus.NOT_FOUND;
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private getMessage(exception: any, status: number): string {
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            return typeof response === 'string' ? response : (response as any).message || this.defaultMessages[status];
        }
        return this.defaultMessages[status] || 'An error occurred';
    }
}
