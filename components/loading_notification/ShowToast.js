"use client"
import { CheckCircle2, Info, XCircle } from "lucide-react"
import { toast } from "sonner"

export function ShowToast(status='', message ='') {

    let icon = ''
    let title = ''

    switch (status) {
        case 'success' : 
            icon = <CheckCircle2 className="h-4 w-4" color="green"/>;
            title = "Success"
            break;
        case 'failed' :
        case 'error' : 
            icon =<XCircle className="h-4 w-4" color="red"/>;
            title = "Error"
            break;
        default : 
            icon = <Info className="h-4 w-4" color='blue'/>
            title = status
    }

    toast(
        title, 
        {
            icon: icon,
            description: message,
            // action: {
            //     label: "Undo",
            //     onClick: () => console.log("Undo"),
            // },
        }
    )
};

