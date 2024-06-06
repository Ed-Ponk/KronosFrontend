import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

interface Option {
    id: number;
    name: string;
}

interface ComboboxCustomProps {
    className: string;
    data_options: Option[];
    data: Option | null;
    setData: React.Dispatch<React.SetStateAction<Option | null>>;
}

export default function ComboboxCustom2({ className, data_options, data, setData }: ComboboxCustomProps) {
    const [query, setQuery] = useState('');

    const filtereddata_options = query === ''
        ? data_options
        : data_options.filter((option: Option) => {
            return option.name.toLowerCase().includes(query.toLowerCase());
        });

    return (
        <div className={className}>
            <Combobox value={data} onChange={setData}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            'w-full rounded-lg border-none bg-slate-700/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                        displayValue={(option: Option) => option?.name}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
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
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                        {filtereddata_options.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                No se encontraron resultados
                            </div>
                        ) : (
                            filtereddata_options.map((option) => (
                                <ComboboxOption
                                    key={option.id}
                                    value={option}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {option.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active ? 'text-white' : 'text-blue-600'
                                                    }`}
                                                >
                                                    ✓
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </Transition>
            </Combobox>
        </div>
    );
}
