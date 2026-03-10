type Filter = "all" | "active" | "completed";

interface FilterBarProps {
  current: Filter;
  onChange: (filter: Filter) => void;
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "active", label: "未完了" },
  { value: "completed", label: "完了済み" },
];

const FilterBar = ({ current, onChange }: FilterBarProps) => {
  return (
    <div className="filter-bar">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          className={`filter-button${current === value ? " filter-active" : ""}`}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
