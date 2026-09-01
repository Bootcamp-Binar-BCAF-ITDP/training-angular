import { HttpClient, HttpContext, HttpContextToken, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.models';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;
const REQUIRES_AUTH = new HttpContextToken<boolean>(() => false);

const buildParams = (params?: QueryParams): HttpParams => {
  let httpParams = new HttpParams();

  if (!params) {
    return httpParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      httpParams = httpParams.set(key, String(value));
    }
  });

  return httpParams;
};

export const getProtected = <T>(
  http: HttpClient,
  url: string,
  params?: QueryParams | HttpParams,
): Observable<ApiResponse<T>> => {
  const context = new HttpContext().set(REQUIRES_AUTH, true);

  return http.get<ApiResponse<T>>(url, {
    context,
    params: params instanceof HttpParams ? params : buildParams(params),
  });
};

export const postProtected = <T>(
  http: HttpClient,
  url: string,
  body: T,
): Observable<ApiResponse<T>> => {
  const context = new HttpContext().set(REQUIRES_AUTH, true);

  return http.post<ApiResponse<T>>(url, body, { context, responseType: 'json' as 'json' });
};

export const putProtected = <T>(
  http: HttpClient,
  url: string,
  body: T,
): Observable<ApiResponse<T>> => {
  const context = new HttpContext().set(REQUIRES_AUTH, true);

  return http.put<ApiResponse<T>>(url, body, { context, responseType: 'json' as 'json' });
};

export const deleteProtected = <T>(http: HttpClient, url: string): Observable<ApiResponse<T>> => {
  const context = new HttpContext().set(REQUIRES_AUTH, true);

  return http.delete<ApiResponse<T>>(url, { context, responseType: 'json' as 'json' });
};
