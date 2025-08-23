import { Skeleton } from "./../ui/skeleton";

export function LoadingSkeleton () {
    return (
        <>
            <div className="m-10">
                <div className="m-2"><Skeleton className="h-[20px] w-[100%] rounded-full" /></div>
                <div className="m-2"><Skeleton className="h-[20px] w-[90%] rounded-full" /></div>
                <div className="m-2"><Skeleton className="h-[20px] w-[70%] rounded-full" /></div>
            </div>
        </>
    )
}