import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SelectActivity = ({
  onSelected,
  selectOptions,
}: {
  onSelected: (value: string) => void;
  selectOptions: { value: string; label: string }[];
}) => {
  return (
    <Select onValueChange={onSelected}>
      <SelectTrigger className="w-fit min-w-30 cursor-pointer">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectOptions.map((option) => (
            <SelectItem
              className="cursor-pointer"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectActivity;
