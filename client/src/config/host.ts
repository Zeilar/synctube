const { NODE_ENV, REACT_APP_HOST_URL, REACT_APP_HOST_PORT } = process.env;

export const HOST =
    NODE_ENV === "production"
        ? REACT_APP_HOST_URL ?? ""
        : `http://localhost:${REACT_APP_HOST_PORT}`;
