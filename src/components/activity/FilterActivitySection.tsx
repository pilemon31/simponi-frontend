import { useState } from 'react';
import SelectActivity from './SelectActivity';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const FilterActivitySection = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  return (
    <section className="border border-gray-200 space-y-4 p-4 lg:p-6 rounded-lg w-full">
      <h2 className="font-semibold text-lg">Filter Activity</h2>
      <div className="flex flex-wrap gap-6 w-full items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-y-1">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const value = e.target.value;
                setStartDate(value ? new Date(value) : undefined);
              }}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const value = e.target.value;
                setEndDate(value ? new Date(value) : undefined);
              }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-y-1">
            <Label>Activity Type</Label>
            <SelectActivity
              onSelected={(value) => console.log('Selected:', value)}
              selectOptions={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label>Action Type</Label>
            <SelectActivity
              onSelected={(value) => console.log('Selected:', value)}
              selectOptions={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </div>
        </div>
      </div>

      <Button>Clear Filter</Button>
    </section>
  );
};

export default FilterActivitySection;
