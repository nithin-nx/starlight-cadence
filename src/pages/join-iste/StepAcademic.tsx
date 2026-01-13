const StepAcademic = ({ data, setData, next, back }: any) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Academic Details</h2>

      <Input label="Department / Branch"
        value={data.department}
        onChange={(v) => setData({ ...data, department: v })} />

      <Input label="Year of Study"
        value={data.year_of_study}
        onChange={(v) => setData({ ...data, year_of_study: v })} />

      <div className="flex gap-4 mt-6">
        <button onClick={back} className="btn-secondary w-full">Back</button>
        <button onClick={next} className="btn-primary w-full">Next</button>
      </div>
    </>
  );
};

const Input = ({ label, value, onChange }: any) => (
  <div className="mb-4">
    <label className="block mb-2 text-gray-400">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input"
      required
    />
  </div>
);

export default StepAcademic;
