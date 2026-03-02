import { ToastContainer } from "react-toastify";
import styled from "styled-components";

export const StyledToastContainer = styled(ToastContainer)`
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 70px;
  .Toastify__toast {
    color: white;
    font-size: 0.9rem;
  }

  /* 성공 */
  .Toastify__toast--success {
    background-color: #28a745;
  }

  /* 경고 */
  .Toastify__toast--warning {
    background-color: #f0ad4e;
  }

  /* 에러 */
  .Toastify__toast--error {
    background-color: #dc3545;
  }

  /* 정보 */
  .Toastify__toast--info {
    background-color: #17a2b8;
  }
`;
