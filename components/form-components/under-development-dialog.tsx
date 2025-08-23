import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function UnderDevelopmentDialog({buttonText} : {buttonText : string}) {


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{buttonText}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Comming Soon</DialogTitle>
                <DialogDescription>
                This function is under development.
                </DialogDescription>
            </DialogHeader>
            
            </DialogContent>
        </Dialog>
    )
}
