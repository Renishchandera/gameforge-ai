import { useState } from 'react';

// ============================================
// REUSABLE FORM COMPONENTS
// Consistent styling and behavior across the app
// ============================================

// ----- TEXT INPUT -----
export const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  helpText,
  ...props 
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type="text"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full border rounded-lg px-3 py-2 text-sm
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
    {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
  </div>
);

// ----- TEXTAREA -----
export const TextArea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  ...props 
}) => (
  <div className="space-y-1">
    {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}
    <textarea
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      {...props}
    />
  </div>
);

// ----- SINGLE SELECT DROPDOWN (FIXED) -----
export const SelectDropdown = ({ 
  label, 
  value, 
  onChange, 
  options,
  placeholder = "Select...",
  required = false,
  error,
  showIcons = true,
  ...props 
}) => {
  // Handle both array of strings and array of objects
  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    return option.value;
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return showIcons && option.icon ? `${option.icon} ${option.label || option.value}` : (option.label || option.value);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value || ''}
        onChange={onChange}
        className={`
          w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

// ----- MULTI-SELECT DROPDOWN (Checkboxes) -----
export const MultiSelectDropdown = ({ 
  label, 
  field, 
  options, 
  selectedItems = [], 
  onChange,
  placeholder = "Select items...",
  maxHeight = "max-h-60"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize options to handle both strings and objects
  const normalizedOptions = options.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option, icon: null };
    }
    return option;
  });

  const filteredOptions = normalizedOptions.filter(option => {
    const optionLabel = option.label || option.value;
    return optionLabel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleToggleItem = (itemValue, checked) => {
    const newArray = checked 
      ? [...selectedItems, itemValue]
      : selectedItems.filter(i => i !== itemValue);
    onChange(field, newArray);
  };

  const handleRemoveItem = (itemValue, e) => {
    e.stopPropagation();
    onChange(field, selectedItems.filter(i => i !== itemValue));
  };

  // Get display label for selected items
  const getItemDisplayLabel = (itemValue) => {
    const option = normalizedOptions.find(opt => opt.value === itemValue);
    if (!option) return itemValue;
    return option.icon ? `${option.icon} ${option.label || option.value}` : (option.label || option.value);
  };

  return (
    <div className="space-y-1 relative">
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700">{label}</label>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select'}
          </button>
        </div>
      )}

      {/* Selected Items Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer hover:border-gray-400 min-h-[38px]"
      >
        {selectedItems.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedItems.map(item => (
              <span
                key={item}
                className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                {getItemDisplayLabel(item)}
                {!isOpen && (
                  <button
                    onClick={(e) => handleRemoveItem(item, e)}
                    className="ml-1 text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className={`absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg overflow-hidden`}>
            {/* Search */}
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Options */}
            <div className={`overflow-y-auto ${maxHeight} p-2`}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => {
                  const isChecked = selectedItems.includes(option.value);
                  
                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleToggleItem(option.value, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {option.icon && <span>{option.icon}</span>}
                      <span className="text-sm">{option.label || option.value}</span>
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 p-2">No options found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};