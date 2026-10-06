import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import styles from './index.module.css'

function SoftwareSelect({ options, value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(() => value ? value.split(',').filter(Boolean) : [])

    const toggleOption = (option) => {
        const next = selected.includes(option)
            ? selected.filter((item) => item !== option)
            : [...selected, option]
        setSelected(next)
        onChange(next.join(','))
    }

    return (
        <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
            <div className={styles.wrapper}>
                <div className={styles.trigger} onClick={() => setIsOpen((open) => !open)}>
                    {selected.length > 0
                        ? <div className={styles.selectedTags}>
                            {selected.map((option) => <span key={option} className={styles.tag}>{option}</span>)}
                        </div>
                        : <span className={styles.placeholder}>{placeholder || 'Select Tool'}</span>}
                    <KeyboardArrowDownIcon className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
                </div>
                {isOpen &&
                    <div className={styles.dropdown}>
                        {options.map((option) => {
                            const isSelected = selected.includes(option)
                            return (
                                <div key={option} className={styles.option} onClick={() => toggleOption(option)}>
                                    <span className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                                        {isSelected && <CheckIcon />}
                                    </span>
                                    <span>{option}</span>
                                </div>
                            )
                        })}
                    </div>}
            </div>
        </OutsideClickHandler>
    )
}

export default SoftwareSelect
