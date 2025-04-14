import { ASPECT_RATIOS, AspectRatio } from '@/constants/imageGeneration';

interface AspectRatioSelectProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  className?: string;
}

export const AspectRatioSelect = ({
  value,
  onChange,
  className = ''
}: AspectRatioSelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as AspectRatio);
  };

  return (
    <div className={className}>
      <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700">
        Aspect Ratio
      </label>
      <select
        id="aspectRatio"
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {ASPECT_RATIOS.map((ratio) => (
          <option key={ratio.value} value={ratio.value}>
            {ratio.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 