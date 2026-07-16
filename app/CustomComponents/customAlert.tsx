import { useEffect, useContext } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CircleX, CircleCheck, Info, X } from "lucide-react";
import { GlobalContext } from "../contexts";
import { IAlert } from "@/lib/types";

const CustomAlert = () => {
  // @ts-ignore
  const { alertProps, setAlertProps } = useContext(GlobalContext);

  useEffect(() => {
    if (alertProps.isOpen) {
      setTimeout(() => {
        setAlertProps((prevData: IAlert) => ({ ...prevData, isOpen: false }));
      }, 5000);
    }
  }, [alertProps.isOpen]);

  const handleIcon = () => {
    switch (alertProps.type) {
      case "success": {
        return <CircleCheck />;
      }
      case "error": {
        return <CircleX />;
      }
      case "info":
      default: {
        return <Info />;
      }
    }
  };

  const handleStyling = () => {
    switch (alertProps.type) {
      case "success": {
        return "bg-green-700 border-green-900";
      }
      case "error": {
        return "bg-red-700 border-red-900";
      }
      case "info":
      default: {
        return "bg-slate-500 border-slate-800";
      }
    }
  };

  const handleClose = () =>
    setAlertProps((prevData: IAlert) => ({ ...prevData, isOpen: false }));

  return (
    <>
      {alertProps.isOpen ? (
        <div className="absolute z-30 w-2/3 left-1/2 -translate-x-1/2 top-5/6">
          <Alert className={`text-white ${handleStyling()}`}>
            {handleIcon()}
            <AlertTitle>{alertProps.title}</AlertTitle>
            <AlertDescription className="text-white">
              {alertProps.description}
            </AlertDescription>
            <AlertAction>
              <Button variant="ghost" size="icon-xs" onClick={handleClose}>
                <X />
              </Button>
            </AlertAction>
          </Alert>
        </div>
      ) : null}
    </>
  );
};

export default CustomAlert;
