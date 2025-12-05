import { AxiosError } from 'axios';
export type ErrorResponse = {
  data: any;
  code: number | null;
};

export const toErrorResponse = (error: unknown): ErrorResponse => {
  if (error instanceof AxiosError && error.response) {
    return { data: error.response.data, code: error.response.status };
  } else if (error instanceof AxiosError && error.request) {
    return { data: 'No response from server', code: 500 };
  } else {
    return {
      data: error instanceof Error ? error.message : 'Unknown error',
      code: 500,
    };
  }
};
