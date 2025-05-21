import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch() // Captura todas as exceções
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let errors: string[] = [];

    // Se a exceção for uma HttpException (lançada pelo NestJS ou por validações)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      // Extrai a mensagem de erro da HttpException
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        message = (errorResponse as any).message || 'Internal server error';
        // Se houver validação de DTOs, os erros podem vir em um array 'message'
        if ((errorResponse as any).message && Array.isArray((errorResponse as any).message)) {
          errors = (errorResponse as any).message;
        }
      }
    } else {
      // Para exceções não-HTTP, logar o erro completo para depuração
      console.error('Unhandled exception:', exception);
      // Em produção, você pode querer logar isso em um serviço de monitoramento
    }

    // Envia uma resposta JSON padronizada
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      ...(errors.length > 0 && { errors }), // Adiciona 'errors' apenas se houver
    });
  }
}