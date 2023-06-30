"use client";

import { FC } from "react";
import {
  ToastContainer as ReactToastifyToastContainer,
  toast as ReactToastifyToast,
  Id,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {}

export const ToastContainer: FC<Props> = () => {
  return (
    <ReactToastifyToastContainer
      hideProgressBar={true}
      draggable={false}
      theme="dark"
      position="bottom-center"
    />
  );
};

export const toast = (message: string): Id => ReactToastifyToast(message);
