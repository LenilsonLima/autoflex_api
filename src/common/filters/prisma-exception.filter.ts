import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();

        // Unique constraint (ex: code duplicado / productId+rawMaterialId duplicado)
        if (exception.code === 'P2002') {
            const meta: any = exception.meta ?? {};
            const field =
                meta?.driverAdapterError?.cause?.constraint?.fields ??
                null;

            return res.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                message: 'Duplicate value',
                field, // ex: ["code"] ou ["product_id","raw_material_id"]
            });
        }

        // Record not found (quando usa update/delete e não existe)
        if (exception.code === 'P2025') {
            return res.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Record not found',
            });
        }

        // Default
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database error',
            code: exception.code,
        });
    }
}
