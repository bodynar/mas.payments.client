import { useState } from "react";

import { useParams } from "react-router-dom";

import { connect, useSelector } from "react-redux";

// import Multiline from "@bodynarf/react.components/components/primitives/multiline";
import Dropdown from "@bodynarf/react.components/components/dropdown";

import { CompositeAppState } from "@app/redux/rootReducer";
import { isNullOrUndefined } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";

/**
 * @private
 * Find dropdown item by value
 * @param dropdownItems Dropdown items
 * @param item Item value
 * @returns Found dropdown item; otherwise `undefined`
 */
const getDropdownItem = (dropdownItems: Array<SelectableItem>, item?: number): SelectableItem | undefined => {
    if (isNullOrUndefined(item)) {
        return undefined;
    }

    const foundItem = dropdownItems.find(({ value }) => item === +value);

    return foundItem;
};

const EditForm = (): JSX.Element => {
    const { id } = useParams();

    const payment = useSelector(({ payments }: CompositeAppState) => payments.payments.find(x => x.id === +id!));
    const types = useSelector(({ payments }: CompositeAppState) => payments.availableTypesAsDropdownItems);

    const [selectedType, setType] = useState<SelectableItem | undefined>(getDropdownItem(types, payment?.typeId));

    // const onDescriptionChange = useCallback((value: string) => { }, []);
    // const onTypeSelect = useCallback(() => { }, []);

    /**
     * TODO:
     *  1. Add form
     *      1.1. add Number input components
     *  2. Add save button, disabled until `dirty`
     *  3. On save click - validate form (value > 0, smth selected)
     *  4. All operations should be with copy of payment (see line 38)
     * 
     * 
     * TODO:
     *  create Form component with config?
     *  { name: string, type: enum, validators: Array<function>, viewConfig: object, etc}
     *  and create elements by config?
     */

    return (
        <section>
            Edit - {id}
            <div>
                <div className="field">
                    <p className="control">
                        <input
                            className="input"
                            type="number"
                            placeholder="Price"
                            defaultValue={payment!.price}
                        />
                    </p>
                </div>

                <Dropdown
                    placeholder="Type"
                    hideOnOuterClick={true}
                    onSelect={setType}
                    items={types}
                    value={selectedType}
                />

                {/* <Multiline
                    onValueChange={onDescriptionChange}
                    defaultValue={payment!.description}
                /> */}
            </div>
        </section>
    );
};

/** Payments module */
export default connect()(EditForm);
