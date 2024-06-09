import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { useState } from 'react'

interface option {
    id: number;
    name: string;
}

export default function ComboboxCustom({className, data_options, data, setData}: {className: string, data_options: option[], data: string, setData:  React.Dispatch<React.SetStateAction<string>>}) {
    const [query, setQuery] = useState('')
    
    const filtereddata_options =
        query === ''
            ? data_options
            : data_options.filter((option: option) => {
                return option.name.toLowerCase().includes(query.toLowerCase())
            })

    return (
        <div className={className}>
            <Combobox value={data} onChange={(value:string) => setData(value)}>
                <div className="relative ">
                    <ComboboxInput
                        className={clsx(
                            'w-full rounded-lg border-none  bg-slate-300/5 py-1.5 pr-8 pl-3 text-sm/6 text-black dark:text-white',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        displayValue={(option:option) => option?.name}
                        onChange={(event) => setQuery(event.target.value)}
                        autoComplete='off'
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 dark:text-white">
                        ↓
                    </ComboboxButton>
                </div>
                <Transition
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <ComboboxOptions
                        anchor="bottom"
                        className="w-[var(--input-width)] rounded-xl border border-white/5 bg-gray-600/75 p-1 [--anchor-gap:var(--spacing-1)] empty:hidden"
                    >
                        {filtereddata_options.map((option: option) => (
                            <ComboboxOption
                                key={option.id}
                                value={option}
                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-red-900/50"
                            >
                                <div className="text-sm/6 text-white">{option.name}</div>
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                </Transition>
            </Combobox>
        </div>
    )
}
