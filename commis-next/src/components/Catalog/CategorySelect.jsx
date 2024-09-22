
import styles from './styles/CategorySelect.module.css';
import catalogDataSelect from './catalogDataSelect';

const CategorySelect = ({ category, setCategory }) => {
    return (
        <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
        >
            <option className={styles.categoryHeader} value="" disabled>
                Виберіть категорію
            </option>

            {catalogDataSelect.map((categoryGroup, index) => (
                <optgroup key={index} label={categoryGroup.title}>
                    {categoryGroup.subcategories.map((subcategory, subIndex) => (
                        <option key={subIndex} value={subcategory.value}>
                            {subcategory.name}
                        </option>
                    ))}
                </optgroup>
            ))}
        </select>
    );
};

export default CategorySelect;