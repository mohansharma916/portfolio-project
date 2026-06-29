import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiResponse } from "../response/api-response.interface";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor<T>
implements NestInterceptor<T, ApiResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                message: 'Success',
                data,

            })),

        );
    }
}