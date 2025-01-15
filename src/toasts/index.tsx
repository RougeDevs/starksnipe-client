import {
    useWaitForTransaction,
  } from "@starknet-react/core";
  import { ReactNode } from "react";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  
  type LayoutProps = {
    children: ReactNode;
  };
  export const useFetchToastStatus = ({
    hash,
    // watch,
    onAcceptedOnL1,
    onAcceptedOnL2,
    // onNotReceived,
    onPending,
    onReceived,
    onRejected,
  }: any) => {
    // useState
    return useWaitForTransaction({
      hash,
      watch: true,
      // onNotReceived,
    });
  };
  
  const Layout = ({ children }: LayoutProps) => {
    const displayToast = (content: string) => {
      toast.error(content, {
        position: 'bottom-right',
        autoClose: false,
      });
    };
  
    return (
      <div>
        {children}
        <ToastContainer theme="dark" limit={5}/>
      </div>
    );
  };
  
  export default Layout;
  