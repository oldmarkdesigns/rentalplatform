function PresetTextField({
  value,
  onChange,
  presets,
  selectPlaceholder
}) {
  const selectedPreset = presets.includes(value) ? value : "";

  return (
    <select
      className="field"
      value={selectedPreset}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    >
      <option value="">{selectPlaceholder}</option>
      {presets.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  );
}

export default PresetTextField;
