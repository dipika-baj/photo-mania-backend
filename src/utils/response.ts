export const success = <T>(data: T) => {
  return { status: "success", data: data };
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
