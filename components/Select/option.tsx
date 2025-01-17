import React from 'react';
import cs from '../_util/classNames';
import Checkbox from '../Checkbox';
import { OptionProps } from './interface';
import omit from '../_util/omit';

function Option(props: OptionProps, ref) {
  const {
    style,
    className,
    wrapperClassName,
    disabled,
    prefixCls,
    rtl,
    value: propValue,
    children: propChildren,
    _isMultipleMode,
    _isUserCreatedOption,
    _isUserCreatingOption,
    _valueActive,
    _valueSelect,
    _onMouseEnter,
    _onMouseLeave,
    _onClick,
    ...rest
  } = props;

  const value = 'value' in props ? propValue : `${propChildren}`;
  const childNode = 'children' in props ? propChildren : `${propValue}`;

  const isChecked = _isMultipleMode
    ? (_valueSelect as any[]).indexOf(value) !== -1
    : _valueSelect === value;

  const optionLabelProps = {
    style,
    className: cs(
      `${prefixCls}-option`,
      {
        [`${prefixCls}-option-selected`]: isChecked,
        [`${prefixCls}-option-disabled`]: disabled,
        [`${prefixCls}-option-hover`]: value === _valueActive,
        [`${prefixCls}-option-empty`]: !childNode && childNode !== 0,
        [`${prefixCls}-option-rtl`]: rtl,
      },
      className
    ),
    onMouseEnter: (event) => {
      _onMouseEnter && _onMouseEnter(value);
      rest.onMouseEnter && rest.onMouseEnter(event);
    },
    onMouseLeave: (event) => {
      _onMouseLeave && _onMouseLeave();
      rest.onMouseLeave && rest.onMouseLeave(event);
    },
    onClick: (event) => {
      _onClick && _onClick(value, disabled);
      rest.onClick && rest.onClick(event);
    },
    ...omit(rest, ['_key', 'extra', 'isSelectOption', 'onClick', 'onMouseEnter', 'onMouseLeave']),
  };

  const wrapperProps = {
    ref,
    role: 'option',
    'aria-selected': isChecked,
  };
  // Mark the option that created/creating by user self
  _isUserCreatedOption && Object.assign(wrapperProps, { 'data-user-created': true });
  _isUserCreatingOption && Object.assign(wrapperProps, { 'data-user-creating': true });

  if (_isMultipleMode) {
    return (
      <ul className={`${prefixCls}-container`}>
        <li
          {...wrapperProps}
          className={cs(
            `${prefixCls}-option-wrapper`,
            {
              [`${prefixCls}-option-wrapper-selected`]: isChecked,
              [`${prefixCls}-option-wrapper-disabled`]: disabled,
            },
            wrapperClassName
          )}
        >
          <Checkbox
            aria-hidden="true"
            className={`${prefixCls}-checkbox`}
            checked={isChecked}
            disabled={disabled}
            onChange={optionLabelProps.onClick}
          />
          <span {...optionLabelProps}>{childNode}</span>
        </li>
      </ul>
    );
  }

  return (
    <ul className={`${prefixCls}-container`}>
      <li {...wrapperProps} {...optionLabelProps}>
        {childNode}
      </li>
    </ul>
  );
}

const OptionComponent = React.forwardRef<unknown, OptionProps>(Option);

OptionComponent.defaultProps = {
  // private use
  isSelectOption: true,
};

export default OptionComponent;
