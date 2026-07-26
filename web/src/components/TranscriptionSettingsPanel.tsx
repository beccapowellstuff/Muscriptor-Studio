export function TranscriptionSettingsPanel(props: {
  sampling: boolean;
  onSamplingChange: (value: boolean) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
}) {
  const {
    sampling,
    onSamplingChange,
    temperature,
    onTemperatureChange,
  } = props;

  return (
    <section className="card col-span-full px-5 pb-5 pt-4 animate-rise [animation-delay:0.28s]">
      <div className="mb-4">
        <h2 className="m-0 text-lg font-semibold">Transcription settings</h2>
        <p className="mt-2 text-faint">
          Greedy decoding is consistent. Sampling can produce a different
          interpretation of uncertain passages.
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={sampling}
          onChange={(event) => onSamplingChange(event.target.checked)}
        />
        <span className="font-medium text-content">
          Use temperature sampling
        </span>
      </label>

      <label className="mt-5 grid gap-2">
        <span className={sampling ? "text-sm text-content" : "text-sm text-faint"}>
          Temperature: {temperature.toFixed(1)}
        </span>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={temperature}
          disabled={!sampling}
          onChange={(event) => onTemperatureChange(event.target.valueAsNumber)}
        />
        <span className="text-xs text-faint">
          Lower values are more conservative; higher values allow more variation.
        </span>
      </label>
    </section>
  );
}
