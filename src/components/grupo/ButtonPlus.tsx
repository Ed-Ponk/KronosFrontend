import { Button } from '@headlessui/react';


export default function ButtonPlus({ className, action }: {className: string, action: () => void}) {

    return (
        <div className={className}>
            <Button className="inline-flex items-center gap-2 rounded-md bg-green-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none 
                                            data-[hover]:bg-green-600 
                                            data-[focus]:outline-1 
                                            data-[focus]:outline-red-600"
                onClick={() => action()}
            >
                ＋
            </Button>
        </div>

    )
}