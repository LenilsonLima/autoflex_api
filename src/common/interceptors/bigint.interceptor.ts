import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function normalize(value: any): any {
  // BigInt -> string
  if (typeof value === 'bigint') return value.toString();

  // Prisma Decimal -> number (sem import)
  if (value && typeof value === 'object' && typeof value.toNumber === 'function') {
    try {
      return value.toNumber();
    } catch {
      return value.toString();
    }
  }

  if (Array.isArray(value)) return value.map(normalize);

  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = normalize(v);
    }
    return out;
  }

  return value;
}

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(normalize));
  }
}