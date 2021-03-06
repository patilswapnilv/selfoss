import React from 'react';

export default function SourceParam({
    spoutParamName,
    spoutParam,
    params = {},
    sourceErrors,
    sourceId,
    setEditedSource
}) {
    const updateSourceParam = (event) => {
        setEditedSource(({ params, ...restSource }) => ({
            ...restSource,
            params: {
                ...params,
                [spoutParamName]: event.target.value
            }
        }));
    };

    let value =
        spoutParamName in params ? params[spoutParamName] : spoutParam.default;
    let control = null;

    if (['text', 'checkbox', 'url'].includes(spoutParam.type)) {
        let checked = undefined;

        if (spoutParam.type === 'checkbox') {
            checked = value == '1';
            // Value always has to be 1 since HTML sends [name]=[value] when a checkbox is checked
            // and omits the field altogether from HTTP request when not checked.
            value = '1';
        }

        control = (
            <input
                id={`${spoutParamName}-${sourceId}`}
                type={spoutParam.type}
                name={spoutParamName}
                value={value}
                checked={checked}
                onChange={
                    spoutParam.type !== 'checkbox'
                        ? updateSourceParam
                        : (event) =>
                            updateSourceParam({
                                target: {
                                    value: event.target.checked
                                        ? '1'
                                        : undefined
                                }
                            })
                }
            />
        );
    } else if (spoutParam.type === 'password') {
        control = (
            <input
                id={`${spoutParamName}-${sourceId}`}
                type={spoutParam.type}
                name={spoutParamName}
                placeholder={selfoss.ui._('source_pwd_placeholder')}
                onChange={updateSourceParam}
            />
        );
    } else if (spoutParam.type === 'select') {
        control = (
            <select
                id={`${spoutParamName}-${sourceId}`}
                name={spoutParamName}
                size="1"
                value={value}
                onChange={updateSourceParam}
            >
                {Object.entries(spoutParam.values).map(
                    ([optionName, optionTitle]) => (
                        <option key={optionName} value={optionName}>
                            {optionTitle}
                        </option>
                    )
                )}
            </select>
        );
    } else {
        return null;
    }

    return (
        <li>
            <label htmlFor={`${spoutParamName}-${sourceId}`}>
                {spoutParam.title}
            </label>
            {control}
            {sourceErrors[spoutParamName] ? (
                <span className="error">{sourceErrors[spoutParamName]}</span>
            ) : null}
        </li>
    );
}
