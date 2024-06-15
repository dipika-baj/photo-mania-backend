import { Pagination } from "./pagination";

export const success = <T>({
  data,
  pagination,
}: {
  data: T;
  pagination?: Pagination;
}) => {
  return { status: "success", data: data, pagination: pagination };
};

export const failure = ({
  message,
  code,
}: {
  message: string;
  code?: string;
}) => {
  return { status: "error", message: message, code: code };
};
