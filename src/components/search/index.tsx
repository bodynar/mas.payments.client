import { ChangeEvent, useCallback, useState } from 'react';

import './search.scss';

import Button from '@app/sharedComponents/button';

import { generateGuid } from '@bodynarf/utils/guid';
import { isNullOrUndefined } from '@bodynarf/utils/common';

type SearchProps = {
    /** Search caption */
    caption: string;

    /** Search handler */
    onSearch: (searchPattern: string) => void;

    /** Initial search value */
    defaultValue?: string;

    /** 
     * Search type: by typing, starts from minimum characters to search
     * or by clicking on button next to search bar.
     * Default is byTyping
    */
    searchType?: 'byTyping' | 'byButton';

    /** Control name. If empty - will be replaced by random guid */
    name?: string;

    /** Minimum amount of characters to search */
    minCharsToSearch?: number;

    /** Size of search bar */
    size?: 'small' | 'normal' | 'medium' | 'large';

    /** Should search bar be rounded */
    rounded?: boolean;

    /** Is search bar disabled */
    disabled?: boolean;

    /** Should loading icon be displayed in search bar*/
    isLoading?: boolean;
};

/** Search component */
export default function Search(props: SearchProps): JSX.Element {
    const [name] = useState<string>(props.name || generateGuid());
    const [searchValue, setSearchValue] = useState<string>(props.defaultValue || '');

    const searchType = props.searchType || 'byTyping';

    const onChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const elementValue: string = event.target.value;

            if (searchType === 'byTyping') {
                const minCharsToSearch: number =
                    isNullOrUndefined(props.minCharsToSearch)
                        ? 3
                        : props.minCharsToSearch as number;

                if (elementValue.length >= minCharsToSearch) {
                    props.onSearch(elementValue);
                }
            }

            setSearchValue(elementValue);
        }, [props, searchType]);

    const onSearchButtonClick = useCallback(
        () => {
            props.onSearch(searchValue);
        }, [props, searchValue]);

    const className: string = 'app-search control'
        + ` is-${(props.size || 'normal')}`
        + (props.isLoading === true ? ' is-loading' : '')
        + (searchType === 'byButton' ? ' is-expanded': '')
        ;

    const inputClassName: string = 'input is-unselectable'
        + ` is-${(props.size || 'normal')}`
        + (props.rounded === true ? ' is-rounded' : '')
        ;

    if (searchType === 'byButton') {
        return (
            <div className="field has-addons">
                <div className={className}>
                    <input
                        type='search'
                        name={name}
                        defaultValue={searchValue}
                        className={inputClassName}
                        disabled={props.disabled}
                        onChange={onChange}
                        placeholder={props.caption}
                    />
                </div>
                <div className="control">
                    <Button
                        caption="Search"
                        type="info"
                        onClick={onSearchButtonClick}
                        isLoading={props.isLoading}
                    />
                </div>
            </div>
        );
    }
    else {
        return (
            <div className={className}>
                <input
                    type='search'
                    name={name}
                    defaultValue={searchValue}
                    className={inputClassName}
                    disabled={props.disabled}
                    onChange={onChange}
                    placeholder={props.caption}
                />
            </div>
        );
    }
}
